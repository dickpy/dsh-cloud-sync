import { adoptConfiguredPlugin, backupLocalPlugin, checkSelfUpdate, clearSyncProvider, connectProvider, connectWebDav, getPublicSettings, getSyncInventory, installConfiguredPlugin, listSnapshotHistory, lockEncryption, previewSyncChanges, pullSnapshot, runAutomaticSync, status, synchronizeSnapshots, unlockEncryption, uninstallPlugin, updateSelf, updateSyncPreferences } from './core.js'

export const name = 'dsh-cloud-sync'
export const inject = ['webServer']

function isLoopback(request) {
  const address = request.socket.remoteAddress
  if (!['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(address)) return false
  const host = request.headers.host
  if (typeof host !== 'string') return false
  try { if (!['127.0.0.1', 'localhost', '[::1]'].includes(new URL(`http://${host}`).hostname)) return false } catch { return false }
  return request.headers['sec-fetch-site'] !== 'cross-site'
}

async function body(request) {
  const chunks = []; let bytes = 0
  for await (const chunk of request) { bytes += chunk.length; if (bytes > 128 * 1024) throw new Error('Request body is too large'); chunks.push(chunk) }
  try { const value = JSON.parse(Buffer.concat(chunks).toString('utf8')); return value !== null && typeof value === 'object' ? value : {} } catch { throw new Error('Request body must be JSON') }
}
function send(response, code, value) { response.writeHead(code, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'referrer-policy': 'no-referrer' }); response.end(JSON.stringify(value)) }
function failure(error) { return { ok: false, message: error instanceof Error ? error.message : String(error) } }

function route(path, operation) {
  return { kind: 'exact', path, handler: async (request, response) => {
    if (!isLoopback(request)) return send(response, 403, { ok: false, message: 'loopback-only endpoint' })
    if (request.method !== 'POST') return send(response, 405, { ok: false, message: 'POST required' })
    try { send(response, 200, { ok: true, value: await operation(await body(request)) }) } catch (error) { send(response, 400, failure(error)) }
  } }
}

export function apply(ctx) {
  const routes = [
    route('/api/dsh-cloud-sync/status', () => status()),
    route('/api/dsh-cloud-sync/settings/get', () => getPublicSettings()),
    route('/api/dsh-cloud-sync/release/check', () => checkSelfUpdate()),
    route('/api/dsh-cloud-sync/release/update', () => updateSelf()),
    route('/api/dsh-cloud-sync/webdav/connect', input => connectWebDav(input)),
    route('/api/dsh-cloud-sync/provider/connect', input => connectProvider(input)),
    route('/api/dsh-cloud-sync/settings/clear-provider', () => clearSyncProvider()),
    route('/api/dsh-cloud-sync/settings/preferences', input => updateSyncPreferences(input)),
    route('/api/dsh-cloud-sync/security/unlock', input => unlockEncryption(input)),
    route('/api/dsh-cloud-sync/security/lock', () => lockEncryption()),
    route('/api/dsh-cloud-sync/snapshot/diff', () => previewSyncChanges()),
    route('/api/dsh-cloud-sync/snapshot/history', () => listSnapshotHistory()),
    route('/api/dsh-cloud-sync/snapshot/push', input => synchronizeSnapshots({ strategy: input.strategy, resolveConflicts: input.resolveConflicts, selectedItems: input.selectedItems })),
    route('/api/dsh-cloud-sync/snapshot/pull', input => pullSnapshot({ apply: input.apply === true, snapshotKey: input.snapshotKey })),
    route('/api/dsh-cloud-sync/source/backup', input => backupLocalPlugin(input.directory)),
    route('/api/dsh-cloud-sync/inventory', input => getSyncInventory(input)),
    route('/api/dsh-cloud-sync/plugin/adopt-configured', input => adoptConfiguredPlugin(input)),
    route('/api/dsh-cloud-sync/plugin/install-configured', input => installConfiguredPlugin(input)),
    route('/api/dsh-cloud-sync/plugin/uninstall', input => uninstallPlugin(input)),
  ]
  ctx.effect(() => {
    const disposers = routes.map(item => ctx.webServer.register(item))
    let active = false
    const interval = setInterval(async () => { if (active) return; active = true; try { await runAutomaticSync() } catch {} finally { active = false } }, 60 * 1000)
    return () => { clearInterval(interval); disposers.forEach(dispose => dispose()) }
  }, 'dsh-cloud-sync: routes')
}
