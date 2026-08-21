import assert from 'node:assert/strict'
import { mkdtemp, mkdir, readFile, writeFile } from 'node:fs/promises'
import { createServer } from 'node:http'
import { once } from 'node:events'
import { createHash } from 'node:crypto'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { checkSelfUpdate, clearSyncProvider, compareVersions, connectProvider, connectWebDav, createSnapshot, ensureProfilePnpmShim, getPublicSettings, getSyncInventory, installConfiguredPlugin, installDependencySpec, listSnapshotHistory, loadSettings, loadRemoteSnapshot, lockedGitSpec, pollGithubDeviceAuthorization, pullSnapshot, sanitizeCordisPatch, sanitizeNpmrc, sanitizePnpmLock, sanitizePnpmWorkspace, signAwsV4, pushSnapshot, startGithubDeviceAuthorization, status, synchronizeSnapshots, uninstallPlugin, unlockEncryption } from '../lib/core.js'

process.env.NODE_ENV = 'test'
const packageVersion = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8')).version

function githubRelease(version, archive) {
  const asset = `dickpy-dsh-cloud-sync-${version}.tgz`
  return {
    tag_name: `v${version}`,
    draft: false,
    prerelease: false,
    assets: [{ name: asset, browser_download_url: `https://github.com/dickpy/dsh-cloud-sync/releases/download/v${version}/${asset}`, digest: `sha256:${createHash('sha256').update(archive).digest('hex')}` }],
  }
}

function githubFetcher(release, archive) {
  return async url => {
    if (url === 'https://api.github.com/repos/dickpy/dsh-cloud-sync/releases/latest') return new Response(JSON.stringify(release))
    return new Response(archive)
  }
}

const home = await mkdtemp(join(tmpdir(), 'dsh-sync-home-'))
const profile = join(home, 'profiles', 'web')
const localPlugin = join(home, 'work', 'imagegen')
const objects = new Map()
const objectStorageRequests = []
const webdavMissing = new Set(['DSH-Sync'])
const webdavMkcols = []
const server = createServer(async (request, response) => {
  const rawKey = new URL(request.url, 'http://localhost').pathname.replace(/^\//, '')
  const virtualBucket = request.headers.host?.toLowerCase().startsWith('test-bucket.localhost:') ? 'test-bucket' : ''
  const key = virtualBucket !== '' && rawKey.startsWith('storage/') ? `storage/${virtualBucket}/${rawKey.slice('storage/'.length)}` : rawKey
  if (key.startsWith('storage/')) objectStorageRequests.push({ method: request.method, key, host: request.headers.host, authorization: request.headers.authorization, payloadHash: request.headers['x-amz-content-sha256'], ifMatch: request.headers['if-match'], ifNoneMatch: request.headers['if-none-match'], forbidOverwrite: request.headers['x-oss-forbid-overwrite'] })
  if (request.method === 'HEAD' && key.replace(/\/$/, '') === 'storage/test-bucket') { response.writeHead(200, { etag: '"bucket"' }); response.end(); return }
  if (request.method === 'PROPFIND' && webdavMissing.has(key)) { response.writeHead(404); response.end(); return }
  if (request.method === 'PROPFIND') { response.writeHead(207); response.end(); return }
  if (request.method === 'MKCOL') { webdavMkcols.push(key); webdavMissing.delete(key); response.writeHead(201); response.end(); return }
  if (request.method === 'PUT') {
    const chunks = []; for await (const chunk of request) chunks.push(chunk)
    if (request.headers.authorization?.includes('key-oss/') && request.method === 'PUT' && key.endsWith('/snapshots/latest.json.gz') && (request.headers['if-match'] !== undefined || request.headers['if-none-match'] !== undefined || request.headers['x-oss-forbid-overwrite'] !== undefined)) { response.writeHead(400); response.end(); return }
    objects.set(key, Buffer.concat(chunks)); response.writeHead(201); response.end(); return
  }
  if (request.method === 'GET' && objects.has(key)) { response.writeHead(200, { etag: '"snapshot"' }); response.end(objects.get(key)); return }
  response.writeHead(404); response.end()
})
server.listen(0, '127.0.0.1')
await once(server, 'listening')
const { port } = server.address()
await mkdir(profile, { recursive: true }); await mkdir(localPlugin, { recursive: true })
await writeFile(join(profile, 'package.json'), JSON.stringify({ name: 'dsh-profile-web', dependencies: { '@example/local': 'link:../../work/imagegen' }, dsh: { profile: { bundles: ['@example/local'] } } }))
await writeFile(join(profile, 'cordis.patch.yml'), '[]\n')
await writeFile(join(localPlugin, 'package.json'), JSON.stringify({ name: '@example/local', version: '1.0.0', dsh: { bundle: { patch: './cordis.patch.yml' } } }))
await writeFile(join(localPlugin, 'cordis.patch.yml'), '[]\n')
await writeFile(join(localPlugin, 'main.js'), 'export const ok = true\n')
await connectWebDav({ provider: { type: 'webdav', url: `http://127.0.0.1:${port}/DSH-Sync`, username: 'test', password: 'secret', allowInsecure: true } }, { home })
assert.deepEqual(webdavMkcols, ['DSH-Sync'])
const nestedHome = await mkdtemp(join(tmpdir(), 'dsh-sync-nested-'))
webdavMissing.add('dav/DSH-Sync')
await connectWebDav({ provider: { type: 'webdav', url: `http://127.0.0.1:${port}/dav/DSH-Sync`, username: 'test', password: 'secret', allowInsecure: true } }, { home: nestedHome })
assert.deepEqual(webdavMkcols.slice(-1), ['dav/DSH-Sync'])
assert.equal(webdavMkcols.includes('dav'), false)
webdavMissing.add('dav/%E4%BA%91%E5%90%8C%E6%AD%A5/%E6%B5%8B%E8%AF%95%20%E7%9B%AE%E5%BD%95')
await connectWebDav({ provider: { type: 'webdav', url: `http://127.0.0.1:${port}/dav/%E4%BA%91%E5%90%8C%E6%AD%A5/%E6%B5%8B%E8%AF%95%20%E7%9B%AE%E5%BD%95`, username: 'test', password: 'secret', allowInsecure: true } }, { home: nestedHome })
assert.deepEqual(webdavMkcols.slice(-1), ['dav/%E4%BA%91%E5%90%8C%E6%AD%A5/%E6%B5%8B%E8%AF%95%20%E7%9B%AE%E5%BD%95'])
const snapshot = await createSnapshot({ home })
assert.equal(snapshot.snapshot.profiles.length, 1)
assert.equal(snapshot.snapshot.sources.length, 0)
const pushed = await pushSnapshot({ home })
assert.deepEqual(pushed.missingLocalSources, [])
assert.deepEqual(pushed.sources, ['@example/local'])
const inventory = await getSyncInventory({ home })
assert.equal(inventory.remote.available, true)
assert.equal(inventory.plugins.find(plugin => plugin.name === '@example/local').configuredInRemote, true)
assert.equal(inventory.plugins.find(plugin => plugin.name === '@example/local').sourceArchived, true)
const marketplace = join(profile, 'node_modules', 'dsh-plugin-marketplace')
await mkdir(marketplace, { recursive: true })
await writeFile(join(marketplace, 'package.json'), JSON.stringify({ name: 'dsh-plugin-marketplace', version: '1.0.0' }))
await writeFile(join(profile, 'cordis.patch.yml'), '- insert:\n    - id: plugin-marketplace\n      name: dsh-plugin-marketplace\n    - id: keep-plugin\n      name: keep-plugin\n')
const configuredOnly = await getSyncInventory({ home })
assert.equal(configuredOnly.plugins.find(plugin => plugin.name === 'dsh-plugin-marketplace').configurationOnly, true)
const adopted = await installConfiguredPlugin({ home, packageName: 'dsh-plugin-marketplace' })
assert.equal(adopted.syncRequired, true)
assert.match(JSON.parse(await readFile(join(profile, 'package.json'), 'utf8')).dependencies['dsh-plugin-marketplace'], /^file:/)
await writeFile(join(profile, 'pnpm.cmd'), '@echo off\r\nnode "%~dp0fake-pnpm.mjs" %*\r\n')
await writeFile(join(profile, 'fake-pnpm.mjs'), `import { readFile, writeFile } from 'node:fs/promises'\nconst path = new URL('./package.json', import.meta.url)\nconst manifest = JSON.parse(await readFile(path, 'utf8'))\ndelete manifest.dependencies[process.argv.at(-1)]\nawait writeFile(path, JSON.stringify(manifest))\n`)
const uninstalled = await uninstallPlugin({ home, packageName: 'dsh-plugin-marketplace' })
assert.equal(uninstalled.patchCleanup.removed, 1)
assert.equal(uninstalled.reconciliation.bundles.includes('dsh-plugin-marketplace'), false)
assert.equal(JSON.parse(await readFile(join(profile, 'package.json'), 'utf8')).dependencies['dsh-plugin-marketplace'], undefined)
const cleanedPatch = await readFile(join(profile, 'cordis.patch.yml'), 'utf8')
assert.equal(cleanedPatch.includes('dsh-plugin-marketplace'), false)
assert.equal(cleanedPatch.includes('keep-plugin'), true)
const restoredManifestForEmptyPatch = JSON.parse(await readFile(join(profile, 'package.json'), 'utf8'))
restoredManifestForEmptyPatch.dependencies['dsh-plugin-marketplace'] = 'file:C:/restored/marketplace'
await writeFile(join(profile, 'package.json'), JSON.stringify(restoredManifestForEmptyPatch))
await writeFile(join(profile, 'cordis.patch.yml'), '- insert:\n    - id: plugin-marketplace\n      name: dsh-plugin-marketplace\n')
await uninstallPlugin({ home, packageName: 'dsh-plugin-marketplace' })
assert.equal(await readFile(join(profile, 'cordis.patch.yml'), 'utf8'), '[]\n')
const preview = await pullSnapshot({ home })
assert.equal(preview.applied, false)
assert.ok(preview.restoredSources['@example/local'])
const applied = await pullSnapshot({ home, apply: true, installDependencies: false })
assert.equal(applied.applied, true)
const restoredManifest = JSON.parse(await readFile(join(profile, 'package.json'), 'utf8'))
assert.match(restoredManifest.dependencies['@example/local'], /^file:/)
const current = await status({ home })
assert.equal(current.sourceBackups.length, 2)
assert.match(await readFile(join(preview.restoredSources['@example/local'], 'main.js'), 'utf8'), /ok/)
assert.equal(installDependencySpec('@example/remote', '0.1.13'), '@example/remote@0.1.13')
assert.equal(installDependencySpec('@example/local', 'file:C:/restored/plugin'), '@example/local@file:C:/restored/plugin')
assert.equal(lockedGitSpec({ files: { 'pnpm-lock.yaml': Buffer.from('importers:\n  .:\n    dependencies:\n      dsh-better-sidebar:\n        specifier: github:omdsh-dev/DSH-better-sidebar\n        version: https://codeload.github.com/omdsh-dev/DSH-better-sidebar/tar.gz/locked-commit\n').toString('base64') } }, 'dsh-better-sidebar', 'github:omdsh-dev/DSH-better-sidebar'), 'https://codeload.github.com/omdsh-dev/DSH-better-sidebar/tar.gz/locked-commit')
assert.equal(sanitizePnpmWorkspace('packages:\n  - .\nstoreDir: C:/other-user/store\nallowBuilds:\n  demo: true\n').includes('storeDir:'), false)
assert.equal(sanitizeCordisPatch('# profile patch\n[]\n# managed\n- id: ui-skin-demo\n  disabled: true\n').includes('\n[]\n'), false)
const selfArchive = join(home, 'dickpy-dsh-cloud-sync-0.9.0.tgz')
await writeFile(selfArchive, 'cloud-sync package')
const sourceManifest = JSON.parse(await readFile(join(profile, 'package.json'), 'utf8'))
sourceManifest.dependencies['@dickpy/dsh-cloud-sync'] = 'file:../../dickpy-dsh-cloud-sync-0.9.0.tgz'
await writeFile(join(profile, 'package.json'), JSON.stringify(sourceManifest))
const selfFreeSnapshot = await createSnapshot({ home })
const selfFreeManifest = JSON.parse(Buffer.from(selfFreeSnapshot.snapshot.profiles[0].files['package.json'], 'base64').toString('utf8'))
assert.equal(selfFreeManifest.dependencies['@dickpy/dsh-cloud-sync'], undefined)
assert.equal(selfFreeManifest.dsh.profile.bundles.includes('@dickpy/dsh-cloud-sync'), false)
assert.equal(sanitizePnpmLock("importers:\n  .:\n    dependencies:\n      '@dickpy/dsh-cloud-sync':\n        specifier: file:C:/old.tgz\n        version: file:../../old.tgz\n      demo:\n        specifier: 1.0.0\npackages:\n  '@dickpy/dsh-cloud-sync@file:../../old.tgz':\n    resolution: {tarball: file:../../old.tgz}\nsnapshots:\n  '@dickpy/dsh-cloud-sync@file:../../old.tgz': {}\n").includes('dsh-cloud-sync'), false)
const released = await synchronizeSnapshots({ home, strategy: 'local' })
assert.equal(released.direction, 'uploaded')
const sameVersionRevision = Buffer.from('same version cloud sync repair')
const sameVersionUpdate = await checkSelfUpdate({ home, fetcher: githubFetcher(githubRelease(packageVersion, sameVersionRevision), sameVersionRevision) })
assert.equal(sameVersionUpdate.available, true)
assert.equal(sameVersionUpdate.sameVersionRevision, true)
const newHome = await mkdtemp(join(tmpdir(), 'dsh-sync-new-home-'))
const newProfile = join(newHome, 'profiles', 'web')
await mkdir(newProfile, { recursive: true })
await writeFile(join(newProfile, 'package.json'), JSON.stringify({ name: 'dsh-profile-web', dependencies: { '@dickpy/dsh-cloud-sync': 'file:C:/cloud-sync.tgz' }, dsh: { profile: { bundles: ['@deepseek-ai/dsh-base', '@dickpy/dsh-cloud-sync'] } } }))
await writeFile(join(newProfile, 'cordis.patch.yml'), '[]\n')
await writeFile(join(newProfile, 'pnpm-workspace.yaml'), 'packages:\n  - .\nstoreDir: C:/another-user/store\n')
await mkdir(join(newProfile, 'node_modules'), { recursive: true })
await writeFile(join(newProfile, 'node_modules', '.modules.yaml'), 'storeDir: C:/Users/tester/AppData/Local/pnpm/store/v11\n')
await writeFile(join(newProfile, '.npmrc'), 'fetch-retries=5\nstore-dir=C:/another-user/store\n')
const shimSource = join(newHome, 'pnpm-bin', 'pnpm.cmd')
await mkdir(join(newHome, 'pnpm-bin'), { recursive: true })
await writeFile(shimSource, '@echo off\n')
const shim = await ensureProfilePnpmShim({ home: newHome, profile: 'web', pnpmCommand: shimSource, platform: 'win32' })
assert.equal(await readFile(shim, 'utf8'), `@echo off\r\ncall "${shimSource}" %*\r\n`)
await connectWebDav({ provider: { type: 'webdav', url: `http://127.0.0.1:${port}/DSH-Sync`, username: 'test', password: 'secret', allowInsecure: true } }, { home: newHome })
const merged = await synchronizeSnapshots({ home: newHome, strategy: 'smart' })
assert.equal(merged.direction, 'merged')
assert.equal((await readFile(join(newProfile, 'pnpm-workspace.yaml'), 'utf8')).includes('storeDir:'), false)
assert.match(await readFile(join(newProfile, '.npmrc'), 'utf8'), /store-dir=C:\/Users\/tester\/AppData\/Local\/pnpm\/store\/v11/)
assert.equal((await readFile(join(newProfile, '.npmrc'), 'utf8')).includes('another-user'), false)
assert.equal(sanitizeNpmrc('fetch-retries=5\nstore-dir=C:/another-user/store\n').includes('store-dir'), false)
const mergedRemote = await loadRemoteSnapshot(newHome)
const mergedManifest = JSON.parse(Buffer.from(mergedRemote.profiles.find(item => item.name === 'web').files['package.json'], 'base64').toString('utf8'))
assert.equal(mergedManifest.dependencies['@example/local'] !== undefined, true)
assert.equal(mergedManifest.dependencies['@dickpy/dsh-cloud-sync'], undefined)
assert.equal(mergedRemote.sources.some(item => item.name === '@example/local'), true)
assert.equal(Buffer.from(mergedRemote.profiles.find(item => item.name === 'web').files['.npmrc'], 'base64').toString('utf8').includes('store-dir'), false)
assert.equal((await checkSelfUpdate({ home: newHome, fetcher: async () => new Response('', { status: 404 }) })).available, false)
const unlocked = await unlockEncryption({ passphrase: 'correct horse battery staple', enable: true }, { home: newHome })
assert.equal(unlocked.encryption.enabled, true)
assert.equal(unlocked.encryption.unlocked, true)
const encryptedSync = await synchronizeSnapshots({ home: newHome, strategy: 'local' })
assert.equal(encryptedSync.direction, 'uploaded')
assert.match(objects.get('DSH-Sync/snapshots/latest.json.gz').toString('utf8'), /dsh-cloud-sync\/encrypted\/v1/)
assert.ok((await listSnapshotHistory({ home: newHome })).length > 0)
assert.equal((await loadRemoteSnapshot(newHome)).schema, 'dsh-cloud-sync/v1')
const encryptedSecondDevice = await mkdtemp(join(tmpdir(), 'dsh-sync-encrypted-second-device-'))
await connectWebDav({ provider: { type: 'webdav', url: `http://127.0.0.1:${port}/DSH-Sync`, username: 'test', password: 'secret', allowInsecure: true } }, { home: encryptedSecondDevice })
await unlockEncryption({ passphrase: 'correct horse battery staple', enable: true }, { home: encryptedSecondDevice })
assert.equal((await loadRemoteSnapshot(encryptedSecondDevice)).schema, 'dsh-cloud-sync/v1')
const newerArchive = Buffer.from('new cloud-sync package')
const update = await checkSelfUpdate({ home: newHome, fetcher: githubFetcher(githubRelease('9.0.0', newerArchive), newerArchive) })
assert.equal(update.available, true)
assert.equal(update.release.version, '9.0.0')
assert.equal(compareVersions('0.10.0', '0.9.0') > 0, true)
assert.equal((await getPublicSettings(home)).provider.password, '<stored-locally>')
assert.equal((await readFile(join(home, 'dsh-cloud-sync', 'settings.json'), 'utf8')).includes('"secret"'), false)
const knownSignature = signAwsV4({ method: 'GET', host: 'examplebucket.s3.amazonaws.com', path: '/photos/%E4%B8%AD%E6%96%87.jpg', payloadHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', region: 'ap-east-1', service: 's3', accessKeyId: 'AKIDEXAMPLE', secretAccessKey: 'SECRETEXAMPLE', amzDate: '20260816T120000Z' })
assert.equal(knownSignature.authorization, 'AWS4-HMAC-SHA256 Credential=AKIDEXAMPLE/20260816/ap-east-1/s3/aws4_request, SignedHeaders=host;x-amz-content-sha256;x-amz-date, Signature=3672dbe6bf93e4f3dcd698dd5b05884a5b7dc68e600d03f4efd805db86480e6d')

const objectHome = await mkdtemp(join(tmpdir(), 'dsh-sync-object-storage-'))
const objectProfile = join(objectHome, 'profiles', 'web')
await mkdir(objectProfile, { recursive: true })
await writeFile(join(objectProfile, 'package.json'), JSON.stringify({ name: 'dsh-profile-web', dependencies: {}, dsh: { profile: { bundles: [] } } }))
await writeFile(join(objectProfile, 'cordis.patch.yml'), '[]\n')
const objectEndpoint = `http://localhost:${port}/storage`
const objectProvider = type => ({ type, endpoint: objectEndpoint, region: type === 'oss' ? 'cn-hangzhou' : type === 'cos' ? 'ap-guangzhou' : type === 'kodo' ? 'cn-east-1' : 'us-east-1', bucket: 'test-bucket', prefix: 'DSH-Sync', accessKeyId: `key-${type}`, secretAccessKey: `secret-${type}` })
const s3Settings = await connectProvider({ provider: objectProvider('s3') }, { home: objectHome })
assert.equal(s3Settings.provider.type, 's3')
assert.equal(s3Settings.provider.secretAccessKey, '<stored-locally>')
await assert.rejects(() => connectProvider({ provider: { ...objectProvider('oss'), secretAccessKey: '' } }, { home: objectHome }), /secret/i)
await connectProvider({ provider: objectProvider('oss') }, { home: objectHome })
await connectProvider({ provider: objectProvider('cos') }, { home: objectHome })
const reusedOss = await connectProvider({ provider: { ...objectProvider('oss'), secretAccessKey: '' } }, { home: objectHome })
assert.equal(reusedOss.provider.secretAccessKey, '<stored-locally>')
const savedProviders = (await getPublicSettings(objectHome)).savedProviders
assert.equal(savedProviders.oss.endpoint, objectEndpoint)
assert.equal(savedProviders.oss.secretStored, true)
assert.equal(savedProviders.cos.secretStored, true)
const clearedProviders = await clearSyncProvider({ home: objectHome })
assert.equal(clearedProviders.provider.type, 'none')
assert.equal(clearedProviders.savedProviders.oss.bucket, 'test-bucket')
const reenabledOss = await connectProvider({ provider: { ...objectProvider('oss'), secretAccessKey: '' } }, { home: objectHome })
assert.equal(reenabledOss.provider.secretAccessKey, '<stored-locally>')
await assert.rejects(() => connectProvider({ provider: { ...objectProvider('s3'), endpoint: `${objectEndpoint}?unsafe=true` } }, { home: objectHome }), /query parameters/i)
await assert.rejects(() => connectProvider({ provider: { ...objectProvider('s3'), prefix: '../unsafe' } }, { home: objectHome }), /prefix/i)
const ossFirstSyncHome = await mkdtemp(join(tmpdir(), 'dsh-sync-oss-first-sync-'))
const ossFirstSyncProfile = join(ossFirstSyncHome, 'profiles', 'web')
await mkdir(ossFirstSyncProfile, { recursive: true })
await writeFile(join(ossFirstSyncProfile, 'package.json'), JSON.stringify({ name: 'dsh-profile-web', dependencies: {}, dsh: { profile: { bundles: [] } } }))
await writeFile(join(ossFirstSyncProfile, 'cordis.patch.yml'), '[]\n')
await connectProvider({ provider: objectProvider('oss') }, { home: ossFirstSyncHome })
const ossFirstSync = await synchronizeSnapshots({ home: ossFirstSyncHome, strategy: 'local' })
assert.equal(ossFirstSync.direction, 'uploaded')
const ossSecondSync = await synchronizeSnapshots({ home: ossFirstSyncHome, strategy: 'local' })
assert.equal(ossSecondSync.direction, 'uploaded')
const ossSnapshotRequests = objectStorageRequests.filter(request => request.method === 'PUT' && request.authorization?.includes('key-oss/') && request.key.endsWith('/snapshots/latest.json.gz'))
assert.equal(ossSnapshotRequests.length, 2)
assert.ok(ossSnapshotRequests.every(request => request.ifMatch === undefined && request.ifNoneMatch === undefined && request.forbidOverwrite === undefined))
for (const type of ['s3', 'oss', 'cos', 'minio', 'kodo']) {
  const connected = await connectProvider({ provider: objectProvider(type) }, { home: objectHome })
  assert.equal(connected.provider.type, type)
  assert.equal(connected.provider.secretAccessKey, '<stored-locally>')
  const objectPush = await pushSnapshot({ home: objectHome })
  assert.equal(objectPush.provider.type, type)
  assert.ok(objects.has('storage/test-bucket/DSH-Sync/snapshots/latest.json.gz'))
  assert.equal((await loadRemoteSnapshot(objectHome)).schema, 'dsh-cloud-sync/v1')
}
const kodoDefaults = await connectProvider({ provider: { ...objectProvider('kodo'), region: '' } }, { home: objectHome })
assert.equal(kodoDefaults.provider.region, 'cn-east-1')
const kodoSaved = (await getPublicSettings(objectHome)).savedProviders.kodo
assert.equal(kodoSaved.secretStored, true)
assert.equal(kodoSaved.region, 'cn-east-1')
assert.ok(objectStorageRequests.some(request => request.authorization?.includes('key-kodo/') && !request.host.startsWith('test-bucket.') && request.key.startsWith('storage/test-bucket/')))
const retainedMinio = await connectProvider({ provider: { ...objectProvider('minio'), secretAccessKey: '' } }, { home: objectHome })
assert.equal(retainedMinio.provider.type, 'minio')
assert.equal((await loadSettings(objectHome)).provider.secretAccessKey, 'secret-minio')
assert.equal('url' in retainedMinio.provider, false)
assert.ok(objectStorageRequests.every(request => request.authorization?.startsWith('AWS4-HMAC-SHA256 ')))
assert.ok(objectStorageRequests.every(request => /^[a-f0-9]{64}$/.test(request.payloadHash)))
assert.ok(objectStorageRequests.some(request => request.authorization.includes('key-oss/') && request.host.startsWith('test-bucket.localhost:') && !request.key.includes('/test-bucket/test-bucket/')))
assert.ok(objectStorageRequests.some(request => request.authorization.includes('key-cos/') && request.host.startsWith('test-bucket.localhost:') && !request.key.includes('/test-bucket/test-bucket/')))
const storedObjectSettings = await readFile(join(objectHome, 'dsh-cloud-sync', 'settings.json'), 'utf8')
assert.equal(storedObjectSettings.includes('secret-minio'), false)
const gistHome = await mkdtemp(join(tmpdir(), 'dsh-sync-gist-'))
const gistProfile = join(gistHome, 'profiles', 'web')
const gistLocalPlugin = join(gistHome, 'work', 'small-plugin')
await mkdir(gistProfile, { recursive: true }); await mkdir(gistLocalPlugin, { recursive: true })
await writeFile(join(gistProfile, 'package.json'), JSON.stringify({ name: 'dsh-profile-web', dependencies: { '@example/gist-local': 'link:../../work/small-plugin' }, dsh: { profile: { bundles: ['@example/gist-local'] } } }))
await writeFile(join(gistProfile, 'cordis.patch.yml'), '[]\n')
await writeFile(join(gistLocalPlugin, 'package.json'), JSON.stringify({ name: '@example/gist-local', version: '1.0.0' }))
await writeFile(join(gistLocalPlugin, 'main.js'), 'export const gist = true\n')
const originalFetch = globalThis.fetch
const gistId = 'a'.repeat(20)
const gistFiles = {}
let gistVersion = 1
let gistPostAttempts = 0
globalThis.fetch = async (input, init = {}) => {
  const url = String(input)
  const method = init.method ?? 'GET'
  const etag = `W/\"gist-${gistVersion}\"`
  if (url === 'https://github.com/login/device/code' && method === 'POST') {
    assert.match(String(init.body), /client_id=Iv1\.test-client/)
    assert.match(String(init.body), /scope=gist/)
    return new Response(JSON.stringify({ device_code: 'device-code', user_code: 'CA50-5C57', verification_uri: 'https://github.com/login/device', verification_uri_complete: 'https://github.com/login/device?user_code=CA50-5C57', expires_in: 900, interval: 1 }))
  }
  if (url === 'https://github.com/login/oauth/access_token' && method === 'POST') return new Response(JSON.stringify({ access_token: 'github-test-token' }))
  if (url === 'https://api.github.com/user' && method === 'GET') return new Response(JSON.stringify({ login: 'tester' }), { headers: { etag } })
  if (url === 'https://api.github.com/gists' && method === 'POST') {
    assert.match(init.headers.authorization, /^Bearer github-test-token$/)
    gistPostAttempts += 1
    if (gistPostAttempts === 1) return new Response(JSON.stringify({ message: 'temporary service issue' }), { status: 503 })
    Object.assign(gistFiles, JSON.parse(init.body).files)
    return new Response(JSON.stringify({ id: gistId, files: gistFiles }), { status: 201, headers: { etag } })
  }
  if (url === `https://api.github.com/gists/${gistId}` && method === 'GET') return new Response(JSON.stringify({ id: gistId, files: gistFiles }), { headers: { etag } })
  if (url === `https://api.github.com/gists/${gistId}` && method === 'PATCH') {
    assert.equal(init.headers['if-match'], undefined)
    for (const [name, file] of Object.entries(JSON.parse(init.body).files)) {
      if (file === null) delete gistFiles[name]
      else gistFiles[name] = { content: file.content, truncated: false }
    }
    gistVersion += 1
    return new Response(JSON.stringify({ id: gistId, files: gistFiles }), { headers: { etag: `W/\"gist-${gistVersion}\"` } })
  }
  throw new Error(`Unexpected GitHub test request: ${method} ${url}`)
}
try {
  const gistSettings = await connectProvider({ provider: { type: 'gist', gistId: '', token: 'github-test-token' } }, { home: gistHome })
  assert.equal(gistSettings.provider.type, 'gist')
  assert.equal(gistPostAttempts, 2)
  assert.equal(gistSettings.syncScope.sources, false)
  assert.equal(gistSettings.provider.gistId, gistId)
  assert.equal(gistSettings.provider.token, '<stored-locally>')
  const gistPush = await synchronizeSnapshots({ home: gistHome, strategy: 'local' })
  assert.equal(gistPush.direction, 'uploaded')
  assert.deepEqual(gistPush.sources, [])
  assert.equal((await loadRemoteSnapshot(gistHome)).schema, 'dsh-cloud-sync/v1')
  assert.equal((await getPublicSettings(gistHome)).savedProviders.gist.gistId, gistId)
  process.env.DSH_CLOUD_SYNC_GITHUB_CLIENT_ID = 'Iv1.test-client'
  const deviceAuthorization = await startGithubDeviceAuthorization({ home: gistHome })
  assert.equal(deviceAuthorization.userCode, 'CA50-5C57')
  assert.equal((await pollGithubDeviceAuthorization({ requestId: deviceAuthorization.requestId }, { home: gistHome })).status, 'connected')
  delete process.env.DSH_CLOUD_SYNC_GITHUB_CLIENT_ID
  for (let index = 0; index < 32; index += 1) {
    await writeFile(join(gistProfile, 'cordis.patch.yml'), `# ${index}\n`)
    await synchronizeSnapshots({ home: gistHome, strategy: 'local' })
  }
  assert.equal((await listSnapshotHistory({ home: gistHome })).length, 30)
  assert.ok(Object.keys(gistFiles).length <= 34)
} finally { globalThis.fetch = originalFetch }
await new Promise(resolve => server.close(resolve))
console.log('core tests passed')
