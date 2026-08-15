import assert from 'node:assert/strict'
import { mkdtemp, mkdir, readFile, writeFile } from 'node:fs/promises'
import { createServer } from 'node:http'
import { once } from 'node:events'
import { createHash } from 'node:crypto'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { checkSelfUpdate, compareVersions, connectProvider, connectWebDav, createSnapshot, ensureProfilePnpmShim, getPublicSettings, getSyncInventory, installConfiguredPlugin, installDependencySpec, listSnapshotHistory, loadSettings, loadRemoteSnapshot, lockedGitSpec, pullSnapshot, sanitizeNpmrc, sanitizePnpmLock, sanitizePnpmWorkspace, signAwsV4, pushSnapshot, status, synchronizeSnapshots, unlockEncryption } from '../lib/core.js'

process.env.NODE_ENV = 'test'

function githubRelease(version, archive) {
  const asset = `dsh-local-dsh-cloud-sync-${version}.tgz`
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
const server = createServer(async (request, response) => {
  const rawKey = new URL(request.url, 'http://localhost').pathname.replace(/^\//, '')
  const virtualBucket = request.headers.host?.toLowerCase().startsWith('test-bucket.localhost:') ? 'test-bucket' : ''
  const key = virtualBucket !== '' && rawKey.startsWith('storage/') ? `storage/${virtualBucket}/${rawKey.slice('storage/'.length)}` : rawKey
  if (key.startsWith('storage/')) objectStorageRequests.push({ method: request.method, key, host: request.headers.host, authorization: request.headers.authorization, payloadHash: request.headers['x-amz-content-sha256'] })
  if (request.method === 'HEAD' && key.replace(/\/$/, '') === 'storage/test-bucket') { response.writeHead(200, { etag: '"bucket"' }); response.end(); return }
  if (request.method === 'PROPFIND' && key === 'DSH-Sync') { response.writeHead(404); response.end(); return }
  if (request.method === 'PROPFIND') { response.writeHead(207); response.end(); return }
  if (request.method === 'MKCOL') { response.writeHead(201); response.end(); return }
  if (request.method === 'PUT') { const chunks = []; for await (const chunk of request) chunks.push(chunk); objects.set(key, Buffer.concat(chunks)); response.writeHead(201); response.end(); return }
  if (request.method === 'GET' && objects.has(key)) { response.writeHead(200); response.end(objects.get(key)); return }
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
await writeFile(join(profile, 'cordis.patch.yml'), '- insert:\n    - id: plugin-marketplace\n      name: dsh-plugin-marketplace\n')
const configuredOnly = await getSyncInventory({ home })
assert.equal(configuredOnly.plugins.find(plugin => plugin.name === 'dsh-plugin-marketplace').configurationOnly, true)
const adopted = await installConfiguredPlugin({ home, packageName: 'dsh-plugin-marketplace' })
assert.equal(adopted.syncRequired, true)
assert.match(JSON.parse(await readFile(join(profile, 'package.json'), 'utf8')).dependencies['dsh-plugin-marketplace'], /^file:/)
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
const selfArchive = join(home, 'dsh-local-dsh-cloud-sync-0.9.0.tgz')
await writeFile(selfArchive, 'cloud-sync package')
const sourceManifest = JSON.parse(await readFile(join(profile, 'package.json'), 'utf8'))
sourceManifest.dependencies['@dsh-local/dsh-cloud-sync'] = 'file:../../dsh-local-dsh-cloud-sync-0.9.0.tgz'
await writeFile(join(profile, 'package.json'), JSON.stringify(sourceManifest))
const selfFreeSnapshot = await createSnapshot({ home })
const selfFreeManifest = JSON.parse(Buffer.from(selfFreeSnapshot.snapshot.profiles[0].files['package.json'], 'base64').toString('utf8'))
assert.equal(selfFreeManifest.dependencies['@dsh-local/dsh-cloud-sync'], undefined)
assert.equal(selfFreeManifest.dsh.profile.bundles.includes('@dsh-local/dsh-cloud-sync'), false)
assert.equal(sanitizePnpmLock("importers:\n  .:\n    dependencies:\n      '@dsh-local/dsh-cloud-sync':\n        specifier: file:C:/old.tgz\n        version: file:../../old.tgz\n      demo:\n        specifier: 1.0.0\npackages:\n  '@dsh-local/dsh-cloud-sync@file:../../old.tgz':\n    resolution: {tarball: file:../../old.tgz}\nsnapshots:\n  '@dsh-local/dsh-cloud-sync@file:../../old.tgz': {}\n").includes('dsh-cloud-sync'), false)
const released = await synchronizeSnapshots({ home, strategy: 'local' })
assert.equal(released.direction, 'uploaded')
const sameVersionRevision = Buffer.from('same version cloud sync repair')
const sameVersionUpdate = await checkSelfUpdate({ home, fetcher: githubFetcher(githubRelease('0.19.1', sameVersionRevision), sameVersionRevision) })
assert.equal(sameVersionUpdate.available, true)
assert.equal(sameVersionUpdate.sameVersionRevision, true)
const newHome = await mkdtemp(join(tmpdir(), 'dsh-sync-new-home-'))
const newProfile = join(newHome, 'profiles', 'web')
await mkdir(newProfile, { recursive: true })
await writeFile(join(newProfile, 'package.json'), JSON.stringify({ name: 'dsh-profile-web', dependencies: { '@dsh-local/dsh-cloud-sync': 'file:C:/cloud-sync.tgz' }, dsh: { profile: { bundles: ['@deepseek-ai/dsh-base', '@dsh-local/dsh-cloud-sync'] } } }))
await writeFile(join(newProfile, 'cordis.patch.yml'), '[]\n')
await writeFile(join(newProfile, 'pnpm-workspace.yaml'), 'packages:\n  - .\nstoreDir: C:/another-user/store\n')
await mkdir(join(newProfile, 'node_modules'), { recursive: true })
await writeFile(join(newProfile, 'node_modules', '.modules.yaml'), 'storeDir: C:/Users/V28774.Huang/AppData/Local/pnpm/store/v11\n')
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
assert.match(await readFile(join(newProfile, '.npmrc'), 'utf8'), /store-dir=C:\/Users\/V28774\.Huang\/AppData\/Local\/pnpm\/store\/v11/)
assert.equal((await readFile(join(newProfile, '.npmrc'), 'utf8')).includes('another-user'), false)
assert.equal(sanitizeNpmrc('fetch-retries=5\nstore-dir=C:/another-user/store\n').includes('store-dir'), false)
const mergedRemote = await loadRemoteSnapshot(newHome)
const mergedManifest = JSON.parse(Buffer.from(mergedRemote.profiles.find(item => item.name === 'web').files['package.json'], 'base64').toString('utf8'))
assert.equal(mergedManifest.dependencies['@example/local'] !== undefined, true)
assert.equal(mergedManifest.dependencies['@dsh-local/dsh-cloud-sync'], undefined)
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
assert.equal((await readFile(join(home, 'dsh-cloud-sync', 'settings.json'), 'utf8')).includes('secret'), false)
const knownSignature = signAwsV4({ method: 'GET', host: 'examplebucket.s3.amazonaws.com', path: '/photos/%E4%B8%AD%E6%96%87.jpg', payloadHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', region: 'ap-east-1', service: 's3', accessKeyId: 'AKIDEXAMPLE', secretAccessKey: 'SECRETEXAMPLE', amzDate: '20260816T120000Z' })
assert.equal(knownSignature.authorization, 'AWS4-HMAC-SHA256 Credential=AKIDEXAMPLE/20260816/ap-east-1/s3/aws4_request, SignedHeaders=host;x-amz-content-sha256;x-amz-date, Signature=3672dbe6bf93e4f3dcd698dd5b05884a5b7dc68e600d03f4efd805db86480e6d')

const objectHome = await mkdtemp(join(tmpdir(), 'dsh-sync-object-storage-'))
const objectProfile = join(objectHome, 'profiles', 'web')
await mkdir(objectProfile, { recursive: true })
await writeFile(join(objectProfile, 'package.json'), JSON.stringify({ name: 'dsh-profile-web', dependencies: {}, dsh: { profile: { bundles: [] } } }))
await writeFile(join(objectProfile, 'cordis.patch.yml'), '[]\n')
const objectEndpoint = `http://localhost:${port}/storage`
const objectProvider = type => ({ type, endpoint: objectEndpoint, region: type === 'oss' ? 'cn-hangzhou' : type === 'cos' ? 'ap-guangzhou' : 'us-east-1', bucket: 'test-bucket', prefix: 'DSH-Sync', accessKeyId: `key-${type}`, secretAccessKey: `secret-${type}` })
const s3Settings = await connectProvider({ provider: objectProvider('s3') }, { home: objectHome })
assert.equal(s3Settings.provider.type, 's3')
assert.equal(s3Settings.provider.secretAccessKey, '<stored-locally>')
await assert.rejects(() => connectProvider({ provider: { ...objectProvider('oss'), secretAccessKey: '' } }, { home: objectHome }), /secret/i)
await assert.rejects(() => connectProvider({ provider: { ...objectProvider('s3'), endpoint: `${objectEndpoint}?unsafe=true` } }, { home: objectHome }), /query parameters/i)
await assert.rejects(() => connectProvider({ provider: { ...objectProvider('s3'), prefix: '../unsafe' } }, { home: objectHome }), /prefix/i)
for (const type of ['s3', 'oss', 'cos', 'minio']) {
  const connected = await connectProvider({ provider: objectProvider(type) }, { home: objectHome })
  assert.equal(connected.provider.type, type)
  assert.equal(connected.provider.secretAccessKey, '<stored-locally>')
  const objectPush = await pushSnapshot({ home: objectHome })
  assert.equal(objectPush.provider.type, type)
  assert.ok(objects.has('storage/test-bucket/DSH-Sync/snapshots/latest.json.gz'))
  assert.equal((await loadRemoteSnapshot(objectHome)).schema, 'dsh-cloud-sync/v1')
}
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
await new Promise(resolve => server.close(resolve))
console.log('core tests passed')
