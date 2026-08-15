window.__ModuleLoader__.load({ id: '@dsh-local/dsh-cloud-sync', factory: (require) => {
  const React = require('react')
  const h = React.createElement
  const { useEffect, useState } = React

  const api = async (path, value = {}) => {
    const response = await fetch(`/api/dsh-cloud-sync/${path}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(value) })
    const body = await response.json()
    if (!body.ok) throw new Error(body.message || `HTTP ${response.status}`)
    return body.value
  }

  const css = `
    .dsh-cloud-sync .version{margin-left:8px;font-size:12px;font-weight:500;line-height:20px;opacity:.56;vertical-align:middle}
    .dsh-cloud-sync{max-width:760px;padding:6px 4px 32px;color:inherit;font:inherit}.dsh-cloud-sync h2{margin:0 0 4px;font-size:20px;line-height:28px;font-weight:600}.dsh-cloud-sync .intro{margin:0 0 20px;line-height:20px;opacity:.68}.dsh-cloud-sync .tabs{display:flex;gap:2px;margin:0 0 22px;padding:3px;border-radius:6px;background:color-mix(in srgb,currentColor 7%,transparent)}.dsh-cloud-sync .tab{flex:1;border:0;border-radius:4px;background:transparent;color:inherit;padding:8px 12px;font:inherit;line-height:20px;cursor:pointer}.dsh-cloud-sync .tab[aria-selected="true"]{background:color-mix(in srgb,Canvas 94%,currentColor 6%);box-shadow:0 1px 3px color-mix(in srgb,currentColor 16%,transparent)}.dsh-cloud-sync .group{border-top:1px solid color-mix(in srgb,currentColor 14%,transparent);padding:18px 0}.dsh-cloud-sync .group:first-child{border-top:0;padding-top:0}.dsh-cloud-sync h3{margin:0 0 5px;font-size:14px;line-height:20px;font-weight:600}.dsh-cloud-sync .hint{margin:0 0 14px;font-size:12px;line-height:18px;opacity:.64}.dsh-cloud-sync .grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:12px}.dsh-cloud-sync label{display:grid;gap:5px;font-size:12px;line-height:18px}.dsh-cloud-sync .wide{grid-column:1/-1}.dsh-cloud-sync input,.dsh-cloud-sync select{box-sizing:border-box;min-width:0;width:100%;padding:7px 9px;border:1px solid color-mix(in srgb,currentColor 25%,transparent);border-radius:4px;background:transparent;color:inherit;font:inherit;line-height:20px}.dsh-cloud-sync .actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}.dsh-cloud-sync button{border:1px solid color-mix(in srgb,currentColor 25%,transparent);border-radius:4px;background:transparent;color:inherit;padding:7px 11px;font:inherit;line-height:20px;cursor:pointer}.dsh-cloud-sync button.primary{border-color:#1677ff;background:#1677ff;color:#fff}.dsh-cloud-sync button.danger{border-color:color-mix(in srgb,#d03050 45%,transparent);color:#d03050}.dsh-cloud-sync button:disabled{cursor:default;opacity:.45}.dsh-cloud-sync .overview{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin:0 0 18px}.dsh-cloud-sync .metric{padding:13px 14px;border:1px solid color-mix(in srgb,currentColor 16%,transparent);border-radius:6px}.dsh-cloud-sync .metricLabel{display:block;font-size:12px;opacity:.62}.dsh-cloud-sync .metricValue{display:block;margin-top:5px;font-size:16px;font-weight:600;line-height:22px}.dsh-cloud-sync .metricDetail{display:block;margin-top:3px;font-size:12px;opacity:.64}.dsh-cloud-sync .pluginList{border-top:1px solid color-mix(in srgb,currentColor 14%,transparent)}.dsh-cloud-sync .plugin{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:10px;align-items:center;padding:13px 0;border-bottom:1px solid color-mix(in srgb,currentColor 14%,transparent)}.dsh-cloud-sync .pluginName{font:600 13px/20px ui-monospace,SFMono-Regular,Consolas,monospace;overflow-wrap:anywhere}.dsh-cloud-sync .pluginMeta{display:flex;flex-wrap:wrap;gap:6px;margin-top:5px;font-size:12px;line-height:18px;opacity:.68}.dsh-cloud-sync .pill{padding:0 6px;border-radius:3px;background:color-mix(in srgb,currentColor 8%,transparent)}.dsh-cloud-sync .pill.ok{color:#16794d}.dsh-cloud-sync .pill.warn{color:#b26a00}.dsh-cloud-sync .empty,.dsh-cloud-sync .notice{margin:0;padding:14px 0;font-size:13px;line-height:20px;opacity:.68}.dsh-cloud-sync pre{margin:14px 0 0;padding:10px 12px;max-height:180px;overflow:auto;border-radius:4px;background:color-mix(in srgb,currentColor 5%,transparent);font:12px/18px ui-monospace,SFMono-Regular,Consolas,monospace;white-space:pre-wrap;overflow-wrap:anywhere}.dsh-cloud-sync .service{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:14px;align-items:center;padding:17px 18px;border:1px solid color-mix(in srgb,currentColor 16%,transparent);border-radius:7px}.dsh-cloud-sync .serviceTitle{display:flex;align-items:center;gap:8px;font-size:15px;font-weight:600;line-height:22px}.dsh-cloud-sync .dot{width:8px;height:8px;border-radius:50%;background:#a4abb5}.dsh-cloud-sync .dot.ok{background:#00a854}.dsh-cloud-sync .serviceDetail{margin-top:4px;font-size:12px;line-height:18px;opacity:.66;overflow-wrap:anywhere}.dsh-cloud-sync .serviceActions{display:flex;gap:8px;align-items:center}.dsh-cloud-sync .modalBack{position:fixed;inset:0;z-index:2147483647;display:grid;place-items:center;padding:20px;background:color-mix(in srgb,#000 22%,transparent)}.dsh-cloud-sync .modal{box-sizing:border-box;width:min(460px,100%);max-height:calc(100vh - 40px);overflow:auto;padding:20px;border:1px solid color-mix(in srgb,currentColor 18%,transparent);border-radius:8px;background:Canvas;color:CanvasText;box-shadow:0 14px 40px color-mix(in srgb,#000 28%,transparent)}.dsh-cloud-sync .modalHead{display:flex;align-items:start;justify-content:space-between;gap:12px;margin-bottom:18px}.dsh-cloud-sync .modalHead h3{margin:0;font-size:17px;line-height:24px}.dsh-cloud-sync .modalClose{min-width:32px;padding:4px 8px;font-size:18px;line-height:20px}.dsh-cloud-sync .check{display:flex;align-items:center;gap:8px;margin-top:12px;font-size:12px;line-height:18px}.dsh-cloud-sync .check input{width:auto;padding:0}.dsh-cloud-sync .modalFooter{display:flex;justify-content:flex-end;gap:8px;margin-top:20px}.dsh-cloud-sync .conflicts{margin-top:14px;padding:12px;border:1px solid color-mix(in srgb,#b26a00 42%,transparent);border-radius:6px}.dsh-cloud-sync .conflictList{margin:8px 0 0;padding-left:18px;font-size:12px;line-height:19px}.dsh-cloud-sync .warning{color:#b26a00}@media(max-width:620px){.dsh-cloud-sync .grid,.dsh-cloud-sync .overview{grid-template-columns:1fr}.dsh-cloud-sync .wide{grid-column:auto}.dsh-cloud-sync .plugin{grid-template-columns:1fr}.dsh-cloud-sync .plugin button{justify-self:start}}
  `

  const layoutCss = `
    .dsh-cloud-sync .syncHeader{position:sticky;top:-6px;z-index:5;margin:-6px -4px 0;padding:12px 8px 10px;background:Canvas}.dsh-cloud-sync .syncHeader .intro{margin-bottom:12px}.dsh-cloud-sync .syncHeader .tabs{margin-bottom:0}.dsh-cloud-sync .nextStep{padding:16px 18px;border:1px solid color-mix(in srgb,#1677ff 32%,transparent);border-radius:7px;background:color-mix(in srgb,#1677ff 5%,Canvas)}.dsh-cloud-sync .nextStep h3{margin-bottom:3px}.dsh-cloud-sync details{border-top:1px solid color-mix(in srgb,currentColor 14%,transparent);padding:0}.dsh-cloud-sync details summary{padding:16px 0;cursor:pointer;font-size:14px;font-weight:600;line-height:20px}.dsh-cloud-sync details>div{padding:0 0 18px}.dsh-cloud-sync .diffModal{width:min(980px,100%);padding:0;overflow:hidden}.dsh-cloud-sync .diffHead{position:sticky;top:0;z-index:2;padding:18px 20px 14px;border-bottom:1px solid color-mix(in srgb,currentColor 14%,transparent);background:Canvas}.dsh-cloud-sync .diffHead h3{margin:0 0 4px;font-size:17px}.dsh-cloud-sync .diffBody{max-height:calc(100vh - 260px);overflow:auto}.dsh-cloud-sync .diffGrid{display:grid;grid-template-columns:32px 80px minmax(180px,1.2fr) minmax(130px,1fr) minmax(130px,1fr);align-items:start}.dsh-cloud-sync .diffGrid>span{padding:10px 12px;border-bottom:1px solid color-mix(in srgb,currentColor 11%,transparent);font-size:12px;line-height:18px;overflow-wrap:anywhere}.dsh-cloud-sync .diffGrid.head{position:sticky;top:0;z-index:1;background:color-mix(in srgb,Canvas 94%,currentColor 6%)}.dsh-cloud-sync .diffGrid.head>span{font-weight:600}.dsh-cloud-sync .diffCheck{display:grid;place-items:center}.dsh-cloud-sync .diffCheck input{width:auto}.dsh-cloud-sync .diffKind{color:#1677ff}.dsh-cloud-sync .diffFooter{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 20px;border-top:1px solid color-mix(in srgb,currentColor 14%,transparent);background:Canvas}.dsh-cloud-sync .muted{font-size:12px;line-height:18px;opacity:.64}@media(max-width:620px){.dsh-cloud-sync .diffModal{max-height:calc(100vh - 24px)}.dsh-cloud-sync .diffGrid{grid-template-columns:28px 58px minmax(130px,1fr) 0 0}.dsh-cloud-sync .diffGrid>span:nth-child(4),.dsh-cloud-sync .diffGrid>span:nth-child(5){display:none}.dsh-cloud-sync .diffFooter{align-items:flex-start;flex-direction:column}}
  `

  function Field({ label, wide = false, children }) { return h('label', { className: wide ? 'wide' : undefined }, label, children) }
  function Result({ value }) { return value === '' ? null : h('pre', null, value) }

  function DiffDialog({ changes, selectedItems, setSelectedItems, strategy, onClose, onSync, busy }) {
    const selected = new Set(selectedItems)
    const selectAll = value => setSelectedItems(value ? changes.map(item => item.id) : [])
    const toggle = item => setSelectedItems(current => selected.has(item.id) ? current.filter(id => id !== item.id) : [...current, item.id])
    const impact = item => {
      if (strategy === 'cloud') return item.remote === undefined ? '将从本地移除' : item.local === undefined ? '将写入本地' : '将用云端版本替换本地'
      if (item.local === undefined) return '将从云端加入本地'
      if (item.remote === undefined) return selected.has(item.id) ? '将上传到云端' : '保持云端状态'
      return selected.has(item.id) ? '将采用本地版本合并' : '将保持云端版本'
    }
    const title = strategy === 'cloud' ? '云端同步对本机的影响' : '智能合并：选择本地变化'
    const hint = strategy === 'cloud' ? '确认后，云端配置会写入本机。该操作不会立即安装或卸载依赖，重启 DSH 后才会按新配置处理。' : '只勾选需要从本机带入合并的项目；未勾选项目将保持云端版本。'
    return h('div', { className: 'modalBack', onMouseDown: onClose }, h('section', { className: 'modal diffModal', role: 'dialog', 'aria-modal': 'true', 'aria-label': '同步差异', onMouseDown: event => event.stopPropagation() },
      h('div', { className: 'diffHead' }, h('div', { className: 'modalHead' }, h('div', null, h('h3', null, title), h('p', { className: 'hint' }, hint)), h('button', { className: 'modalClose', onClick: onClose, 'aria-label': '关闭' }, '×')), strategy === 'smart' ? h('div', { className: 'actions' }, h('button', { disabled: busy !== '', onClick: () => selectAll(true) }, '全选本地变化'), h('button', { disabled: busy !== '', onClick: () => selectAll(false) }, '全部保留云端')) : null),
      h('div', { className: 'diffBody' }, h('div', { className: 'diffGrid head' }, h('span', null), h('span', null, '类别'), h('span', null, '项目'), h('span', null, '当前状态'), h('span', null, '同步后')), changes.map(item => h('div', { className: 'diffGrid', key: item.id }, h('span', { className: 'diffCheck' }, strategy === 'smart' ? h('input', { type: 'checkbox', checked: selected.has(item.id), onChange: () => toggle(item) }) : null), h('span', { className: 'diffKind' }, item.kind === 'plugin' ? '插件' : '配置'), h('span', null, `${item.profile} / ${item.name}`), h('span', null, `本地 ${item.local || '未安装'} · 云端 ${item.remote || '未安装'}`), h('span', null, impact(item))))),
      h('div', { className: 'diffFooter' }, h('span', { className: 'muted' }, strategy === 'smart' ? `已选择 ${selectedItems.length} / ${changes.length} 项本地变化` : `共 ${changes.length} 项会影响本机`), h('div', { className: 'serviceActions' }, h('button', { disabled: busy !== '', onClick: onClose }, '取消'), h('button', { className: 'primary', disabled: busy !== '' || (strategy === 'smart' && changes.length > 0 && selectedItems.length === 0), onClick: onSync }, strategy === 'cloud' ? '按云端同步' : '开始智能合并')))
    ))
  }

  function ReleaseUpdateNotice({ run, busy, setResult }) {
    const [update, setUpdate] = useState()
    useEffect(() => { api('release/check').then(setUpdate).catch(() => setUpdate({ available: false })) }, [])
    if (update === undefined || !update.available || update.release === undefined) return null
    const install = run('self-update', async () => {
      const value = await api('release/update')
      setUpdate(value)
      return value.updated ? `云同步已更新到 v${value.release.version}，请完全退出并重新启动 DSH。` : '云同步已是最新版本。'
    })
    return h('div', { className: 'service updateNotice' }, h('div', null,
      h('div', { className: 'serviceTitle' }, '云同步有新版本'),
      h('div', { className: 'serviceDetail' }, update.sameVersionRevision ? `当前 v${update.localVersion}，可安装同版本修复` : `当前 v${update.localVersion}，可更新至 v${update.release.version}`)
    ), h('div', { className: 'serviceActions' }, h('button', { className: 'primary', disabled: busy !== '', onClick: install }, busy === 'self-update' ? '正在更新' : '更新')))
  }

  function WebDavDialog({ settings, busy, onClose, onConnected, run }) {
    const [url, setUrl] = useState(settings.provider?.url || 'https://dav.jianguoyun.com/dav/DSH-Sync')
    const [username, setUsername] = useState(settings.provider?.username || '')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const connect = run('connect', async () => {
      const value = await api('webdav/connect', { provider: { type: 'webdav', url, username, password } })
      onConnected(value); onClose(); return 'WebDAV 已连接并保存。'
    })
    return h('div', { className: 'modalBack', onMouseDown: onClose }, h('section', { className: 'modal', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'WebDAV 设置', onMouseDown: event => event.stopPropagation() },
      h('div', { className: 'modalHead' }, h('div', null, h('h3', null, 'WebDAV 设置'), h('p', { className: 'hint' }, '配置 WebDAV 端点用于同步。')), h('button', { className: 'modalClose', onClick: onClose, 'aria-label': '关闭' }, '×')),
      h('div', { className: 'grid' }, h(Field, { label: '端点地址', wide: true }, h('input', { value: url, onChange: event => setUrl(event.target.value), placeholder: 'https://dav.jianguoyun.com/dav/DSH-Sync' })), h(Field, { label: '认证方式', wide: true }, h('input', { value: 'Basic', readOnly: true })), h(Field, { label: '用户名', wide: true }, h('input', { value: username, onChange: event => setUsername(event.target.value), placeholder: '坚果云账号邮箱' })), h(Field, { label: '密码', wide: true }, h('input', { type: showPassword ? 'text' : 'password', value: password, onChange: event => setPassword(event.target.value), placeholder: settings.provider?.password === '<stored-locally>' ? '已保存，留空不变' : '坚果云应用密码' }))),
      h('label', { className: 'check' }, h('input', { type: 'checkbox', checked: showPassword, onChange: event => setShowPassword(event.target.checked) }), '显示密码'),
      h('div', { className: 'modalFooter' }, h('button', { disabled: busy !== '', onClick: onClose }, '取消'), h('button', { className: 'primary', disabled: busy !== '', onClick: connect }, busy === 'connect' ? '正在连接' : '连接并保存'))
    ))
  }

  function ConfigurationTab({ run, busy, setResult }) {
    const [settings, setSettings] = useState()
    const [editingWebDav, setEditingWebDav] = useState(false)
    const [source, setSource] = useState('')
    const [strategy, setStrategy] = useState('smart')
    const [conflicts, setConflicts] = useState([])
    const [changes, setChanges] = useState([])
    const [selectedItems, setSelectedItems] = useState([])
    const [history, setHistory] = useState([])
    const [diffOpen, setDiffOpen] = useState(false)
    const [deviceName, setDeviceName] = useState('')
    const [intervalMinutes, setIntervalMinutes] = useState(30)
    const [passphrase, setPassphrase] = useState('')
    useEffect(() => { api('settings/get').then(value => { setSettings(value); setStrategy(value.syncPolicy || 'smart') }).catch(error => setResult(`错误: ${error.message}`)) }, [])
    const webdavConfigured = settings?.provider?.type === 'webdav' && Boolean(settings.provider?.url)
    const refreshChanges = async () => { const value = await api('snapshot/diff'); setChanges(value.items); setSelectedItems(value.items.map(item => item.id)); return value }
    const refreshHistory = async () => { const value = await api('snapshot/history'); setHistory(value); return value }
    useEffect(() => { if (webdavConfigured) { setDeviceName(settings.deviceName || ''); setIntervalMinutes(settings.autoSync?.intervalMinutes || 30); refreshHistory().catch(() => {}) } }, [webdavConfigured])
    if (settings === undefined) return h('p', { className: 'notice' }, '正在读取同步配置...')
    const configured = webdavConfigured
    const cancelProvider = run('cancel-provider', async () => { const value = await api('settings/clear-provider'); setSettings(value); setConflicts([]); setChanges([]); return '已取消当前同步配置。' })
    const sync = (resolveConflicts, all = false) => run('sync', async () => {
      const value = await api('snapshot/push', { strategy, resolveConflicts, selectedItems: all ? undefined : selectedItems })
      if (value.direction === 'needs-choice') { setConflicts(value.conflicts); return `智能合并发现 ${value.conflicts.length} 个冲突。请选择本次冲突优先保留的版本。` }
      setConflicts([])
      const sourceWarning = value.missingLocalSources?.length ? `\n未能读取本地源码: ${value.missingLocalSources.join(', ')}` : ''
      const build = value.direction === 'downloaded' ? '已从云端恢复配置' : value.direction === 'merged' ? '已智能合并并同步' : '已同步到云端'
      await refreshChanges(); await refreshHistory(); return `${build}: ${new Date(value.createdAt).toLocaleString()}${sourceWarning}`
    })
    const strategyHint = strategy === 'local' ? '本地配置会直接上传到云端。' : strategy === 'cloud' ? '同步前会先展示云端配置写入本机后的影响。' : '同步前会先选择哪些本地变化参与合并。'
    const beginSync = strategy === 'local' ? sync(undefined, true) : run('prepare-sync', async () => { const value = await refreshChanges(); setDiffOpen(true); return value.items.length === 0 ? '本地与云端没有差异。' : '' })
    const service = ({ title, active, detail, edit }) => h('section', { className: 'group' }, h('div', { className: 'service' }, h('div', null, h('div', { className: 'serviceTitle' }, title, h('span', { className: `dot ${active ? 'ok' : ''}` })), h('div', { className: 'serviceDetail' }, detail)), h('div', { className: 'serviceActions' }, active ? h(React.Fragment, null, h('button', { className: 'primary', disabled: busy !== '', onClick: beginSync }, busy === 'sync' || busy === 'prepare-sync' ? '正在准备' : '同步'), h('button', { disabled: busy !== '', onClick: edit }, '编辑'), h('button', { className: 'danger', disabled: busy !== '', onClick: cancelProvider }, '取消')) : h('button', { className: 'primary', disabled: busy !== '', onClick: edit }, '连接'))))
    const webdavDetail = webdavConfigured ? `${settings.provider.username || '未填写用户名'} · ${settings.provider.url}${settings.lastConnectedAt ? ` · ${new Date(settings.lastConnectedAt).toLocaleString()}` : ''}` : '尚未连接 WebDAV。'
    const savePreferences = async (nextAutoSync = settings.autoSync, nextScope = settings.syncScope) => {
      const value = await api('settings/preferences', { deviceName, autoSync: { enabled: nextAutoSync?.enabled === true, intervalMinutes: Number(nextAutoSync?.intervalMinutes ?? intervalMinutes) }, syncScope: nextScope })
      setSettings(value)
      return value
    }
    return h(React.Fragment, null,
      service({ title: 'WebDAV', active: webdavConfigured, detail: webdavDetail, edit: () => setEditingWebDav(true) }),
      configured ? h('section', { className: 'group' }, h('div', { className: 'nextStep' },
        h('h3', null, '同步方式'),
        h(Field, { label: '本次同步', wide: true }, h('select', { value: strategy, onChange: event => { setStrategy(event.target.value); setConflicts([]); setChanges([]) } }, h('option', { value: 'smart' }, '智能合并（推荐）'), h('option', { value: 'cloud' }, '云端优先'), h('option', { value: 'local' }, '本地优先'))),
        h('p', { className: 'hint' }, strategyHint),
        h('div', { className: 'actions' }, h('button', { className: 'primary', disabled: busy !== '', onClick: beginSync }, busy === 'sync' || busy === 'prepare-sync' ? '正在准备' : '同步')),
        conflicts.length ? h('div', { className: 'conflicts' }, h('strong', null, `有 ${conflicts.length} 项无法自动合并`), h('p', { className: 'hint' }, '请选择本次冲突保留哪一侧的版本。'), h('div', { className: 'actions' }, h('button', { disabled: busy !== '', onClick: sync('cloud') }, '保留云端'), h('button', { disabled: busy !== '', onClick: sync('local') }, '保留本地'))) : null
      )) : null,
      configured ? h('details', null, h('summary', null, '自动同步与加密（可选）'), h('div', null,
        h('p', { className: 'hint' }, `当前设备会自动标识为“${settings.deviceName || '此设备'}”，仅用于历史记录。自动同步适合单人多设备日常使用：它只会同步无冲突变化，冲突仍等待你确认。加密只在同步内容敏感时启用。`),
        h(Field, { label: '自动同步检查间隔（分钟）', wide: true }, h('input', { type: 'number', min: 5, max: 1440, value: intervalMinutes, onChange: event => setIntervalMinutes(event.target.value) })),
        h('label', { className: 'check' }, h('input', { type: 'checkbox', checked: settings.autoSync?.enabled === true, onChange: event => run('preferences', async () => { await savePreferences({ enabled: event.target.checked, intervalMinutes }); return event.target.checked ? '已开启自动同步。' : '已关闭自动同步。' })() }), '自动同步'),
        h('label', { className: 'check' }, h('input', { type: 'checkbox', checked: settings.syncScope?.sources !== false, onChange: event => run('sources-scope', async () => { await savePreferences(settings.autoSync, { sources: event.target.checked }); return event.target.checked ? '将同步本地插件源码。' : '只同步配置，不上传本地插件源码。' })() }), '同步本地插件源码'),
        h('div', { className: 'actions' }, h('button', { disabled: busy !== '', onClick: run('save-preferences', async () => { await savePreferences(); return '自动化设置已保存。' }) }, '保存自动化设置')),
        h('p', { className: 'hint' }, settings.encryption?.enabled ? (settings.encryption.unlocked ? '客户端加密已启用，本会话可同步。' : '客户端加密已启用，请输入口令解锁后再同步。') : '客户端加密会加密 WebDAV 中的快照、历史和源码；口令不会写入本机。'),
        h(Field, { label: '同步口令', wide: true }, h('input', { type: 'password', value: passphrase, onChange: event => setPassphrase(event.target.value), placeholder: settings.encryption?.enabled ? '输入口令以解锁' : '至少 8 个字符，用于启用加密' })),
        h('div', { className: 'actions' }, settings.encryption?.enabled && settings.encryption.unlocked ? h('button', { disabled: busy !== '', onClick: run('lock-encryption', async () => { const value = await api('security/lock'); setSettings(value); setPassphrase(''); return '客户端加密已锁定。' }) }, '锁定加密') : h('button', { className: 'primary', disabled: busy !== '' || passphrase.length < 8, onClick: run('unlock-encryption', async () => { const value = await api('security/unlock', { passphrase, enable: settings.encryption?.enabled !== true }); setSettings(value); setPassphrase(''); return settings.encryption?.enabled ? '客户端加密已解锁。' : '客户端加密已启用。' }) }, settings.encryption?.enabled ? '解锁加密' : '启用客户端加密'))
      )) : null,
      configured ? h('details', null, h('summary', null, `历史与恢复${history.length ? `（${history.length}）` : ''}`), h('div', null,
        h('p', { className: 'hint' }, '每次成功同步都会保存一份历史。回滚会先备份当前配置，随后需要重启 DSH。'),
        h('div', { className: 'actions' }, h('button', { disabled: busy !== '', onClick: run('history', async () => { const value = await refreshHistory(); return `已读取 ${value.length} 个历史快照。` }) }, '刷新历史')),
        history.length ? h('div', { className: 'pluginList' }, history.slice(0, 8).map(entry => h('div', { className: 'plugin', key: entry.key }, h('div', null, h('div', { className: 'pluginName' }, new Date(entry.createdAt).toLocaleString()), h('div', { className: 'pluginMeta' }, entry.deviceName || entry.deviceId || '未知设备')), h('button', { className: 'danger', disabled: busy !== '', onClick: run(`rollback:${entry.key}`, async () => { const value = await api('snapshot/pull', { apply: true, snapshotKey: entry.key }); return `已回滚到历史快照，请重启 DSH。\n本机备份: ${value.backup}` }) }, '回滚')))) : h('p', { className: 'muted' }, '尚无历史快照。')
      )) : null,
      configured ? h('details', null, h('summary', null, '本地插件源码（高级）'), h('div', null,
        h('p', { className: 'hint' }, '大多数本地插件会在同步时自动归档。仅当 tgz 插件的源码无法自动发现时，才在这里手动备份。'),
        h(Field, { label: '源码目录', wide: true }, h('input', { value: source, onChange: event => setSource(event.target.value), placeholder: 'E:\\dsh-plugin' })),
        h('div', { className: 'actions' }, h('button', { disabled: busy !== '', onClick: run('backup', async () => { const value = await api('source/backup', { directory: source }); return `已归档 ${value.name} ${value.version}，下次同步会上传。` }) }, '备份源码'), h('button', { disabled: busy !== '', onClick: run('preview', async () => { const value = await api('snapshot/pull'); return `远端快照: ${value.createdAt}\nProfile: ${value.plan.map(item => item.name).join(', ') || '无'}` }) }, '预览恢复'), h('button', { className: 'danger', disabled: busy !== '', onClick: run('restore', async () => { const value = await api('snapshot/pull', { apply: true }); return `恢复已应用；请完全退出 DSH 后重新启动。\n本机备份: ${value.backup}` }) }, '应用恢复'))
      )) : null,
      editingWebDav ? h(WebDavDialog, { settings, busy, onClose: () => setEditingWebDav(false), onConnected: setSettings, run }) : null,
      diffOpen ? h(DiffDialog, { changes, selectedItems, setSelectedItems, strategy, busy, onClose: () => setDiffOpen(false), onSync: () => { setDiffOpen(false); (strategy === 'cloud' ? sync(undefined, true) : sync())() } }) : null
    )
    return h(React.Fragment, null,
      service({ title: 'WebDAV', active: webdavConfigured, detail: webdavDetail, edit: () => setEditingWebDav(true) }),
      configured ? h('section', { className: 'group' },
        h('h3', null, '同步策略与差异'),
        h('div', { className: 'grid' }, h(Field, { label: '本次同步', wide: true }, h('select', { value: strategy, onChange: event => { setStrategy(event.target.value); setConflicts([]) } }, h('option', { value: 'smart' }, '智能合并（推荐）'), h('option', { value: 'cloud' }, '云端优先（覆盖本地）'), h('option', { value: 'local' }, '本地优先（覆盖云端）')))),
        h('p', { className: strategy === 'smart' ? 'hint' : 'hint warning' }, strategy === 'smart' ? '可勾选需要参与同步的插件；一键同步全部会同步所有项目。' : strategy === 'cloud' ? '本次将用云端快照恢复本机 profile。' : '本次将用本机 profile 覆盖云端快照。'),
        h('div', { className: 'actions' }, h('button', { disabled: busy !== '', onClick: run('diff', async () => { const value = await refreshChanges(); return `发现 ${value.items.length} 项插件差异。` }) }, '检查差异'), h('button', { className: 'primary', disabled: busy !== '' || selectedItems.length === 0, onClick: sync() }, '同步选中项')),
        changes.length ? h('div', { className: 'conflicts' }, h('strong', null, `可选同步项 (${changes.length})`), h('ul', { className: 'conflictList' }, changes.map(item => h('li', { key: item.id }, h('label', { className: 'check' }, h('input', { type: 'checkbox', checked: selectedItems.includes(item.id), onChange: event => setSelectedItems(current => event.target.checked ? [...new Set([...current, item.id])] : current.filter(id => id !== item.id)) }), `${item.kind === 'plugin' ? '插件' : '配置'} · ${item.profile} / ${item.name}: 本地 ${item.local || '未安装'}，云端 ${item.remote || '未安装'}`))))) : null,
        conflicts.length ? h('div', { className: 'conflicts' }, h('strong', null, `发现 ${conflicts.length} 个冲突`), h('div', { className: 'actions' }, h('button', { disabled: busy !== '', onClick: sync('cloud') }, '冲突保留云端'), h('button', { disabled: busy !== '', onClick: sync('local') }, '冲突保留本地'))) : null
      ) : null,
      configured ? h('section', { className: 'group' },
        h('h3', null, '设备、自动同步与加密'),
        h('div', { className: 'grid' }, h(Field, { label: '设备名称' }, h('input', { value: deviceName, onChange: event => setDeviceName(event.target.value), placeholder: '例如：办公室电脑' })), h(Field, { label: '自动同步间隔（分钟）' }, h('input', { type: 'number', min: 5, max: 1440, value: intervalMinutes, onChange: event => setIntervalMinutes(event.target.value) }))),
        h('label', { className: 'check' }, h('input', { type: 'checkbox', checked: settings.autoSync?.enabled === true, onChange: event => run('preferences', async () => { const value = await api('settings/preferences', { deviceName, autoSync: { enabled: event.target.checked, intervalMinutes: Number(intervalMinutes) }, syncScope: settings.syncScope }); setSettings(value); return event.target.checked ? '已启用自动同步。' : '已关闭自动同步。' })() }), '启用自动同步'),
        h('label', { className: 'check' }, h('input', { type: 'checkbox', checked: settings.syncScope?.sources !== false, onChange: event => run('preferences', async () => { const value = await api('settings/preferences', { deviceName, autoSync: { enabled: settings.autoSync?.enabled === true, intervalMinutes: Number(intervalMinutes) }, syncScope: { sources: event.target.checked } }); setSettings(value); return event.target.checked ? '同步将包含本地插件源码。' : '同步将只包含配置。' })() }), '同步本地插件源码'),
        h('div', { className: 'actions' }, h('button', { disabled: busy !== '', onClick: run('save-device', async () => { const value = await api('settings/preferences', { deviceName, autoSync: { enabled: settings.autoSync?.enabled === true, intervalMinutes: Number(intervalMinutes) }, syncScope: settings.syncScope }); setSettings(value); return '设备标识与自动同步设置已保存。' }) }, '保存设置')),
        h('p', { className: 'hint' }, settings.encryption?.enabled ? (settings.encryption.unlocked ? '客户端加密已启用且本会话已解锁。' : '客户端加密已启用，请输入同步口令后解锁。') : '客户端加密会加密 WebDAV 中的快照、历史和插件源码；口令不会写入磁盘。'),
        h('div', { className: 'grid' }, h(Field, { label: '同步口令', wide: true }, h('input', { type: 'password', value: passphrase, onChange: event => setPassphrase(event.target.value), placeholder: settings.encryption?.enabled ? '输入口令以解锁' : '至少 8 个字符，用于启用客户端加密' }))),
        h('div', { className: 'actions' }, settings.encryption?.enabled && settings.encryption.unlocked ? h('button', { disabled: busy !== '', onClick: run('lock-encryption', async () => { const value = await api('security/lock'); setSettings(value); setPassphrase(''); return '客户端加密已锁定。' }) }, '锁定加密') : h('button', { className: 'primary', disabled: busy !== '' || passphrase.length < 8, onClick: run('unlock-encryption', async () => { const value = await api('security/unlock', { passphrase, enable: settings.encryption?.enabled !== true }); setSettings(value); setPassphrase(''); return settings.encryption?.enabled ? '客户端加密已解锁。' : '客户端加密已启用。后续同步会加密云端数据。' }) }, settings.encryption?.enabled ? '解锁加密' : '启用客户端加密')),
        h('div', { className: 'actions' }, h('button', { disabled: busy !== '', onClick: run('history', async () => { const value = await refreshHistory(); return `已读取 ${value.length} 个历史快照。` }) }, '刷新历史')),
        history.length ? h('ul', { className: 'conflictList' }, history.slice(0, 8).map(entry => h('li', { key: entry.key }, `${new Date(entry.createdAt).toLocaleString()} · ${entry.deviceName || entry.deviceId || '未知设备'} `, h('button', { disabled: busy !== '', onClick: run(`rollback:${entry.key}`, async () => { const value = await api('snapshot/pull', { apply: true, snapshotKey: entry.key }); return `已回滚到历史快照，请重启 DSH。\n本机备份: ${value.backup}` }) }, '回滚')))) : null
      ) : null,
      configured ? h('section', { className: 'group' }, h('h3', null, '本地插件源码'), h('p', { className: 'hint' }, '同步会自动归档可访问的 file/link 插件。若插件从 tgz 安装，可在此手动归档其源码目录。'), h('div', { className: 'grid' }, h(Field, { label: '源码目录', wide: true }, h('input', { value: source, onChange: event => setSource(event.target.value), placeholder: 'E:\\dsh-plugin' }))), h('div', { className: 'actions' }, h('button', { disabled: busy !== '', onClick: run('backup', async () => { const value = await api('source/backup', { directory: source }); return `已归档 ${value.name} ${value.version}，请点击同步上传。` }) }, '备份源码'), h('button', { disabled: busy !== '', onClick: run('preview', async () => { const value = await api('snapshot/pull'); return `远端快照: ${value.createdAt}\nProfile: ${value.plan.map(item => item.name).join(', ') || '无'}` }) }, '预览恢复'), h('button', { className: 'danger', disabled: busy !== '', onClick: run('restore', async () => { const value = await api('snapshot/pull', { apply: true }); return `恢复已应用；请完全退出 DSH 后重新启动。\n本机备份: ${value.backup}` }) }, '应用恢复'))) : null,
      editingWebDav ? h(WebDavDialog, { settings, busy, onClose: () => setEditingWebDav(false), onConnected: setSettings, run }) : null,
    )
  }

  function StatusTab({ run, busy, setResult }) {
    const [inventory, setInventory] = useState()
    const refresh = async () => { const value = await api('inventory'); setInventory(value); return value }
    useEffect(() => { refresh().catch(error => setResult(`错误: ${error.message}`)) }, [])
    const install = plugin => run(`install:${plugin.name}`, async () => { const value = await api('plugin/install-configured', { packageName: plugin.name }); await refresh(); return value.buildApprovalRequired ? `${plugin.name} 已安装并启用，但部分依赖的构建脚本等待 pnpm 审批。重启 DSH 后可使用不依赖这些构建脚本的功能。` : `${plugin.name} 已安装并启用，请重启 DSH。` })
    const uninstall = plugin => run(`uninstall:${plugin.name}`, async () => { await api('plugin/uninstall', { packageName: plugin.name }); await refresh(); return `${plugin.name} 已卸载，请重启 DSH。` })
    if (inventory === undefined) return h('p', { className: 'notice' }, '正在读取远端快照与本机安装状态...')
    const remote = inventory.remote
    return h(React.Fragment, null,
      h('section', { className: 'group' }, h('h3', null, '同步状态'), h('div', { className: 'overview' }, h('div', { className: 'metric' }, h('span', { className: 'metricLabel' }, '远端快照'), h('span', { className: 'metricValue' }, remote.available ? '可用' : '未连接'), h('span', { className: 'metricDetail' }, remote.available ? new Date(remote.createdAt).toLocaleString() : remote.error || '请先配置 WebDAV 并同步')), h('div', { className: 'metric' }, h('span', { className: 'metricLabel' }, '本机 Web Profile'), h('span', { className: 'metricValue' }, `${inventory.local.dependencies} 个插件`), h('span', { className: 'metricDetail' }, `${inventory.local.bundles} 个已启用 Bundle`))), h('div', { className: 'actions' }, h('button', { disabled: busy !== '', onClick: run('refresh', refresh) }, '刷新状态'))),
      h('section', { className: 'group' }, h('h3', null, '插件安装状态'), h('div', { className: 'pluginList' }, inventory.plugins.length === 0 ? h('p', { className: 'empty' }, '没有发现插件。') : inventory.plugins.map(plugin => h('div', { className: 'plugin', key: plugin.name }, h('div', null, h('div', { className: 'pluginName' }, plugin.name), h('div', { className: 'pluginMeta' }, h('span', { className: `pill ${plugin.installed ? 'ok' : 'warn'}` }, plugin.installed ? '已安装' : '未安装'), plugin.enabled ? h('span', { className: 'pill ok' }, '已启用') : null, plugin.localSource ? h('span', { className: `pill ${plugin.sourceArchived ? '' : 'warn'}` }, plugin.sourceArchived ? '本地源码' : '源码未归档') : null, h('span', null, plugin.requested))), plugin.name === '@dsh-local/dsh-cloud-sync' ? h('button', { disabled: true }, '当前工具') : plugin.installed ? h('button', { className: 'danger', disabled: busy !== '', onClick: uninstall(plugin) }, '卸载') : h('button', { className: 'primary', disabled: busy !== '' || !plugin.configuredInRemote || (plugin.localSource && !plugin.sourceArchived), onClick: install(plugin) }, plugin.localSource && !plugin.sourceArchived ? '源码缺失' : '安装'))))
      )
    )
  }

  function CloudSyncSection() {
    const [tab, setTab] = useState('config')
    const [busy, setBusy] = useState('')
    const [result, setResult] = useState('')
    const [version, setVersion] = useState('')
    useEffect(() => { api('release/check').then(value => setVersion(value.localVersion || '')).catch(() => {}) }, [])
    const run = (label, operation) => async () => { setBusy(label); try { const value = await operation(); if (typeof value === 'string') setResult(value) } catch (error) { setResult(`错误: ${error.message}`) } finally { setBusy('') } }
    return h('div', { className: 'dsh-cloud-sync' }, h('style', null, `${css}\n${layoutCss}`), h('div', { className: 'syncHeader' }, h('h2', null, '云同步', version === '' ? null : h('span', { className: 'version' }, `v${version}`)), h('p', { className: 'intro' }, '将 DSH 插件配置与本地源码归档同步到 WebDAV。'), h(ReleaseUpdateNotice, { run, busy, setResult }), h('div', { className: 'tabs', role: 'tablist', 'aria-label': '云同步页面' }, h('button', { className: 'tab', role: 'tab', 'aria-selected': tab === 'config', onClick: () => setTab('config') }, '云同步配置'), h('button', { className: 'tab', role: 'tab', 'aria-selected': tab === 'status', onClick: () => setTab('status') }, '同步状态'))), h('div', { role: 'tabpanel' }, tab === 'config' ? h(ConfigurationTab, { run, busy, setResult }) : h(StatusTab, { run, busy, setResult })), h(Result, { value: result }))
  }

  const inject = ['slots']
  function apply(ctx) { ctx.slots.inject('settings.section', () => ctx.slots.register({ name: 'settings.section', id: 'cloud-sync', order: 25, label: () => '云同步' }, CloudSyncSection)) }
  return { inject, apply }
} })
