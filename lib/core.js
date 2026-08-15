import { createCipheriv, createDecipheriv, createHash, randomBytes, randomUUID, scryptSync } from 'node:crypto'
import { existsSync } from 'node:fs'
import { chmod, mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises'
import { gzipSync, gunzipSync } from 'node:zlib'
import { homedir } from 'node:os'
import { basename, dirname, join, relative, resolve } from 'node:path'
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const SCHEMA = 'dsh-cloud-sync/v1'
const CONFIG_FILES = ['package.json', 'pnpm-lock.yaml', 'cordis.patch.yml', 'cordis.yml', 'pnpm-workspace.yaml', '.npmrc']
const DEFAULT_IGNORES = new Set(['node_modules', '.pnpm', '.git', '.svn', '.hg', 'dist', 'build', 'coverage', '.env', '.credentials.yaml', 'credentials.yaml', '.DS_Store'])
const MAX_SOURCE_BYTES = 100 * 1024 * 1024
const SELF_PACKAGE = '@dsh-local/dsh-cloud-sync'
const SELF_GITHUB_REPOSITORY = 'dickpy/dsh-cloud-sync'
const SELF_GITHUB_RELEASE_API = `https://api.github.com/repos/${SELF_GITHUB_REPOSITORY}/releases/latest`
const SELF_GITHUB_DOWNLOAD_PREFIX = `https://github.com/${SELF_GITHUB_REPOSITORY}/releases/download/`
const MAX_SELF_RELEASE_BYTES = 50 * 1024 * 1024
const MAX_LOCAL_BACKUPS = 10
const HISTORY_INDEX = 'snapshots/history/index.json'
const HISTORY_LIMIT = 30
const ownPackagePath = join(dirname(dirname(fileURLToPath(import.meta.url))), 'package.json')
const encryptionKeys = new Map()
const automaticSyncRuns = new Map()
const ENCRYPTED_FORMAT = 'dsh-cloud-sync/encrypted/v1'

export function dshHome(env = process.env) {
  const configured = env.DSH_HOME?.trim()
  return resolve(configured || join(homedir(), '.dsh'))
}

export function syncRoot(home = dshHome()) { return join(home, 'dsh-cloud-sync') }
export function profileDir(name, home = dshHome()) {
  if (!/^[A-Za-z0-9._-]+$/.test(name) || name === 'node_modules') throw new Error(`Invalid DSH profile name: ${JSON.stringify(name)}`)
  return join(home, 'profiles', name)
}

export async function ensureProfilePnpmShim({ profile = 'web', home = dshHome(), pnpmCommand, env = process.env, platform = process.platform } = {}) {
  if (platform !== 'win32') return undefined
  let globalShim = pnpmCommand ?? [
    join(homedir(), 'AppData', 'Roaming', 'npm', 'pnpm.cmd'),
    env.PNPM_HOME === undefined ? undefined : join(env.PNPM_HOME, 'pnpm.cmd'),
    env.APPDATA === undefined ? undefined : join(env.APPDATA, 'npm', 'pnpm.cmd'),
  ].find(candidate => candidate !== undefined && existsSync(candidate))
  if (globalShim === undefined) {
    try {
      const found = await commandOutput(spawn('where.exe', ['pnpm.cmd'], { shell: false, windowsHide: true }))
      globalShim = found.stdout.split(/\r?\n/).map(value => value.trim()).find(candidate => candidate !== '' && existsSync(candidate))
    } catch {}
  }
  if (globalShim === undefined || !existsSync(globalShim)) return undefined
  const target = join(profileDir(profile, home), 'pnpm.cmd')
  const content = `@echo off\r\ncall "${globalShim.replaceAll('"', '""')}" %*\r\n`
  if (!existsSync(target) || await readFile(target, 'utf8') !== content) await writeFile(target, content, 'utf8')
  return target
}

function hash(buffer) { return createHash('sha256').update(buffer).digest('hex') }
function encode(buffer) { return Buffer.from(buffer).toString('base64') }
function decode(value) { return Buffer.from(value, 'base64') }
function sourceSlug(name) { return name.replace(/[^A-Za-z0-9._-]+/g, '_').replace(/^_+/, '') }
function isInside(root, candidate) {
  const base = resolve(root)
  const target = resolve(candidate)
  return target === base || target.startsWith(`${base}\\`) || target.startsWith(`${base}/`)
}

async function readJson(file, fallback) {
  try { return JSON.parse(await readFile(file, 'utf8')) } catch (error) { if (error?.code === 'ENOENT') return fallback; throw error }
}
async function writeJson(file, value) { await mkdir(dirname(file), { recursive: true }); await writeFile(file, `${JSON.stringify(value, null, 2)}\n`, { encoding: 'utf8', mode: 0o600 }); await chmod(file, 0o600).catch(() => {}) }

function releaseVersionParts(version) {
  const match = typeof version === 'string' && version.match(/^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?$/)
  if (match === null || match === false) return undefined
  return { numbers: match.slice(1, 4).map(Number), prerelease: match[4] }
}

export function compareVersions(left, right) {
  const leftParts = releaseVersionParts(left)
  const rightParts = releaseVersionParts(right)
  if (leftParts === undefined || rightParts === undefined) throw new Error('Release versions must use major.minor.patch format')
  for (let index = 0; index < 3; index += 1) {
    if (leftParts.numbers[index] !== rightParts.numbers[index]) return leftParts.numbers[index] > rightParts.numbers[index] ? 1 : -1
  }
  if (leftParts.prerelease === rightParts.prerelease) return 0
  if (leftParts.prerelease === undefined) return 1
  if (rightParts.prerelease === undefined) return -1
  return leftParts.prerelease.localeCompare(rightParts.prerelease)
}

async function ownVersion() {
  const manifest = await readJson(ownPackagePath)
  if (typeof manifest?.version !== 'string') throw new Error('Cloud Sync package version is unavailable')
  releaseVersionParts(manifest.version) ?? (() => { throw new Error('Cloud Sync package version is invalid') })()
  return manifest.version
}

function selfReleaseAssetName(version) { return `dsh-local-dsh-cloud-sync-${version}.tgz` }

function parseGithubSelfRelease(value) {
  if (value === null || typeof value !== 'object' || value.draft === true || value.prerelease === true || typeof value.tag_name !== 'string' || !Array.isArray(value.assets)) throw new Error('GitHub Cloud Sync release metadata is invalid')
  const version = value.tag_name.replace(/^v/, '')
  releaseVersionParts(version) ?? (() => { throw new Error('GitHub Cloud Sync release version is invalid') })()
  const asset = value.assets.find(item => item !== null && typeof item === 'object' && item.name === selfReleaseAssetName(version))
  if (asset === undefined || typeof asset.browser_download_url !== 'string' || !asset.browser_download_url.startsWith(`${SELF_GITHUB_DOWNLOAD_PREFIX}${encodeURIComponent(value.tag_name)}/`) || typeof asset.digest !== 'string') throw new Error(`GitHub Cloud Sync release is missing ${selfReleaseAssetName(version)}`)
  const digest = asset.digest.match(/^sha256:([a-f0-9]{64})$/i)
  if (digest === null) throw new Error('GitHub Cloud Sync release checksum is invalid')
  return { packageName: SELF_PACKAGE, version, assetName: asset.name, downloadUrl: asset.browser_download_url, sha256: digest[1].toLowerCase(), createdAt: typeof value.published_at === 'string' ? value.published_at : undefined }
}

async function githubResponse(url, fetcher) {
  const response = await fetcher(url, { headers: { accept: 'application/vnd.github+json', 'user-agent': 'dsh-cloud-sync' } })
  if (!response.ok) throw new Error(`GitHub release request failed: HTTP ${response.status}`)
  return response
}

async function latestGithubSelfRelease(fetcher) {
  try { return parseGithubSelfRelease(await (await githubResponse(SELF_GITHUB_RELEASE_API, fetcher)).json()) } catch (error) {
    if ((error instanceof Error ? error.message : String(error)).includes('HTTP 404')) return undefined
    throw error
  }
}

async function downloadGithubSelfRelease(release, fetcher) {
  const response = await githubResponse(release.downloadUrl, fetcher)
  const length = Number(response.headers.get('content-length'))
  if (Number.isFinite(length) && length > MAX_SELF_RELEASE_BYTES) throw new Error('GitHub Cloud Sync release is too large')
  const archive = Buffer.from(await response.arrayBuffer())
  if (archive.length > MAX_SELF_RELEASE_BYTES) throw new Error('GitHub Cloud Sync release is too large')
  return archive
}

function configuredSelfArchive(spec, directory) {
  if (typeof spec !== 'string' || !spec.startsWith('file:')) return undefined
  const raw = spec.slice('file:'.length)
  if (!/\.tgz$/i.test(raw)) return undefined
  return resolve(directory, raw)
}

async function configuredSelfArchiveHash(home) {
  const directory = profileDir('web', home)
  const manifest = await readJson(join(directory, 'package.json'), {})
  const archivePath = configuredSelfArchive(manifest.dependencies?.[SELF_PACKAGE], directory)
  return archivePath === undefined || !existsSync(archivePath) ? undefined : hash(await readFile(archivePath))
}

export async function checkSelfUpdate({ home = dshHome(), fetcher = fetch } = {}) {
  const localVersion = await ownVersion()
  const release = await latestGithubSelfRelease(fetcher)
  if (release === undefined) return { localVersion, available: false }
  const localArchiveSha256 = await configuredSelfArchiveHash(home)
  const versionComparison = compareVersions(release.version, localVersion)
  const sameVersionRevision = versionComparison === 0 && localArchiveSha256 !== undefined && localArchiveSha256 !== release.sha256
  return { localVersion, localArchiveSha256, available: versionComparison > 0 || sameVersionRevision, sameVersionRevision, release }
}

const PORTABLE_PNPM_EXCLUDES = /^(?:storeDir|store-dir|globalDir|global-dir|globalBinDir|global-bin-dir|cacheDir|cache-dir|stateDir|state-dir|configDir|config-dir):/
const PORTABLE_NPMRC_EXCLUDES = /^\s*(?:storeDir|store-dir|globalDir|global-dir|globalBinDir|global-bin-dir|cacheDir|cache-dir|stateDir|state-dir|configDir|config-dir)\s*=/i
export function sanitizePnpmWorkspace(text) {
  return text.split(/\r?\n/).filter(line => !PORTABLE_PNPM_EXCLUDES.test(line.trim())).join('\n').replace(/\n+$/, '') + '\n'
}
export function sanitizeNpmrc(text) {
  return text.split(/\r?\n/).filter(line => !PORTABLE_NPMRC_EXCLUDES.test(line)).join('\n').replace(/\n+$/, '') + '\n'
}
export function sanitizePnpmLock(text) {
  const lines = text.split(/\r?\n/)
  const kept = []
  let skippedIndent
  for (const line of lines) {
    const indentation = line.match(/^\s*/)?.[0].length ?? 0
    if (skippedIndent !== undefined && (line.trim() === '' || indentation > skippedIndent)) continue
    skippedIndent = undefined
    const quoted = line.match(/^(\s+)(?:'([^']+)'|"([^"]+)"):\s*(?:\{\})?\s*$/)
    const bare = line.match(/^(\s+)([^:\s]+):\s*(?:\{\})?\s*$/)
    const key = quoted?.[2] ?? quoted?.[3] ?? bare?.[2]
    if (key === SELF_PACKAGE || key?.startsWith(`${SELF_PACKAGE}@file:`)) { skippedIndent = indentation; continue }
    kept.push(line)
  }
  return kept.join('\n').replace(/\n+$/, '') + '\n'
}
async function normalizeProfilePnpmWorkspace(directory) {
  const path = join(directory, 'pnpm-workspace.yaml')
  if (!existsSync(path)) return false
  const current = await readFile(path, 'utf8')
  const next = sanitizePnpmWorkspace(current)
  if (current === next) return false
  await writeFile(path, next, 'utf8')
  return true
}
async function normalizeProfileNpmrc(directory) {
  const path = join(directory, '.npmrc')
  if (!existsSync(path)) return false
  const current = await readFile(path, 'utf8')
  const next = sanitizeNpmrc(current)
  if (current === next) return false
  await writeFile(path, next, 'utf8')
  return true
}
async function currentProfileStore(directory) {
  const modules = join(directory, 'node_modules', '.modules.yaml')
  if (!existsSync(modules)) return undefined
  const content = await readFile(modules, 'utf8')
  const match = content.match(/^storeDir:\s*(.+?)\s*$/m)
  if (match === null) return undefined
  const value = match[1].trim().replace(/^['"]|['"]$/g, '')
  return value === '' || /[\r\n]/.test(value) ? undefined : value
}
async function repairProfilePnpmConfig(directory) {
  await normalizeProfilePnpmWorkspace(directory)
  const store = await currentProfileStore(directory)
  await normalizeProfileNpmrc(directory)
  if (store === undefined) return undefined
  const path = join(directory, '.npmrc')
  const current = existsSync(path) ? await readFile(path, 'utf8') : ''
  const portable = sanitizeNpmrc(current).replace(/\n$/, '')
  const next = `${portable}${portable === '' ? '' : '\n'}store-dir=${store.replaceAll('\\', '/')}\n`
  if (current !== next) await writeFile(path, next, 'utf8')
  return store
}

function settingsPath(home) { return join(syncRoot(home), 'settings.json') }
function credentialsPath(home) { return join(syncRoot(home), 'credentials.json') }
const defaultSettings = { provider: { type: 'webdav', url: '', username: '', password: '' }, syncPolicy: 'smart', deviceId: '', deviceName: '', autoSync: { enabled: false, intervalMinutes: 30 }, syncScope: { sources: true }, encryption: { enabled: false, salt: '' } }

async function dpapi(value, operation) {
  const script = operation === 'protect'
    ? "Add-Type -AssemblyName System.Security;$v=[Console]::In.ReadToEnd();$b=[Text.Encoding]::UTF8.GetBytes($v);[Console]::Out.Write([Convert]::ToBase64String([Security.Cryptography.ProtectedData]::Protect($b,$null,[Security.Cryptography.DataProtectionScope]::CurrentUser)))"
    : "Add-Type -AssemblyName System.Security;$v=[Console]::In.ReadToEnd();$b=[Convert]::FromBase64String($v);[Console]::Out.Write([Text.Encoding]::UTF8.GetString([Security.Cryptography.ProtectedData]::Unprotect($b,$null,[Security.Cryptography.DataProtectionScope]::CurrentUser)))"
  const child = spawn('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', script], { shell: false, windowsHide: true, stdio: ['pipe', 'pipe', 'pipe'] })
  child.stdin.end(value, 'utf8')
  const result = await commandOutput(child)
  if (result.exitCode !== 0) throw new Error('Windows DPAPI could not protect Cloud Sync credentials')
  return result.stdout.trim()
}

async function savePassword(password, home) {
  if (password === '') { await rm(credentialsPath(home), { force: true }); return }
  const payload = process.platform === 'win32' ? { scheme: 'dpapi', secret: await dpapi(password, 'protect') } : { scheme: 'file-0600', secret: password }
  await writeJson(credentialsPath(home), payload)
}

async function readPassword(home) {
  const payload = await readJson(credentialsPath(home), undefined)
  if (typeof payload?.secret !== 'string') return ''
  return payload.scheme === 'dpapi' ? dpapi(payload.secret, 'unprotect') : payload.scheme === 'file-0600' ? payload.secret : ''
}

async function persistSettings(settings, home) {
  const password = settings.provider?.type === 'webdav' ? settings.provider.password : ''
  await savePassword(password, home)
  const stored = { ...settings, provider: settings.provider?.type === 'webdav' ? { type: 'webdav', url: settings.provider.url, username: settings.provider.username, password: password === '' ? '' : '<stored-in-credentials>' } : settings.provider }
  await writeJson(settingsPath(home), stored)
}

export async function loadSettings(home = dshHome()) {
  const settings = await readJson(settingsPath(home), defaultSettings)
  if (settings.provider?.type !== 'webdav' && settings.provider?.type !== 'none') {
    await rm(credentialsPath(home), { force: true })
    const removed = { provider: { type: 'none' }, syncPolicy: normalizeSyncPolicy(settings.syncPolicy), lastConnectedAt: undefined }
    await writeJson(settingsPath(home), removed)
    return removed
  }
  if (settings.provider?.type !== 'webdav') return settings.provider?.type === 'none' ? settings : defaultSettings
  if (settings.provider.password !== '' && settings.provider.password !== '<stored-in-credentials>') {
    const password = settings.provider.password
    await persistSettings({ ...settings, provider: { ...settings.provider, password } }, home)
    return { ...settings, provider: { ...settings.provider, password } }
  }
  return { ...defaultSettings, ...settings, autoSync: { ...defaultSettings.autoSync, ...(settings.autoSync ?? {}) }, syncScope: { ...defaultSettings.syncScope, ...(settings.syncScope ?? {}) }, encryption: { ...defaultSettings.encryption, ...(settings.encryption ?? {}) }, provider: { type: 'webdav', url: settings.provider.url, username: settings.provider.username, password: settings.provider.password === '' ? '' : await readPassword(home) } }
}
export async function saveSettings(settings, home = dshHome()) {
  await persistSettings(await normalizeSettings(settings, home), home)
}

async function normalizeSettings(settings, home) {
  if (settings?.provider?.type === 'webdav') return normalizeWebDavSettings(settings, home)
  if (settings?.provider?.type === 'none') return { provider: { type: 'none' }, syncPolicy: normalizeSyncPolicy(settings.syncPolicy), lastConnectedAt: undefined }
  throw new Error('A WebDAV sync provider is required')
}

async function normalizeWebDavSettings(settings, home) {
  let endpoint
  try { endpoint = new URL(settings.provider.url) } catch { throw new Error('WebDAV URL must use HTTPS') }
  if (endpoint.protocol !== 'https:' && !(process.env.NODE_ENV === 'test' && endpoint.protocol === 'http:')) throw new Error('WebDAV must use HTTPS; HTTP Basic authentication is not supported')
  const previous = await loadSettings(home)
  const password = settings.provider.password === '' ? previous.provider?.password ?? '' : settings.provider.password
  if (typeof password !== 'string' || password === '') throw new Error('A WebDAV app password is required')
  const username = typeof settings.provider.username === 'string' ? settings.provider.username.trim() : ''
  if (username === '') throw new Error('A WebDAV username is required')
  return {
    ...previous,
    ...settings,
    provider: { type: 'webdav', url: endpoint.toString().replace(/\/+$/, ''), username, password },
    syncPolicy: normalizeSyncPolicy(settings.syncPolicy ?? previous.syncPolicy),
    autoSync: { ...defaultSettings.autoSync, ...(previous.autoSync ?? {}), ...(settings.autoSync ?? {}) },
    syncScope: { ...defaultSettings.syncScope, ...(previous.syncScope ?? {}), ...(settings.syncScope ?? {}) },
    encryption: { ...defaultSettings.encryption, ...(previous.encryption ?? {}), ...(settings.encryption ?? {}) },
    lastConnectedAt: previous.lastConnectedAt,
  }
}

function normalizeSyncPolicy(value) {
  if (value === undefined) return 'smart'
  if (!['smart', 'cloud', 'local'].includes(value)) throw new Error('Sync policy must be smart, cloud, or local')
  return value
}

function publicSettings(settings, home = dshHome()) {
  const provider = { ...settings.provider }
  if ('password' in provider) provider.password = provider.password === '' ? '' : '<stored-locally>'
  const encryption = { ...defaultSettings.encryption, ...(settings.encryption ?? {}) }
  delete encryption.salt
  encryption.unlocked = encryption.enabled && encryptionKeys.has(resolve(home))
  return { ...settings, provider, encryption }
}

export async function getPublicSettings(home = dshHome()) {
  return publicSettings(await deviceSettings(home), home)
}

async function webDavFetch(url, init = {}) {
  let lastError
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 20_000)
    try {
      const response = await fetch(url, { ...init, signal: controller.signal })
      if (response.status < 500 || attempt === 1) return response
      lastError = new Error(`HTTP ${response.status}`)
    } catch (error) {
      lastError = error
      if (attempt === 1) throw new Error(`WebDAV request failed: ${error instanceof Error && error.name === 'AbortError' ? 'timed out after 20 seconds' : error}`)
    } finally { clearTimeout(timer) }
  }
  throw lastError
}

class WebDavProvider {
  constructor({ url, username = '', password = '' }) {
    if (typeof url !== 'string' || (!/^https:\/\//.test(url) && !(process.env.NODE_ENV === 'test' && /^http:\/\//.test(url)))) throw new Error('WebDAV must use HTTPS')
    this.url = url.replace(/\/+$/, '')
    this.authorization = username === '' && password === '' ? undefined : `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`
  }
  endpoint(key) { return `${this.url}/${key.split('/').map(encodeURIComponent).join('/')}` }
  async ensureCollections(key) {
    const parts = key.split('/').slice(0, -1)
    for (let index = 1; index <= parts.length; index += 1) {
      const response = await webDavFetch(`${this.url}/${parts.slice(0, index).map(encodeURIComponent).join('/')}`, {
        method: 'MKCOL', headers: this.authorization === undefined ? {} : { authorization: this.authorization },
      })
      // Existing collections commonly return 405; reverse proxies can return 301/302.
      if (![200, 201, 204, 301, 302, 405].includes(response.status)) throw new Error(`WebDAV MKCOL failed: HTTP ${response.status}`)
    }
  }
  async put(key, body, { ifMatch, ifNoneMatch = false } = {}) {
    await this.ensureCollections(key)
    const headers = { ...(this.authorization === undefined ? {} : { authorization: this.authorization }), ...(ifMatch === undefined ? {} : { 'if-match': ifMatch }), ...(ifNoneMatch ? { 'if-none-match': '*' } : {}) }
    const response = await webDavFetch(this.endpoint(key), { method: 'PUT', headers, body })
    if (response.status === 412) throw new Error('Remote snapshot changed during sync. Refresh and retry.')
    if (!response.ok) throw new Error(`WebDAV PUT ${key} failed: HTTP ${response.status}`)
  }
  async getWithMeta(key) {
    const response = await webDavFetch(this.endpoint(key), { headers: this.authorization === undefined ? {} : { authorization: this.authorization } })
    if (!response.ok) throw new Error(`WebDAV GET ${key} failed: HTTP ${response.status}`)
    return { body: Buffer.from(await response.arrayBuffer()), etag: response.headers.get('etag') ?? undefined }
  }
  async get(key) {
    return (await this.getWithMeta(key)).body
  }
  async probe() {
    const response = await webDavFetch(this.url, { method: 'PROPFIND', headers: { ...(this.authorization === undefined ? {} : { authorization: this.authorization }), depth: '0' } })
    if ([200, 204, 207].includes(response.status)) return
    // A new directory such as /dav/DSH-Sync may not exist yet. Verify its
    // parent with the same credentials; put() will create the directory later.
    if (response.status === 404) {
      const parent = new URL(this.url)
      parent.pathname = parent.pathname.replace(/\/[^/]*$/, '') || '/'
      const parentResponse = await webDavFetch(parent, { method: 'PROPFIND', headers: { ...(this.authorization === undefined ? {} : { authorization: this.authorization }), depth: '0' } })
      if ([200, 204, 207].includes(parentResponse.status)) return
      throw new Error(`WebDAV parent directory check failed: HTTP ${parentResponse.status}`)
    }
    throw new Error(`WebDAV connection failed: HTTP ${response.status}`)
  }
}

function encryptedKey(key) { return key.startsWith('snapshots/') || key.startsWith('sources/') }
function encryptedEnvelope(body, passphrase) {
  const salt = randomBytes(16)
  const key = scryptSync(passphrase, salt, 32)
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', key, iv)
  const data = Buffer.concat([cipher.update(body), cipher.final()])
  return Buffer.from(JSON.stringify({ format: ENCRYPTED_FORMAT, salt: salt.toString('base64'), iv: iv.toString('base64'), tag: cipher.getAuthTag().toString('base64'), data: data.toString('base64') }))
}
function decryptEnvelope(body, passphrase) {
  let value
  try { value = JSON.parse(body.toString('utf8')) } catch { return body }
  if (value?.format !== ENCRYPTED_FORMAT) return body
  if (typeof value.salt !== 'string' || typeof value.iv !== 'string' || typeof value.tag !== 'string' || typeof value.data !== 'string') throw new Error('Encrypted Cloud Sync object is invalid')
  try {
    const key = scryptSync(passphrase, Buffer.from(value.salt, 'base64'), 32)
    const decipher = createDecipheriv('aes-256-gcm', key, Buffer.from(value.iv, 'base64'))
    decipher.setAuthTag(Buffer.from(value.tag, 'base64'))
    return Buffer.concat([decipher.update(Buffer.from(value.data, 'base64')), decipher.final()])
  } catch { throw new Error('Cloud Sync passphrase is incorrect or the encrypted data was modified') }
}
class EncryptedProvider {
  constructor(provider, passphrase) { this.provider = provider; this.passphrase = passphrase }
  async put(key, body, options) { return this.provider.put(key, encryptedKey(key) ? encryptedEnvelope(body, this.passphrase) : body, options) }
  async getWithMeta(key) { const remote = await this.provider.getWithMeta(key); return { ...remote, body: encryptedKey(key) ? decryptEnvelope(remote.body, this.passphrase) : remote.body } }
  async get(key) { return (await this.getWithMeta(key)).body }
  async probe() { return this.provider.probe() }
}

export function providerFrom(settings, home = dshHome()) {
  if (settings.provider.type !== 'webdav') throw new Error(`Unsupported provider: ${settings.provider.type}`)
  const provider = new WebDavProvider(settings.provider)
  if (settings.encryption?.enabled !== true) return provider
  const passphrase = encryptionKeys.get(resolve(home))
  if (passphrase === undefined) throw new Error('云同步已启用客户端加密，请先输入同步口令。')
  return new EncryptedProvider(provider, passphrase)
}

export async function connectWebDav(settings, { home = dshHome() } = {}) {
  const next = await normalizeWebDavSettings(settings, home)
  await providerFrom({ ...next, encryption: { enabled: false } }, home).probe()
  next.lastConnectedAt = new Date().toISOString()
  await persistSettings(next, home)
  return publicSettings(next, home)
}

export async function clearSyncProvider({ home = dshHome() } = {}) {
  const settings = await loadSettings(home)
  const next = { provider: { type: 'none' }, syncPolicy: normalizeSyncPolicy(settings.syncPolicy), lastConnectedAt: undefined }
  await persistSettings(next, home)
  encryptionKeys.delete(resolve(home))
  automaticSyncRuns.delete(resolve(home))
  return publicSettings(next, home)
}

async function profileFiles(name, home) {
  const dir = profileDir(name, home)
  const files = {}
  for (const filename of CONFIG_FILES) {
    const path = join(dir, filename)
    if (existsSync(path)) {
      const data = await readFile(path)
      files[filename] = encode(filename === 'pnpm-workspace.yaml' ? Buffer.from(sanitizePnpmWorkspace(data.toString('utf8'))) : filename === '.npmrc' ? Buffer.from(sanitizeNpmrc(data.toString('utf8'))) : filename === 'pnpm-lock.yaml' ? Buffer.from(sanitizePnpmLock(data.toString('utf8'))) : data)
    }
  }
  const hotDir = join(dir, '.dsh-market')
  if (existsSync(hotDir)) {
    for (const entry of await readdir(hotDir, { withFileTypes: true })) {
      if (entry.isFile() && entry.name.endsWith('.yml')) files[`.dsh-market/${entry.name}`] = encode(await readFile(join(hotDir, entry.name)))
    }
  }
  if (files['package.json'] === undefined) throw new Error(`Profile ${name} has no package.json`)
  return files
}

async function listProfiles(home) {
  const directory = join(home, 'profiles')
  if (!existsSync(directory)) return []
  const entries = await readdir(directory, { withFileTypes: true })
  return entries.filter(entry => entry.isDirectory() && entry.name !== 'node_modules' && existsSync(join(directory, entry.name, 'package.json'))).map(entry => entry.name)
}

async function loadSourceCatalog(home) { return readJson(join(syncRoot(home), 'sources.json'), { schema: SCHEMA, sources: {} }) }
async function saveSourceCatalog(catalog, home) { await writeJson(join(syncRoot(home), 'sources.json'), catalog) }

function localDependencyNames(manifest) {
  return Object.entries(manifest.dependencies ?? {}).filter(([name, spec]) => name !== SELF_PACKAGE && typeof spec === 'string' && /^(?:link:|file:|\.|[A-Za-z]:[\\/])/.test(spec)).map(([name]) => name)
}

function withoutSelfDependency(files) {
  const next = { ...files }
  const manifest = JSON.parse(decode(next['package.json']).toString('utf8'))
  if (manifest.dependencies?.[SELF_PACKAGE] !== undefined) delete manifest.dependencies[SELF_PACKAGE]
  const bundles = manifest.dsh?.profile?.bundles
  if (Array.isArray(bundles)) manifest.dsh = { ...manifest.dsh, profile: { ...manifest.dsh.profile, bundles: bundles.filter(name => name !== SELF_PACKAGE) } }
  next['package.json'] = encodeJson(manifest)
  return next
}

export async function createSnapshot({ home = dshHome(), profiles } = {}) {
  const names = profiles ?? await listProfiles(home)
  const catalog = await loadSourceCatalog(home)
  const profileData = []
  for (const name of names) {
    const files = withoutSelfDependency(await profileFiles(name, home))
    const manifest = JSON.parse(decode(files['package.json']).toString('utf8'))
    profileData.push({ name, files, localDependencies: localDependencyNames(manifest) })
  }
  const snapshot = { schema: SCHEMA, createdAt: new Date().toISOString(), profiles: profileData, sources: Object.values(catalog.sources) }
  const encoded = gzipSync(Buffer.from(JSON.stringify(snapshot)))
  return { snapshot, encoded, sha256: hash(encoded), byteLength: encoded.length }
}

export async function pushSnapshot({ home = dshHome(), profiles } = {}) {
  const missingLocalSources = await backupReachableLocalSources({ home, profiles })
  const settings = await loadSettings(home)
  const provider = providerFrom(settings, home)
  const { snapshot, encoded, sha256, byteLength } = await createSnapshot({ home, profiles })
  for (const source of snapshot.sources) {
    const local = join(syncRoot(home), 'archives', source.archive)
    if (!existsSync(local)) throw new Error(`Local source archive is missing: ${source.name}`)
    await provider.put(source.objectKey, await readFile(local))
  }
  await provider.put('snapshots/latest.json.gz', encoded)
  return { createdAt: snapshot.createdAt, profiles: snapshot.profiles.map(profile => profile.name), sources: snapshot.sources.map(source => source.name), missingLocalSources, sha256, byteLength, provider: publicSettings(settings, home).provider }
}

function profileManifest(profile) {
  const encodedManifest = profile.files?.['package.json']
  if (typeof encodedManifest !== 'string') throw new Error(`Snapshot profile ${profile.name} has no package.json`)
  return JSON.parse(decode(encodedManifest).toString('utf8'))
}

function encodeJson(value) { return encode(Buffer.from(`${JSON.stringify(value, null, 2)}\n`)) }
function equalFile(left, right) { return left === right }
function conflictChoice(resolution) { return resolution === 'cloud' || resolution === 'local' ? resolution : undefined }

function mergeProfile(cloud, local, resolution, conflicts) {
  if (cloud === undefined) return local
  if (local === undefined) return cloud
  const choice = conflictChoice(resolution)
  const cloudManifest = profileManifest(cloud)
  const localManifest = profileManifest(local)
  const mergedManifest = { ...cloudManifest, ...localManifest }
  const cloudDependencies = cloudManifest.dependencies ?? {}
  const localDependencies = localManifest.dependencies ?? {}
  const dependencies = {}
  for (const name of new Set([...Object.keys(cloudDependencies), ...Object.keys(localDependencies)])) {
    const cloudSpec = cloudDependencies[name]
    const localSpec = localDependencies[name]
    if (cloudSpec === undefined || localSpec === undefined || cloudSpec === localSpec) dependencies[name] = cloudSpec ?? localSpec
    else if (isLocalSpec(cloudSpec) && isLocalSpec(localSpec)) dependencies[name] = cloudSpec
    else if (choice !== undefined) dependencies[name] = choice === 'cloud' ? cloudSpec : localSpec
    else conflicts.push({ kind: 'dependency', profile: cloud.name, key: name, cloud: cloudSpec, local: localSpec })
  }
  mergedManifest.dependencies = dependencies
  const cloudBundles = Array.isArray(cloudManifest.dsh?.profile?.bundles) ? cloudManifest.dsh.profile.bundles : []
  const localBundles = Array.isArray(localManifest.dsh?.profile?.bundles) ? localManifest.dsh.profile.bundles : []
  mergedManifest.dsh = { ...(cloudManifest.dsh ?? {}), ...(localManifest.dsh ?? {}), profile: { ...(cloudManifest.dsh?.profile ?? {}), ...(localManifest.dsh?.profile ?? {}), bundles: [...new Set([...cloudBundles, ...localBundles])].filter(name => dependencies[name] !== undefined || name.startsWith('@deepseek-ai/dsh-')) } }
  const files = {}
  for (const name of new Set([...Object.keys(cloud.files ?? {}), ...Object.keys(local.files ?? {})])) {
    if (name === 'package.json') continue
    const cloudFile = cloud.files?.[name]
    const localFile = local.files?.[name]
    if (cloudFile === undefined || localFile === undefined || equalFile(cloudFile, localFile)) files[name] = cloudFile ?? localFile
    else if (name === 'pnpm-lock.yaml') files[name] = choice === 'local' ? localFile : cloudFile
    else if (choice !== undefined) files[name] = choice === 'cloud' ? cloudFile : localFile
    else conflicts.push({ kind: 'file', profile: cloud.name, key: name, cloud: 'changed', local: 'changed' })
  }
  files['package.json'] = encodeJson(mergedManifest)
  return { name: cloud.name, files, localDependencies: localDependencyNames(mergedManifest) }
}

function mergeSources(cloudSources, localSources, resolution, conflicts) {
  const choice = conflictChoice(resolution)
  const merged = []
  for (const name of new Set([...cloudSources.map(source => source.name), ...localSources.map(source => source.name)])) {
    const cloud = cloudSources.find(source => source.name === name)
    const local = localSources.find(source => source.name === name)
    if (cloud === undefined || local === undefined || cloud.sha256 === local.sha256) merged.push(cloud ?? local)
    else if (choice !== undefined) merged.push(choice === 'cloud' ? cloud : local)
    else conflicts.push({ kind: 'source', key: name, cloud: cloud.version, local: local.version })
  }
  return merged
}

function mergeSnapshots(cloud, local, resolution) {
  const conflicts = []
  const profiles = []
  for (const name of new Set([...cloud.profiles.map(profile => profile.name), ...local.profiles.map(profile => profile.name)])) {
    profiles.push(mergeProfile(cloud.profiles.find(profile => profile.name === name), local.profiles.find(profile => profile.name === name), resolution, conflicts))
  }
  const sources = mergeSources(cloud.sources, local.sources, resolution, conflicts)
  return { conflicts, snapshot: { schema: SCHEMA, createdAt: new Date().toISOString(), profiles, sources } }
}

function applySelectedItems(cloud, local, selectedItems) {
  if (!Array.isArray(selectedItems)) return local
  const selected = new Set(selectedItems)
  const profiles = local.profiles.map(profile => {
    const cloudProfile = cloud?.profiles.find(item => item.name === profile.name)
    if (cloudProfile === undefined) return profile
    const localManifest = profileManifest(profile)
    const cloudManifest = profileManifest(cloudProfile)
    const dependencies = { ...(localManifest.dependencies ?? {}) }
    for (const name of new Set([...Object.keys(localManifest.dependencies ?? {}), ...Object.keys(cloudManifest.dependencies ?? {})])) {
      const id = `dependency:${profile.name}:${name}`
      if (selected.has(id) || dependencies[name] === cloudManifest.dependencies?.[name]) continue
      if (cloudManifest.dependencies?.[name] === undefined) delete dependencies[name]
      else dependencies[name] = cloudManifest.dependencies[name]
    }
    const manifest = { ...localManifest, dependencies }
    const files = { ...profile.files, 'package.json': encodeJson(manifest) }
    for (const name of new Set([...Object.keys(profile.files ?? {}), ...Object.keys(cloudProfile.files ?? {})])) {
      if (name === 'package.json') continue
      const id = `config:${profile.name}:${name}`
      if (selected.has(id) || files[name] === cloudProfile.files?.[name]) continue
      if (cloudProfile.files?.[name] === undefined) delete files[name]
      else files[name] = cloudProfile.files[name]
    }
    return { ...profile, files, localDependencies: localDependencyNames(manifest) }
  })
  return { ...local, profiles }
}

async function putMergedSnapshot(provider, snapshot, home, etag) {
  for (const source of snapshot.sources) {
    const archive = join(syncRoot(home), 'archives', source.archive)
    // Archives already in WebDAV are retained. A locally-created archive is
    // uploaded before the merged snapshot references it.
    if (existsSync(archive)) await provider.put(source.objectKey, await readFile(archive))
  }
  const encoded = gzipSync(Buffer.from(JSON.stringify(snapshot)))
  await provider.put('snapshots/latest.json.gz', encoded, { ifMatch: etag })
  return { createdAt: snapshot.createdAt, profiles: snapshot.profiles.map(profile => profile.name), sources: snapshot.sources.map(source => source.name), sha256: hash(encoded), byteLength: encoded.length }
}

export async function synchronizeSnapshots({ home = dshHome(), strategy, resolveConflicts, selectedItems } = {}) {
  const settings = await deviceSettings(home)
  const policy = normalizeSyncPolicy(strategy ?? settings.syncPolicy)
  const pnpmShims = []
  for (const profile of await listProfiles(home)) {
    await repairProfilePnpmConfig(profileDir(profile, home))
    const shim = await ensureProfilePnpmShim({ profile, home })
    if (shim !== undefined) pnpmShims.push(shim)
  }
  if (policy === 'cloud') {
    const restored = await pullSnapshot({ home, apply: true })
    return { strategy: policy, direction: 'downloaded', pnpmShims, ...restored }
  }
  const missingLocalSources = settings.syncScope?.sources === false ? [] : await backupReachableLocalSources({ home })
  let local = await createSnapshot({ home })
  if (settings.syncScope?.sources === false) {
    local = { ...local, snapshot: { ...local.snapshot, sources: [] } }
    local.encoded = gzipSync(Buffer.from(JSON.stringify(local.snapshot)))
  }
  const provider = providerFrom(settings, home)
  let cloud; let cloudEtag
  try {
    const remote = await loadRemoteSnapshotData(provider)
    cloud = remote.snapshot
    cloudEtag = remote.etag
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    if (!message.includes('HTTP 404')) throw error
  }
  if (cloud === undefined || policy === 'local') {
    for (const source of local.snapshot.sources) await provider.put(source.objectKey, await readFile(join(syncRoot(home), 'archives', source.archive)))
    await provider.put('snapshots/latest.json.gz', local.encoded, { ifMatch: cloudEtag, ifNoneMatch: cloud === undefined })
    const history = await archiveHistory(provider, local.snapshot, local.encoded, { deviceId: settings.deviceId, deviceName: settings.deviceName, changes: cloud === undefined ? diffSnapshots({ profiles: [], sources: [] }, local.snapshot) : diffSnapshots(cloud, local.snapshot) })
    return { strategy: policy, direction: 'uploaded', pnpmShims, missingLocalSources, history, createdAt: local.snapshot.createdAt, profiles: local.snapshot.profiles.map(profile => profile.name), sources: local.snapshot.sources.map(source => source.name), sha256: local.sha256, byteLength: local.byteLength }
  }
  local = { ...local, snapshot: applySelectedItems(cloud, local.snapshot, selectedItems), encoded: undefined }
  local.encoded = gzipSync(Buffer.from(JSON.stringify(local.snapshot)))
  const merged = mergeSnapshots(cloud, local.snapshot, resolveConflicts)
  if (merged.conflicts.length > 0) return { strategy: policy, direction: 'needs-choice', pnpmShims, missingLocalSources, conflicts: merged.conflicts }
  const result = await putMergedSnapshot(provider, merged.snapshot, home, cloudEtag)
  const history = await archiveHistory(provider, merged.snapshot, gzipSync(Buffer.from(JSON.stringify(merged.snapshot))), { deviceId: settings.deviceId, deviceName: settings.deviceName, changes: diffSnapshots(cloud, merged.snapshot) })
  return { strategy: policy, direction: 'merged', pnpmShims, missingLocalSources, history, ...result }
}

function ignorePatternMatches(pattern, name, path) {
  if (pattern === name || pattern === path) return true
  const target = pattern.includes('/') ? path : name
  const expression = `^${pattern.replace(/[|\\{}()[\]^$+?.]/g, '\\$&').replace(/\*\*/g, '.*').replace(/\*/g, '[^/]*')}$`
  return new RegExp(expression).test(target)
}

async function collectFiles(root, extraIgnores) {
  const ignored = [...DEFAULT_IGNORES, ...extraIgnores]
  const files = []
  let total = 0
  async function walk(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const absolute = join(directory, entry.name)
      const path = relative(root, absolute).replaceAll('\\', '/')
      if (ignored.some(pattern => ignorePatternMatches(pattern, entry.name, path))) continue
      if (entry.isDirectory()) { await walk(absolute); continue }
      if (!entry.isFile()) continue
      const data = await readFile(absolute)
      total += data.length
      if (total > MAX_SOURCE_BYTES) throw new Error(`Local plugin exceeds ${MAX_SOURCE_BYTES / 1024 / 1024} MiB after exclusions`)
      files.push({ path: relative(root, absolute).replaceAll('\\', '/'), data: encode(data) })
    }
  }
  await walk(root)
  return { files, total }
}

export async function backupLocalPlugin(directory, { home = dshHome() } = {}) {
  const root = resolve(directory)
  const packagePath = join(root, 'package.json')
  if (!existsSync(packagePath)) throw new Error('Local plugin source must contain package.json')
  const manifest = await readJson(packagePath)
  if (typeof manifest.name !== 'string' || manifest.name === '') throw new Error('Local plugin package.json needs a name')
  const ignorePath = join(root, '.dshsyncignore')
  const ignores = existsSync(ignorePath) ? (await readFile(ignorePath, 'utf8')).split(/\r?\n/).map(line => line.trim()).filter(line => line !== '' && !line.startsWith('#')) : []
  const { files, total } = await collectFiles(root, ignores)
  const archiveBody = Buffer.from(JSON.stringify({ schema: `${SCHEMA}/source`, packageName: manifest.name, version: manifest.version ?? '0.0.0', files }))
  const compressed = gzipSync(archiveBody)
  const sha256 = hash(compressed)
  const archive = `${sourceSlug(manifest.name)}-${sha256.slice(0, 16)}.json.gz`
  const objectKey = `sources/${archive}`
  const archivePath = join(syncRoot(home), 'archives', archive)
  await mkdir(dirname(archivePath), { recursive: true })
  await writeFile(archivePath, compressed)
  const catalog = await loadSourceCatalog(home)
  const previous = catalog.sources[manifest.name]
  catalog.sources[manifest.name] = { name: manifest.name, version: manifest.version ?? '0.0.0', archive, objectKey, sha256, sourceBytes: total, backedUpAt: new Date().toISOString() }
  await saveSourceCatalog(catalog, home)
  if (previous?.archive !== undefined && previous.archive !== archive) await rm(join(syncRoot(home), 'archives', previous.archive), { force: true })
  return catalog.sources[manifest.name]
}

async function trimLocalBackups(home) {
  const directory = join(syncRoot(home), 'backups')
  if (!existsSync(directory)) return
  const entries = (await readdir(directory, { withFileTypes: true })).filter(entry => entry.isDirectory()).map(entry => entry.name).sort().reverse()
  await Promise.all(entries.slice(MAX_LOCAL_BACKUPS).map(name => rm(join(directory, name), { recursive: true, force: true })))
}

function localDependencyPath(spec, directory) {
  if (!isLocalSpec(spec)) return undefined
  const rawPath = spec.replace(/^(?:file:|link:)/, '')
  if (rawPath === '') return undefined
  return resolve(directory, rawPath)
}

// Capture reachable file:/link: sources during a normal Sync. This keeps the
// original machine's path out of the snapshot while making recovery automatic.
async function backupReachableLocalSources({ home, profiles }) {
  const names = profiles ?? await listProfiles(home)
  const missing = new Set()
  for (const profile of names) {
    const directory = profileDir(profile, home)
    const manifest = await readJson(join(directory, 'package.json'))
    for (const [packageName, spec] of Object.entries(manifest.dependencies ?? {})) {
      if (packageName === SELF_PACKAGE) continue
      const source = localDependencyPath(spec, directory)
      if (source === undefined) continue
      if (!existsSync(join(source, 'package.json'))) { missing.add(packageName); continue }
      const archived = await backupLocalPlugin(source, { home })
      if (archived.name !== packageName) missing.add(packageName)
    }
  }
  return [...missing].sort((left, right) => left.localeCompare(right))
}

function validateArchiveEntry(entry) {
  if (typeof entry?.path !== 'string' || entry.path === '' || entry.path.includes('..') || entry.path.startsWith('/') || entry.path.includes('\\')) throw new Error('Source archive contains an unsafe path')
  if (typeof entry.data !== 'string') throw new Error('Source archive entry has no data')
}

async function restoreSource(provider, source, home) {
  const compressed = await provider.get(source.objectKey)
  if (hash(compressed) !== source.sha256) throw new Error(`Source checksum mismatch: ${source.name}`)
  const archive = JSON.parse(gunzipSync(compressed).toString('utf8'))
  if (archive.schema !== `${SCHEMA}/source` || archive.packageName !== source.name || !Array.isArray(archive.files)) throw new Error(`Invalid source archive: ${source.name}`)
  const target = join(syncRoot(home), 'local-plugins', sourceSlug(source.name), source.sha256.slice(0, 16))
  await rm(target, { recursive: true, force: true })
  for (const entry of archive.files) { validateArchiveEntry(entry); const output = join(target, ...entry.path.split('/')); if (!isInside(target, output)) throw new Error('Source archive escaped its target'); await mkdir(dirname(output), { recursive: true }); await writeFile(output, decode(entry.data)) }
  return target
}

function parseRemoteSnapshot(compressed) {
  const snapshot = JSON.parse(gunzipSync(compressed).toString('utf8'))
  if (snapshot.schema !== SCHEMA || !Array.isArray(snapshot.profiles) || !Array.isArray(snapshot.sources)) throw new Error('Remote snapshot has an unsupported format')
  for (const profile of snapshot.profiles) {
    if (typeof profile.files?.['pnpm-workspace.yaml'] === 'string') profile.files['pnpm-workspace.yaml'] = encode(Buffer.from(sanitizePnpmWorkspace(decode(profile.files['pnpm-workspace.yaml']).toString('utf8'))))
    if (typeof profile.files?.['.npmrc'] === 'string') profile.files['.npmrc'] = encode(Buffer.from(sanitizeNpmrc(decode(profile.files['.npmrc']).toString('utf8'))))
    if (typeof profile.files?.['pnpm-lock.yaml'] === 'string') profile.files['pnpm-lock.yaml'] = encode(Buffer.from(sanitizePnpmLock(decode(profile.files['pnpm-lock.yaml']).toString('utf8'))))
    profile.files = withoutSelfDependency(profile.files)
  }
  return snapshot
}

async function loadRemoteSnapshotData(provider, key = 'snapshots/latest.json.gz') {
  const remote = await provider.getWithMeta(key)
  return { snapshot: parseRemoteSnapshot(remote.body), etag: remote.etag }
}

function snapshotDependencies(snapshot) {
  const dependencies = new Map()
  for (const profile of snapshot.profiles) {
    const manifest = profileManifest(profile)
    for (const [name, version] of Object.entries(manifest.dependencies ?? {})) dependencies.set(`${profile.name}:${name}`, { profile: profile.name, name, version })
  }
  return dependencies
}

function diffSnapshots(cloud, local) {
  const remote = snapshotDependencies(cloud)
  const current = snapshotDependencies(local)
  const items = []
  for (const key of new Set([...remote.keys(), ...current.keys()])) {
    const left = remote.get(key); const right = current.get(key)
    if (left?.version === right?.version) continue
    items.push({ id: `dependency:${key}`, kind: 'plugin', profile: left?.profile ?? right?.profile, name: left?.name ?? right?.name, local: right?.version, remote: left?.version, selected: true })
  }
  const cloudProfiles = new Map(cloud.profiles.map(profile => [profile.name, profile]))
  const localProfiles = new Map(local.profiles.map(profile => [profile.name, profile]))
  for (const profileName of new Set([...cloudProfiles.keys(), ...localProfiles.keys()])) {
    const cloudProfile = cloudProfiles.get(profileName)
    const localProfile = localProfiles.get(profileName)
    for (const name of new Set([...Object.keys(cloudProfile?.files ?? {}), ...Object.keys(localProfile?.files ?? {})])) {
      if (name === 'package.json' || cloudProfile?.files?.[name] === localProfile?.files?.[name]) continue
      items.push({ id: `config:${profileName}:${name}`, kind: 'config', profile: profileName, name, local: localProfile?.files?.[name] === undefined ? undefined : '已修改', remote: cloudProfile?.files?.[name] === undefined ? undefined : '已修改', selected: true })
    }
  }
  return items.sort((left, right) => `${left.profile}/${left.name}`.localeCompare(`${right.profile}/${right.name}`))
}

async function deviceSettings(home) {
  const settings = await loadSettings(home)
  if (typeof settings.deviceId === 'string' && settings.deviceId !== '') return settings
  const next = { ...settings, deviceId: randomUUID(), deviceName: settings.deviceName || process.env.COMPUTERNAME || process.env.HOSTNAME || '未命名设备' }
  await persistSettings(next, home)
  return next
}

async function loadHistoryIndex(provider) {
  try {
    const remote = await provider.getWithMeta(HISTORY_INDEX)
    const value = JSON.parse(remote.body.toString('utf8'))
    return { index: Array.isArray(value?.entries) ? value : { schema: SCHEMA, entries: [] }, etag: remote.etag }
  } catch (error) {
    if ((error instanceof Error ? error.message : String(error)).includes('HTTP 404')) return { index: { schema: SCHEMA, entries: [] }, etag: undefined }
    throw error
  }
}

async function archiveHistory(provider, snapshot, encoded, { deviceId, deviceName, changes }) {
  const key = `snapshots/history/${snapshot.createdAt.replace(/[:.]/g, '-')}-${hash(encoded).slice(0, 12)}.json.gz`
  await provider.put(key, encoded)
  const { index, etag } = await loadHistoryIndex(provider)
  index.entries = [{ key, createdAt: snapshot.createdAt, sha256: hash(encoded), deviceId, deviceName, changes }, ...index.entries.filter(entry => entry.key !== key)].slice(0, HISTORY_LIMIT)
  await provider.put(HISTORY_INDEX, Buffer.from(`${JSON.stringify(index, null, 2)}\n`), { ifMatch: etag, ifNoneMatch: etag === undefined })
  return index.entries[0]
}

export async function listSnapshotHistory({ home = dshHome() } = {}) {
  const settings = await loadSettings(home)
  return (await loadHistoryIndex(providerFrom(settings, home))).index.entries
}

export async function previewSyncChanges({ home = dshHome() } = {}) {
  const settings = await loadSettings(home)
  const local = await createSnapshot({ home })
  try {
    const remote = await loadRemoteSnapshotData(providerFrom(settings, home))
    return { localCreatedAt: local.snapshot.createdAt, remoteCreatedAt: remote.snapshot.createdAt, items: diffSnapshots(remote.snapshot, local.snapshot), available: true }
  } catch (error) {
    if ((error instanceof Error ? error.message : String(error)).includes('HTTP 404')) return { localCreatedAt: local.snapshot.createdAt, items: [...snapshotDependencies(local.snapshot).values()].map(item => ({ id: `dependency:${item.profile}:${item.name}`, kind: 'plugin', ...item, local: item.version, remote: undefined, selected: true })), available: false }
    throw error
  }
}

export async function updateSyncPreferences({ deviceName, autoSync, syncScope } = {}, { home = dshHome() } = {}) {
  const settings = await deviceSettings(home)
  const minutes = Number(autoSync?.intervalMinutes ?? settings.autoSync.intervalMinutes)
  if (!Number.isInteger(minutes) || minutes < 5 || minutes > 1440) throw new Error('Automatic sync interval must be between 5 and 1440 minutes')
  const next = {
    ...settings,
    deviceName: typeof deviceName === 'string' && deviceName.trim() !== '' ? deviceName.trim().slice(0, 80) : settings.deviceName,
    autoSync: { enabled: autoSync?.enabled === true, intervalMinutes: minutes },
    syncScope: { sources: syncScope?.sources !== false },
  }
  await persistSettings(next, home)
  return publicSettings(next, home)
}

export async function unlockEncryption({ passphrase, enable = false } = {}, { home = dshHome() } = {}) {
  if (typeof passphrase !== 'string' || passphrase.length < 8) throw new Error('客户端加密口令至少需要 8 个字符')
  const settings = await deviceSettings(home)
  if (settings.provider?.type !== 'webdav' || settings.provider.url === '') throw new Error('请先连接 WebDAV，再启用客户端加密')
  if (settings.encryption?.enabled === true || enable === true) {
    encryptionKeys.set(resolve(home), passphrase)
    const next = { ...settings, encryption: { enabled: true, salt: '' } }
    await persistSettings(next, home)
    return publicSettings(next, home)
  }
  throw new Error('客户端加密未启用')
}

export async function lockEncryption({ home = dshHome() } = {}) {
  encryptionKeys.delete(resolve(home))
  return publicSettings(await loadSettings(home), home)
}

export async function runAutomaticSync({ home = dshHome() } = {}) {
  const settings = await loadSettings(home)
  if (settings.autoSync?.enabled !== true || settings.provider?.type !== 'webdav' || settings.provider.url === '') return { attempted: false, reason: 'disabled' }
  if (settings.encryption?.enabled === true && !encryptionKeys.has(resolve(home))) return { attempted: false, reason: 'locked' }
  const interval = settings.autoSync.intervalMinutes * 60_000
  const previous = automaticSyncRuns.get(resolve(home)) ?? 0
  if (Date.now() - previous < interval) return { attempted: false, reason: 'not-due' }
  automaticSyncRuns.set(resolve(home), Date.now())
  const preview = await previewSyncChanges({ home })
  if (preview.items.length === 0) return { attempted: false, reason: 'unchanged' }
  const result = await synchronizeSnapshots({ home, strategy: 'smart' })
  return result.direction === 'needs-choice' ? { attempted: true, synchronized: false, reason: 'conflicts', conflicts: result.conflicts } : { attempted: true, synchronized: true, result }
}

export async function loadRemoteSnapshot(home = dshHome()) {
  const settings = await loadSettings(home)
  return (await loadRemoteSnapshotData(providerFrom(settings, home))).snapshot
}

export async function pullSnapshot({ home = dshHome(), apply = false, snapshotKey } = {}) {
  const settings = await loadSettings(home)
  const provider = providerFrom(settings, home)
  const snapshot = snapshotKey === undefined ? (await loadRemoteSnapshotData(provider)).snapshot : (await loadRemoteSnapshotData(provider, snapshotKey)).snapshot
  const restoredSources = {}
  for (const source of snapshot.sources) restoredSources[source.name] = await restoreSource(provider, source, home)
  const plan = snapshot.profiles.map(profile => ({ name: profile.name, files: Object.keys(profile.files ?? {}), localDependencies: profile.localDependencies ?? [] }))
  if (!apply) return { createdAt: snapshot.createdAt, plan, restoredSources, applied: false }
  const backup = join(syncRoot(home), 'backups', new Date().toISOString().replaceAll(':', '-'))
  const installations = []
  for (const profile of snapshot.profiles) {
    const target = profileDir(profile.name, home)
    const existingManifest = await readJson(join(target, 'package.json'), {})
    const before = existsSync(target) ? await profileFiles(profile.name, home) : {}
    await writeJson(join(backup, profile.name, 'files.json'), before)
    for (const [name, content] of Object.entries(profile.files ?? {})) {
      if (name.includes('..') || name.startsWith('/')) throw new Error(`Unsafe profile file: ${name}`)
      const output = join(target, ...name.split('/'))
      await mkdir(dirname(output), { recursive: true })
      const data = name === 'pnpm-workspace.yaml' ? Buffer.from(sanitizePnpmWorkspace(decode(content).toString('utf8'))) : name === '.npmrc' ? Buffer.from(sanitizeNpmrc(decode(content).toString('utf8'))) : name === 'pnpm-lock.yaml' ? Buffer.from(sanitizePnpmLock(decode(content).toString('utf8'))) : decode(content)
      await writeFile(output, data)
    }
    const manifestPath = join(target, 'package.json')
    const manifest = await readJson(manifestPath)
    for (const localName of profile.localDependencies ?? []) if (restoredSources[localName] !== undefined) manifest.dependencies[localName] = `file:${restoredSources[localName].replaceAll('\\', '/')}`
    if (typeof existingManifest.dependencies?.[SELF_PACKAGE] === 'string') {
      manifest.dependencies = { ...(manifest.dependencies ?? {}), [SELF_PACKAGE]: existingManifest.dependencies[SELF_PACKAGE] }
      const existingBundles = existingManifest.dsh?.profile?.bundles
      if (Array.isArray(existingBundles) && existingBundles.includes(SELF_PACKAGE)) {
        const bundles = Array.isArray(manifest.dsh?.profile?.bundles) ? manifest.dsh.profile.bundles : []
        manifest.dsh = { ...(manifest.dsh ?? {}), profile: { ...(manifest.dsh?.profile ?? {}), bundles: [...new Set([...bundles, SELF_PACKAGE])] } }
      }
    }
    await writeJson(manifestPath, manifest)
    await repairProfilePnpmConfig(target)
    // DSH may currently be loading this profile. Dependency installation is
    // deliberately deferred until the user restarts DSH.
    installations.push({ profile: profile.name, deferred: true })
  }
  await trimLocalBackups(home)
  return { createdAt: snapshot.createdAt, plan, restoredSources, installations, applied: true, backup, installDeferred: true, restartRequired: true }
}

function commandOutput(child, timeoutMs = 120_000) {
  return new Promise((resolvePromise, reject) => {
    let stdout = ''; let stderr = ''
    let timedOut = false
    const timer = setTimeout(() => { timedOut = true; child.kill() }, timeoutMs)
    child.stdout?.on('data', data => { stdout += data })
    child.stderr?.on('data', data => { stderr += data })
    child.on('error', error => { clearTimeout(timer); reject(error) })
    child.on('close', code => { clearTimeout(timer); resolvePromise({ exitCode: timedOut ? 124 : code ?? 1, stdout: stdout.slice(-8000), stderr: `${stderr}${timedOut ? '\npnpm timed out after two minutes' : ''}`.slice(-8000) }) })
  })
}

function validatePnpmArgument(value) {
  if (typeof value !== 'string' || value === '' || value.length > 4096 || /[\0\r\n"'`$&|<>^%!]/.test(value)) throw new Error('Unsafe pnpm argument rejected')
  return value
}

function pnpmCommand(dir, args) {
  const safeArgs = args.map(validatePnpmArgument)
  if (process.platform !== 'win32') return { command: 'pnpm', args: safeArgs }
  const executable = existsSync(join(dir, 'pnpm.cmd')) ? join(dir, 'pnpm.cmd') : 'pnpm.cmd'
  if (/[\r\n"%]/.test(executable)) throw new Error('Unsafe pnpm executable path rejected')
  // cmd.exe needs CALL for a .cmd target. Avoid /s here: it can preserve the
  // wrapper quotes and make cmd try to execute a literal '"pnpm.cmd"' token.
  return { command: process.env.ComSpec || 'cmd.exe', args: ['/d', '/v:off', '/c', `call "${executable}" ${safeArgs.map(value => `"${value}"`).join(' ')}`] }
}

async function runPnpm(dir, args) {
  const command = pnpmCommand(dir, args)
  return commandOutput(spawn(command.command, command.args, { cwd: dir, shell: false, windowsHide: true }))
}
function pnpmFailure(result) { return new Error(`pnpm exited ${result.exitCode}: ${result.stderr.slice(-1200) || result.stdout.slice(-1200)}`) }
function blockedBuilds(result) { return `${result.stdout}\n${result.stderr}`.includes('ERR_PNPM_IGNORED_BUILDS') }

async function packageBundle(name, dir) {
  try { const manifest = await readJson(join(dir, 'node_modules', ...name.split('/'), 'package.json')); return manifest?.dsh?.bundle?.patch !== undefined } catch { return false }
}

async function reconcileBundles(name, dir, mode) {
  const manifest = await readJson(join(dir, 'package.json'))
  const bundles = Array.isArray(manifest.dsh?.profile?.bundles) ? manifest.dsh.profile.bundles : []
  const isBundle = await packageBundle(name, dir)
  const next = mode === 'enable' && isBundle ? [...new Set([...bundles, name])] : bundles.filter(item => item !== name)
  manifest.dsh = { ...(manifest.dsh ?? {}), profile: { ...(manifest.dsh?.profile ?? {}), bundles: next } }
  await writeJson(join(dir, 'package.json'), manifest)
  return { isBundle, bundles: next }
}

export async function installPlugin({ profile = 'web', spec, packageName, home = dshHome() }) {
  if (typeof spec !== 'string' || spec.trim() === '') throw new Error('A package spec is required')
  validatePnpmArgument(spec)
  const dir = profileDir(profile, home)
  await repairProfilePnpmConfig(dir)
  const before = await readJson(join(dir, 'package.json'))
  const result = await runPnpm(dir, ['add', spec])
  const manifest = await readJson(join(dir, 'package.json'))
  const names = Object.keys(manifest.dependencies ?? {})
  const added = names.filter(name => before.dependencies?.[name] === undefined)
  const match = packageName ?? (added.length === 1 ? added[0] : names.find(name => spec === name || spec.startsWith(`${name}@`) || spec.includes(name.replace('@', ''))))
  if (result.exitCode !== 0 && (!blockedBuilds(result) || match === undefined || !await packageIsPresent(dir, match))) throw pnpmFailure(result)
  const reconciliation = match === undefined ? undefined : await reconcileBundles(match, dir, 'enable')
  return { profile, spec, installedPackage: match ?? null, reconciliation, ...result, buildApprovalRequired: result.exitCode !== 0, restartRequired: true }
}

export async function updateSelf({ home = dshHome(), fetcher = fetch } = {}) {
  const update = await checkSelfUpdate({ home, fetcher })
  if (!update.available || update.release === undefined) return { ...update, updated: false }
  const archive = await downloadGithubSelfRelease(update.release, fetcher)
  if (hash(archive) !== update.release.sha256) throw new Error('Cloud Sync update checksum verification failed')
  const output = join(syncRoot(home), 'releases', basename(update.release.assetName))
  await mkdir(dirname(output), { recursive: true })
  await writeFile(output, archive)
  const pnpmShim = await ensureProfilePnpmShim({ profile: 'web', home })
  const install = await installPlugin({ profile: 'web', packageName: SELF_PACKAGE, spec: installDependencySpec(SELF_PACKAGE, `file:${output.replaceAll('\\', '/')}`), home })
  return { ...update, updated: true, archive: output, pnpmShim, install, restartRequired: true }
}

export async function uninstallPlugin({ profile = 'web', packageName, home = dshHome() }) {
  if (typeof packageName !== 'string' || !/^(?:@[-a-zA-Z0-9_.]+\/)?[-a-zA-Z0-9_.]+$/.test(packageName)) throw new Error('A valid package name is required')
  const dir = profileDir(profile, home)
  await repairProfilePnpmConfig(dir)
  const result = await runPnpm(dir, ['remove', packageName])
  if (result.exitCode !== 0) throw pnpmFailure(result)
  const reconciliation = await reconcileBundles(packageName, dir, 'disable')
  return { profile, packageName, reconciliation, ...result, restartRequired: true }
}

export async function setPluginEnabled({ profile = 'web', packageName, enabled, home = dshHome() }) {
  const dir = profileDir(profile, home)
  const manifest = await readJson(join(dir, 'package.json'))
  if (manifest.dependencies?.[packageName] === undefined) throw new Error(`${packageName} is not installed in profile ${profile}`)
  return { profile, packageName, enabled: Boolean(enabled), ...(await reconcileBundles(packageName, dir, enabled ? 'enable' : 'disable')), restartRequired: true }
}

function isLocalSpec(spec) { return typeof spec === 'string' && /^(?:link:|file:|\.|[A-Za-z]:[\\/])/.test(spec) }

async function packageIsPresent(dir, name) { return existsSync(join(dir, 'node_modules', ...name.split('/'), 'package.json')) }

async function configuredPluginNames(directory) {
  const names = new Set()
  for (const filename of ['cordis.yml', 'cordis.patch.yml']) {
    const path = join(directory, filename)
    if (!existsSync(path)) continue
    const content = await readFile(path, 'utf8')
    for (const match of content.matchAll(/^\s*name:\s*(?:['"]([^'"]+)['"]|([^\s#]+))\s*$/gm)) {
      const name = match[1] ?? match[2]
      if (/^(?:@[-a-zA-Z0-9_.]+\/)?[-a-zA-Z0-9_.]+$/.test(name)) names.add(name)
    }
  }
  return names
}

export async function adoptConfiguredPlugin({ profile = 'web', packageName, home = dshHome() }) {
  if (typeof packageName !== 'string' || !/^(?:@[-a-zA-Z0-9_.]+\/)?[-a-zA-Z0-9_.]+$/.test(packageName)) throw new Error('A valid package name is required')
  const directory = profileDir(profile, home)
  if (!(await configuredPluginNames(directory)).has(packageName)) throw new Error(`${packageName} is not referenced by this profile configuration`)
  const packageDirectory = join(directory, 'node_modules', ...packageName.split('/'))
  if (!existsSync(join(packageDirectory, 'package.json'))) throw new Error(`${packageName} is not available in this profile's node_modules`)
  const manifestPath = join(directory, 'package.json')
  const manifest = await readJson(manifestPath)
  if (manifest.dependencies?.[packageName] !== undefined) return { profile, packageName, alreadyManaged: true }
  manifest.dependencies = { ...(manifest.dependencies ?? {}), [packageName]: `file:${packageDirectory.replaceAll('\\', '/')}` }
  await writeJson(manifestPath, manifest)
  const source = await backupLocalPlugin(packageDirectory, { home })
  return { profile, packageName, source, syncRequired: true }
}

export async function getSyncInventory({ profile = 'web', home = dshHome() } = {}) {
  const dir = profileDir(profile, home)
  const localManifest = await readJson(join(dir, 'package.json'))
  const localDependencies = localManifest.dependencies ?? {}
  const configuredNames = await configuredPluginNames(dir)
  let remote
  let remoteError
  try { remote = await loadRemoteSnapshot(home) } catch (error) { remoteError = error instanceof Error ? error.message : String(error) }
  const remoteProfile = remote?.profiles.find(item => item.name === profile)
  const remoteManifest = remoteProfile?.files?.['package.json'] === undefined ? {} : JSON.parse(decode(remoteProfile.files['package.json']).toString('utf8'))
  const remoteDependencies = remoteManifest.dependencies ?? {}
  const names = [...new Set([...Object.keys(remoteDependencies), ...Object.keys(localDependencies), ...configuredNames])].sort((left, right) => left.localeCompare(right))
  const bundles = Array.isArray(localManifest.dsh?.profile?.bundles) ? localManifest.dsh.profile.bundles : []
  const plugins = []
  for (const name of names) {
    const requested = remoteDependencies[name] ?? localDependencies[name]
    const localSource = isLocalSpec(requested)
    const configurationOnly = configuredNames.has(name) && localDependencies[name] === undefined
    const present = await packageIsPresent(dir, name)
    const bundle = present && await packageBundle(name, dir)
    plugins.push({
      name,
      requested,
      configuredInRemote: remoteDependencies[name] !== undefined || configurationOnly,
      // A present bundle outside dsh.profile.bundles is not usable yet. Show
      // it as installable so a retry reconciles the DSH layer list.
      installed: !configurationOnly && present && (!bundle || bundles.includes(name)),
      enabled: bundles.includes(name),
      localSource,
      configurationOnly,
      sourceArchived: !localSource || remote?.sources.some(source => source.name === name) === true,
    })
  }
  return {
    profile,
    remote: remote === undefined ? { available: false, error: remoteError } : { available: true, createdAt: remote.createdAt, sources: remote.sources.length },
    local: { dependencies: Object.keys(localDependencies).length, bundles: bundles.length },
    plugins,
  }
}

export function installDependencySpec(packageName, requested) {
  if (typeof packageName !== 'string' || packageName === '' || typeof requested !== 'string' || requested === '') throw new Error('A package name and dependency spec are required')
  return `${packageName}@${requested}`
}

function escapePattern(value) { return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') }
function snapshotText(profile, name) { return typeof profile.files?.[name] === 'string' ? decode(profile.files[name]).toString('utf8') : '' }

export function lockedGitSpec(profile, packageName, requested) {
  if (!requested.startsWith('github:')) return requested
  const lock = snapshotText(profile, 'pnpm-lock.yaml')
  const expression = new RegExp(`^\\s*${escapePattern(packageName)}:\\s*\\r?\\n\\s*specifier:\\s*[^\\r\\n]+\\r?\\n\\s*version:\\s*([^\\r\\n]+)`, 'm')
  const resolved = lock.match(expression)?.[1]?.trim().replace(/^['"]|['"]$/g, '')
  return typeof resolved === 'string' && /^https:\/\//.test(resolved) ? resolved : requested
}

function approvedBuildKeys(profile) {
  const workspace = snapshotText(profile, 'pnpm-workspace.yaml')
  const lines = workspace.split(/\r?\n/)
  const start = lines.findIndex(line => /^allowBuilds:\s*$/.test(line))
  if (start === -1) return []
  const keys = []
  for (let index = start + 1; index < lines.length; index += 1) {
    const line = lines[index]
    if (/^\S/.test(line)) break
    const match = line.match(/^\s+(.+?):\s*true\s*$/)
    if (match === null) continue
    const key = match[1].trim().replace(/^['"]|['"]$/g, '')
    if (key !== '' && !/[\r\n]/.test(key)) keys.push(key)
  }
  return keys
}

async function mergeApprovedBuilds(profile, directory) {
  const keys = approvedBuildKeys(profile)
  if (keys.length === 0) return []
  const workspacePath = join(directory, 'pnpm-workspace.yaml')
  const current = existsSync(workspacePath) ? await readFile(workspacePath, 'utf8') : ''
  const lines = current.split(/\r?\n/)
  let start = lines.findIndex(line => /^allowBuilds:\s*$/.test(line))
  if (start === -1) { lines.push('allowBuilds:'); start = lines.length - 1 }
  let end = start + 1
  while (end < lines.length && !/^\S/.test(lines[end])) end += 1
  const existing = new Set(lines.slice(start + 1, end).map(line => line.match(/^\s+(.+?):\s*(?:true|false)\s*$/)?.[1]?.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean))
  const missing = keys.filter(key => !existing.has(key))
  if (missing.length === 0) return []
  lines.splice(end, 0, ...missing.map(key => `  ${JSON.stringify(key)}: true`))
  await writeFile(workspacePath, `${lines.join('\n').replace(/\n+$/, '')}\n`, 'utf8')
  return missing
}

export async function installConfiguredPlugin({ profile = 'web', packageName, home = dshHome() }) {
  const directory = profileDir(profile, home)
  const localManifest = await readJson(join(directory, 'package.json'))
  if (localManifest.dependencies?.[packageName] === undefined && (await configuredPluginNames(directory)).has(packageName) && await packageIsPresent(directory, packageName)) {
    return { profile, packageName, adopted: true, ...(await adoptConfiguredPlugin({ profile, packageName, home })), restartRequired: false }
  }
  const remote = await loadRemoteSnapshot(home)
  const remoteProfile = remote.profiles.find(item => item.name === profile)
  if (remoteProfile?.files?.['package.json'] === undefined) throw new Error(`The remote snapshot has no ${profile} profile configuration`)
  const remoteManifest = JSON.parse(decode(remoteProfile.files['package.json']).toString('utf8'))
  let spec = remoteManifest.dependencies?.[packageName]
  if (typeof spec !== 'string') throw new Error(`${packageName} is not declared by the remote profile`)
  const pnpmShim = await ensureProfilePnpmShim({ profile, home })
  const approvedBuilds = await mergeApprovedBuilds(remoteProfile, directory)
  if (isLocalSpec(spec)) {
    if (!remote.sources.some(source => source.name === packageName)) throw new Error(`${packageName} is a local plugin, but its source archive was not uploaded. On the source device, update Cloud Sync and select Sync, then try again.`)
    const preview = await pullSnapshot({ home, apply: false })
    const restored = preview.restoredSources[packageName]
    if (restored === undefined) throw new Error(`${packageName} is a local plugin, but its source archive is not in the remote snapshot`)
    spec = `file:${restored.replaceAll('\\', '/')}`
  }
  else spec = lockedGitSpec(remoteProfile, packageName, spec)
  return { pnpmShim, approvedBuilds, ...(await installPlugin({ profile, packageName, spec: installDependencySpec(packageName, spec), home })) }
}

export async function status({ home = dshHome() } = {}) {
  const settings = await loadSettings(home)
  const profiles = await listProfiles(home)
  const catalog = await loadSourceCatalog(home)
  const plugins = []
  for (const name of profiles) { const manifest = await readJson(join(profileDir(name, home), 'package.json')); plugins.push({ profile: name, dependencies: Object.keys(manifest.dependencies ?? {}), bundles: manifest.dsh?.profile?.bundles ?? [] }) }
  return { version: await ownVersion(), home, provider: publicSettings(settings, home).provider, profiles: plugins, sourceBackups: Object.values(catalog.sources) }
}
