window.__ModuleLoader__.load({ id: '@dickpy/dsh-cloud-sync', factory: (require) => {
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
    .dsh-cloud-sync{max-width:860px;padding:6px 4px 32px;color:inherit;font:inherit}.dsh-cloud-sync h2{margin:0 0 4px;font-size:20px;line-height:28px;font-weight:600}.dsh-cloud-sync .intro{margin:0 0 20px;line-height:20px;opacity:.68}.dsh-cloud-sync .tabs{display:flex;gap:2px;margin:0 0 22px;padding:3px;border-radius:6px;background:color-mix(in srgb,currentColor 7%,transparent)}.dsh-cloud-sync .tab{flex:1;border:0;border-radius:4px;background:transparent;color:inherit;padding:8px 12px;font:inherit;line-height:20px;cursor:pointer}.dsh-cloud-sync .tab[aria-selected="true"]{background:color-mix(in srgb,Canvas 94%,currentColor 6%);box-shadow:0 1px 3px color-mix(in srgb,currentColor 16%,transparent)}.dsh-cloud-sync .group{border-top:1px solid color-mix(in srgb,currentColor 14%,transparent);padding:20px 0}.dsh-cloud-sync .group:first-child{border-top:0;padding-top:0}.dsh-cloud-sync h3{margin:0 0 5px;font-size:14px;line-height:20px;font-weight:600}.dsh-cloud-sync .hint{margin:0;font-size:12px;line-height:18px;opacity:.64}.dsh-cloud-sync .grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:12px}.dsh-cloud-sync label{display:grid;gap:5px;font-size:12px;line-height:18px}.dsh-cloud-sync .wide{grid-column:1/-1}.dsh-cloud-sync input,.dsh-cloud-sync select{box-sizing:border-box;min-width:0;width:100%;padding:7px 9px;border:1px solid color-mix(in srgb,currentColor 25%,transparent);border-radius:4px;background:transparent;color:inherit;font:inherit;line-height:20px}.dsh-cloud-sync .actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}.dsh-cloud-sync button{border:1px solid color-mix(in srgb,currentColor 25%,transparent);border-radius:4px;background:transparent;color:inherit;padding:7px 11px;font:inherit;line-height:20px;cursor:pointer}.dsh-cloud-sync button.primary{border-color:#1677ff;background:#1677ff;color:#fff}.dsh-cloud-sync button.danger{border-color:color-mix(in srgb,#d03050 45%,transparent);color:#d03050}.dsh-cloud-sync button:disabled{cursor:default;opacity:.45}.dsh-cloud-sync .overview{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:14px}.dsh-cloud-sync .metric{padding:13px 14px;border:1px solid color-mix(in srgb,currentColor 16%,transparent);border-radius:6px}.dsh-cloud-sync .metricLabel{display:block;font-size:12px;opacity:.62}.dsh-cloud-sync .metricValue{display:block;margin-top:5px;font-size:16px;font-weight:600;line-height:22px}.dsh-cloud-sync .metricDetail{display:block;margin-top:3px;font-size:12px;opacity:.64}.dsh-cloud-sync .pluginList{margin-top:12px;border-top:1px solid color-mix(in srgb,currentColor 14%,transparent)}.dsh-cloud-sync .plugin{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:10px;align-items:center;padding:13px 0;border-bottom:1px solid color-mix(in srgb,currentColor 14%,transparent)}.dsh-cloud-sync .pluginName{font:600 13px/20px ui-monospace,SFMono-Regular,Consolas,monospace;overflow-wrap:anywhere}.dsh-cloud-sync .pluginMeta{display:flex;flex-wrap:wrap;gap:6px;margin-top:5px;font-size:12px;line-height:18px;opacity:.68}.dsh-cloud-sync .pill{padding:0 6px;border-radius:3px;background:color-mix(in srgb,currentColor 8%,transparent)}.dsh-cloud-sync .pill.ok{color:#16794d}.dsh-cloud-sync .pill.warn{color:#b26a00}.dsh-cloud-sync .empty,.dsh-cloud-sync .notice{margin:0;padding:14px 0;font-size:13px;line-height:20px;opacity:.68}.dsh-cloud-sync pre{margin:14px 0 0;padding:10px 12px;max-height:180px;overflow:auto;border-radius:4px;background:color-mix(in srgb,currentColor 5%,transparent);font:12px/18px ui-monospace,SFMono-Regular,Consolas,monospace;white-space:pre-wrap;overflow-wrap:anywhere}.dsh-cloud-sync .service{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:14px;align-items:center;padding:17px 18px;border:1px solid color-mix(in srgb,currentColor 16%,transparent);border-radius:7px}.dsh-cloud-sync .serviceTitle{display:flex;align-items:center;gap:8px;font-size:15px;font-weight:600;line-height:22px}.dsh-cloud-sync .dot{display:inline-block;width:7px;height:7px;border-radius:50%;background:#a4abb5}.dsh-cloud-sync .dot.ok{background:#00a854}.dsh-cloud-sync .serviceDetail{margin-top:4px;font-size:12px;line-height:18px;opacity:.66;overflow-wrap:anywhere}.dsh-cloud-sync .serviceActions{display:flex;gap:8px;align-items:center}.dsh-cloud-sync .modalBack{position:fixed;inset:0;z-index:2147483647;display:grid;place-items:center;padding:20px;background:color-mix(in srgb,#000 22%,transparent)}.dsh-cloud-sync .modal{box-sizing:border-box;width:min(460px,100%);max-height:calc(100vh - 40px);overflow:auto;padding:20px;border:1px solid color-mix(in srgb,currentColor 18%,transparent);border-radius:8px;background:Canvas;color:CanvasText;box-shadow:0 14px 40px color-mix(in srgb,#000 28%,transparent)}.dsh-cloud-sync .modalHead{display:flex;align-items:start;justify-content:space-between;gap:12px;margin-bottom:18px}.dsh-cloud-sync .modalHead h3{margin:0;font-size:17px;line-height:24px}.dsh-cloud-sync .modalClose{min-width:32px;padding:4px 8px;font-size:18px;line-height:20px}.dsh-cloud-sync .check{display:flex;align-items:center;gap:8px;margin-top:12px;font-size:12px;line-height:18px}.dsh-cloud-sync .check input{width:auto;padding:0}.dsh-cloud-sync .modalFooter{display:flex;justify-content:flex-end;gap:8px;margin-top:20px}.dsh-cloud-sync .conflicts{margin-top:14px;padding:12px;border:1px solid color-mix(in srgb,#b26a00 42%,transparent);border-radius:6px}.dsh-cloud-sync .conflictList{margin:8px 0 0;padding-left:18px;font-size:12px;line-height:19px}.dsh-cloud-sync .warning{color:#b26a00}
  `

  const layoutCss = `
    .dsh-cloud-sync .syncHeader{position:sticky;top:-6px;z-index:5;margin:-6px -4px 0;padding:12px 8px 10px;background:Canvas}.dsh-cloud-sync .syncHeader .intro{margin-bottom:12px}.dsh-cloud-sync .syncHeader .tabs{margin-bottom:0}.dsh-cloud-sync .configToolbar,.dsh-cloud-sync .sectionHead{display:flex;align-items:flex-end;justify-content:space-between;gap:18px}.dsh-cloud-sync .sectionHead{align-items:center}.dsh-cloud-sync .modeField{display:grid;gap:5px;justify-items:end}.dsh-cloud-sync .modeLabel{font-size:12px;line-height:18px;opacity:.62}.dsh-cloud-sync .segments{display:flex;gap:2px;padding:3px;border-radius:6px;background:color-mix(in srgb,currentColor 7%,transparent)}.dsh-cloud-sync .segments button{min-width:64px;border:0;padding:5px 10px;background:transparent;line-height:18px}.dsh-cloud-sync .segments button.active{background:Canvas;box-shadow:0 1px 3px color-mix(in srgb,currentColor 16%,transparent)}.dsh-cloud-sync .providerList{display:grid;gap:10px;margin-top:16px}.dsh-cloud-sync .providerCard{display:grid;grid-template-columns:48px minmax(0,1fr) auto;gap:14px;align-items:center;min-height:58px;padding:12px 14px;border:1px solid color-mix(in srgb,currentColor 16%,transparent);border-radius:7px;background:color-mix(in srgb,currentColor 1.5%,Canvas)}.dsh-cloud-sync .providerCard.active{border-color:color-mix(in srgb,#00a854 34%,transparent);background:color-mix(in srgb,#00a854 3%,Canvas)}.dsh-cloud-sync .providerMark{display:grid;place-items:center;width:44px;height:44px;border-radius:7px;background:color-mix(in srgb,currentColor 7%,Canvas);font:600 11px/16px ui-monospace,SFMono-Regular,Consolas,monospace;color:color-mix(in srgb,currentColor 72%,transparent)}.dsh-cloud-sync .providerMark svg{display:block;width:30px;height:30px}.dsh-cloud-sync .providerName{display:flex;align-items:center;gap:8px;font-size:14px;font-weight:600;line-height:20px}.dsh-cloud-sync .providerState{margin-top:2px;font-size:12px;line-height:18px;opacity:.62;overflow-wrap:anywhere}.dsh-cloud-sync .providerActions{display:flex;gap:7px;align-items:center;justify-content:flex-end}.dsh-cloud-sync .providerActions .connect{min-width:94px}.dsh-cloud-sync .historyList{margin-top:12px;border-top:1px solid color-mix(in srgb,currentColor 14%,transparent)}.dsh-cloud-sync .historyRow{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:12px;align-items:center;padding:12px 0;border-bottom:1px solid color-mix(in srgb,currentColor 12%,transparent)}.dsh-cloud-sync .historyTime{font-size:13px;font-weight:600;line-height:20px}.dsh-cloud-sync .historyDevice{font-size:12px;line-height:18px;opacity:.62}.dsh-cloud-sync .sourceTools{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;align-items:end;margin-top:12px}.dsh-cloud-sync .sourceTools .actions{margin:0}.dsh-cloud-sync .diffModal{width:min(980px,100%);padding:0;overflow:hidden}.dsh-cloud-sync .diffHead{position:sticky;top:0;z-index:2;padding:18px 20px 14px;border-bottom:1px solid color-mix(in srgb,currentColor 14%,transparent);background:Canvas}.dsh-cloud-sync .diffHead h3{margin:0 0 4px;font-size:17px}.dsh-cloud-sync .diffBody{max-height:calc(100vh - 260px);overflow:auto}.dsh-cloud-sync .diffGrid{display:grid;grid-template-columns:32px 80px minmax(180px,1.2fr) minmax(130px,1fr) minmax(130px,1fr);align-items:start}.dsh-cloud-sync .diffGrid>span{padding:10px 12px;border-bottom:1px solid color-mix(in srgb,currentColor 11%,transparent);font-size:12px;line-height:18px;overflow-wrap:anywhere}.dsh-cloud-sync .diffGrid.head{position:sticky;top:0;z-index:1;background:color-mix(in srgb,Canvas 94%,currentColor 6%)}.dsh-cloud-sync .diffGrid.head>span{font-weight:600}.dsh-cloud-sync .diffCheck{display:grid;place-items:center}.dsh-cloud-sync .diffCheck input{width:auto}.dsh-cloud-sync .diffKind{color:#1677ff}.dsh-cloud-sync .diffFooter{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 20px;border-top:1px solid color-mix(in srgb,currentColor 14%,transparent);background:Canvas}.dsh-cloud-sync .muted{font-size:12px;line-height:18px;opacity:.64}@media(max-width:620px){.dsh-cloud-sync .grid,.dsh-cloud-sync .overview{grid-template-columns:1fr}.dsh-cloud-sync .wide{grid-column:auto}.dsh-cloud-sync .configToolbar,.dsh-cloud-sync .sectionHead{align-items:stretch;flex-direction:column}.dsh-cloud-sync .modeField{justify-items:start}.dsh-cloud-sync .segments{width:100%}.dsh-cloud-sync .segments button{flex:1;min-width:0}.dsh-cloud-sync .providerCard{grid-template-columns:44px minmax(0,1fr);gap:10px}.dsh-cloud-sync .providerMark{width:40px;height:40px}.dsh-cloud-sync .providerActions{grid-column:2;justify-content:flex-start;flex-wrap:wrap}.dsh-cloud-sync .sourceTools{grid-template-columns:1fr}.dsh-cloud-sync .plugin{grid-template-columns:1fr}.dsh-cloud-sync .plugin button{justify-self:start}.dsh-cloud-sync .diffModal{max-height:calc(100vh - 24px)}.dsh-cloud-sync .diffGrid{grid-template-columns:28px 58px minmax(130px,1fr) 0 0}.dsh-cloud-sync .diffGrid>span:nth-child(4),.dsh-cloud-sync .diffGrid>span:nth-child(5){display:none}.dsh-cloud-sync .diffFooter{align-items:flex-start;flex-direction:column}}
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

  const providerLabels = { webdav: 'WebDAV', s3: 'Amazon S3', oss: '阿里云 OSS', cos: '腾讯云 COS', minio: 'MinIO' }
  const providerDefaults = {
    s3: { endpoint: 'https://s3.amazonaws.com', region: 'us-east-1' },
    oss: { endpoint: 'https://oss-cn-hangzhou.aliyuncs.com', region: 'cn-hangzhou' },
    cos: { endpoint: 'https://cos.ap-guangzhou.myqcloud.com', region: 'ap-guangzhou' },
    minio: { endpoint: 'http://127.0.0.1:9000', region: 'us-east-1' },
  }
  const objectProviderTypes = ['s3', 'oss', 'cos', 'minio']
  const providerTypes = Object.keys(providerLabels)
  const providerIsConfigured = provider => provider?.type === 'webdav' ? Boolean(provider.url) : objectProviderTypes.includes(provider?.type) && Boolean(provider.endpoint) && Boolean(provider.bucket)

  function ProviderLogo({ type }) {
    const svg = { viewBox: '0 0 24 24', role: 'img', 'aria-label': providerLabels[type] }
    if (type === 'webdav') return h('svg', svg, h('rect', { x: 3, y: 4, width: 18, height: 6, rx: 1.5, fill: 'none', stroke: '#68737d', 'stroke-width': 1.7 }), h('rect', { x: 3, y: 14, width: 18, height: 6, rx: 1.5, fill: 'none', stroke: '#68737d', 'stroke-width': 1.7 }), h('circle', { cx: 7, cy: 7, r: 1, fill: '#68737d' }), h('circle', { cx: 7, cy: 17, r: 1, fill: '#68737d' }))
    if (type === 's3') return h('svg', svg, h('path', { d: 'M5 5.5c0-1.4 3.1-2.5 7-2.5s7 1.1 7 2.5v13c0 1.4-3.1 2.5-7 2.5s-7-1.1-7-2.5z', fill: '#f5a800' }), h('path', { d: 'M5 5.5c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5M5 11.9c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5', fill: 'none', stroke: '#fff', 'stroke-width': 1.2 }))
    if (type === 'oss') return h('svg', svg, h('path', { d: 'M4 4.5h6l-1.4 2L4.2 7.7A1.7 1.7 0 0 0 3 9.3v5.4c0 .8.5 1.4 1.2 1.7l4.4 1.3 1.4 1.8H4a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3ZM20 4.5h-6l1.4 2 4.4 1.2c.7.3 1.2.9 1.2 1.6v5.4c0 .8-.5 1.4-1.2 1.7l-4.4 1.3-1.4 1.8h6a3 3 0 0 0 3-3V7.5a3 3 0 0 0-3-3ZM8 10.6h8v2H8z', fill: '#ff6a00' }))
    if (type === 'cos') return h('svg', svg, h('path', { d: 'M7.2 18.5h10.4a4.1 4.1 0 0 0 .7-8.1A6.3 6.3 0 0 0 6 8.8a4.9 4.9 0 0 0 1.2 9.7Z', fill: 'none', stroke: '#1677ff', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }), h('circle', { cx: 8, cy: 16, r: 1.2, fill: '#1677ff' }))
    return h('svg', svg, h('path', { d: 'M13.2.3a2 2 0 0 0-1.5.6 2.2 2.2 0 0 0-.1 3.1l3.4 3.5a3 3 0 0 1-.7 4.7l-.5.2V7.3a15.4 15.4 0 0 0-8 10.5l6.5-3.3v7.6l1.4 1.9V13.7l.9-.5a4.4 4.4 0 0 0 1.2-7l-3.4-3.6a.75.75 0 0 1 1.1-1l.5.5 4.1 4.2.1-.1-3.1-5.1-.2.1.2-.1A3.2 3.2 0 0 0 13.2.3Z', fill: '#c72e49' }))
  }

  function ProviderDialog({ settings, type, busy, onClose, onConnected, run }) {
    const initial = settings.provider?.type === type ? settings.provider : {}
    const [url, setUrl] = useState(initial.url || 'https://dav.example.invalid/dav/DSH-Sync')
    const [username, setUsername] = useState(initial.username || '')
    const [password, setPassword] = useState('')
    const [endpoint, setEndpoint] = useState(initial.endpoint || providerDefaults[type]?.endpoint || providerDefaults.s3.endpoint)
    const [region, setRegion] = useState(initial.region || providerDefaults[type]?.region || providerDefaults.s3.region)
    const [bucket, setBucket] = useState(initial.bucket || '')
    const [prefix, setPrefix] = useState(initial.prefix ?? 'DSH-Sync')
    const [accessKeyId, setAccessKeyId] = useState(initial.accessKeyId || '')
    const [secretAccessKey, setSecretAccessKey] = useState('')
    const [showSecret, setShowSecret] = useState(false)
    const connect = run('connect', async () => {
      const provider = type === 'webdav' ? { type, url, username, password } : { type, endpoint, region, bucket, prefix, accessKeyId, secretAccessKey }
      const value = await api('provider/connect', { provider })
      onConnected(value); onClose(); return `${providerLabels[type]} 已连接并设为当前同步渠道。`
    })
    const storedSecret = settings.provider?.type === type && (settings.provider?.password === '<stored-locally>' || settings.provider?.secretAccessKey === '<stored-locally>')
    return h('div', { className: 'modalBack', onMouseDown: onClose }, h('section', { className: 'modal', role: 'dialog', 'aria-modal': 'true', 'aria-label': '同步渠道设置', onMouseDown: event => event.stopPropagation() },
      h('div', { className: 'modalHead' }, h('div', null, h('h3', null, providerLabels[type]), h('p', { className: 'hint' }, settings.provider?.type === type ? '修改当前渠道的连接信息。' : `连接后将停用 ${providerLabels[settings.provider?.type] || '当前渠道'}。`)), h('button', { className: 'modalClose', onClick: onClose, 'aria-label': '关闭' }, '×')),
      h('div', { className: 'grid' },
        type === 'webdav' ? h(React.Fragment, null,
          h(Field, { label: '端点地址', wide: true }, h('input', { value: url, onChange: event => setUrl(event.target.value), placeholder: 'https://dav.example.invalid/dav/DSH-Sync' })),
          h(Field, { label: '用户名', wide: true }, h('input', { value: username, onChange: event => setUsername(event.target.value), placeholder: '账号' })),
          h(Field, { label: '应用密码', wide: true }, h('input', { type: showSecret ? 'text' : 'password', value: password, onChange: event => setPassword(event.target.value), placeholder: storedSecret ? '已保存，留空不变' : '必填' }))
        ) : h(React.Fragment, null,
          h(Field, { label: 'Endpoint', wide: true }, h('input', { value: endpoint, onChange: event => setEndpoint(event.target.value), placeholder: providerDefaults[type].endpoint })),
          h(Field, { label: 'Region' }, h('input', { value: region, onChange: event => setRegion(event.target.value), placeholder: providerDefaults[type].region })),
          h(Field, { label: 'Bucket' }, h('input', { value: bucket, onChange: event => setBucket(event.target.value), placeholder: type === 'cos' ? 'bucket-appid' : 'bucket-name' })),
          h(Field, { label: '对象前缀', wide: true }, h('input', { value: prefix, onChange: event => setPrefix(event.target.value), placeholder: 'DSH-Sync' })),
          h(Field, { label: 'Access Key ID', wide: true }, h('input', { value: accessKeyId, onChange: event => setAccessKeyId(event.target.value), placeholder: 'Access Key ID' })),
          h(Field, { label: 'Secret Access Key', wide: true }, h('input', { type: showSecret ? 'text' : 'password', value: secretAccessKey, onChange: event => setSecretAccessKey(event.target.value), placeholder: storedSecret ? '已保存，留空不变' : '必填' }))
        )
      ),
      h('label', { className: 'check' }, h('input', { type: 'checkbox', checked: showSecret, onChange: event => setShowSecret(event.target.checked) }), '显示密钥'),
      h('div', { className: 'modalFooter' }, h('button', { disabled: busy !== '', onClick: onClose }, '取消'), h('button', { className: 'primary', disabled: busy !== '', onClick: connect }, busy === 'connect' ? '正在连接' : '连接并保存'))
    ))
  }

  function ServicesTab({ run, busy, setResult }) {
    const [settings, setSettings] = useState()
    const [editingProvider, setEditingProvider] = useState()
    useEffect(() => { api('settings/get').then(setSettings).catch(error => setResult(`错误: ${error.message}`)) }, [])
    const configured = providerIsConfigured(settings?.provider)
    if (settings === undefined) return h('p', { className: 'notice' }, '正在读取同步配置...')
    const cancelProvider = run('cancel-provider', async () => { const value = await api('settings/clear-provider'); setSettings(value); return '已停用当前云服务。' })
    const providerDetail = type => {
      if (settings.provider?.type !== type || !configured) return '未启用'
      if (type === 'webdav') return `${settings.provider.username || '未填写用户名'} · ${settings.provider.url}`
      return `${settings.provider.bucket} · ${settings.provider.endpoint}${settings.provider.prefix ? `/${settings.provider.prefix}` : ''}`
    }
    return h(React.Fragment, null,
      h('section', { className: 'group' },
        h('div', { className: 'configToolbar' }, h('div', null, h('h3', null, '云服务'), h('p', { className: 'hint' }, '选择一个远端服务作为当前同步渠道。'))),
        h('div', { className: 'providerList' }, providerTypes.map(type => {
          const active = configured && settings.provider.type === type
          return h('div', { className: `providerCard ${active ? 'active' : ''}`, key: type },
            h('div', { className: 'providerMark' }, h(ProviderLogo, { type })),
            h('div', null, h('div', { className: 'providerName' }, providerLabels[type], h('span', { className: `dot ${active ? 'ok' : ''}` })), h('div', { className: 'providerState' }, providerDetail(type))),
            h('div', { className: 'providerActions' }, active ? h(React.Fragment, null, h('button', { disabled: busy !== '', onClick: () => setEditingProvider(type) }, '编辑'), h('button', { className: 'danger', disabled: busy !== '', onClick: cancelProvider }, '停用')) : h('button', { className: 'connect', disabled: busy !== '', onClick: () => setEditingProvider(type) }, '连接并启用'))
          )
        }))
      ),
      editingProvider ? h(ProviderDialog, { settings, type: editingProvider, busy, onClose: () => setEditingProvider(undefined), onConnected: setSettings, run }) : null,
    )
  }

  function ConfigurationHistoryTab({ run, busy, setResult }) {
    const [settings, setSettings] = useState()
    const [strategy, setStrategy] = useState('smart')
    const [conflicts, setConflicts] = useState([])
    const [changes, setChanges] = useState([])
    const [selectedItems, setSelectedItems] = useState([])
    const [diffOpen, setDiffOpen] = useState(false)
    const [history, setHistory] = useState([])
    const [source, setSource] = useState('')
    useEffect(() => { api('settings/get').then(value => { setSettings(value); setStrategy(value.syncPolicy || 'smart'); if (providerIsConfigured(value.provider)) api('snapshot/history').then(setHistory).catch(() => {}) }).catch(error => setResult(`错误: ${error.message}`)) }, [])
    const configured = providerIsConfigured(settings?.provider)
    const refreshChanges = async () => { const value = await api('snapshot/diff'); setChanges(value.items); setSelectedItems(value.items.map(item => item.id)); return value }
    const refreshHistory = async () => { const value = await api('snapshot/history'); setHistory(value); return value }
    if (settings === undefined) return h('p', { className: 'notice' }, '正在读取配置与历史...')
    const sync = (resolveConflicts, all = false) => run('sync', async () => {
      const value = await api('snapshot/push', { strategy, resolveConflicts, selectedItems: all ? undefined : selectedItems })
      if (value.direction === 'needs-choice') { setConflicts(value.conflicts); return `智能合并发现 ${value.conflicts.length} 个冲突。请选择本次冲突优先保留的版本。` }
      setConflicts([]); await refreshChanges(); await refreshHistory().catch(() => {})
      const sourceWarning = value.missingLocalSources?.length ? `\n未能读取本地源码: ${value.missingLocalSources.join(', ')}` : ''
      const build = value.direction === 'downloaded' ? '已从云端恢复配置' : value.direction === 'merged' ? '已智能合并并同步' : '已同步到云端'
      return `${build}: ${new Date(value.createdAt).toLocaleString()}${sourceWarning}`
    })
    const beginSync = strategy === 'local' ? sync(undefined, true) : run('prepare-sync', async () => { const value = await refreshChanges(); setDiffOpen(true); return value.items.length === 0 ? '本地与云端没有差异。' : '' })
    return h(React.Fragment, null,
      h('section', { className: 'group' }, h('div', { className: 'configToolbar' }, h('div', null, h('h3', null, '同步配置'), h('p', { className: 'hint' }, configured ? `当前渠道：${providerLabels[settings.provider.type]}` : '请先到“云服务”连接一个渠道。')), configured ? h('div', { className: 'modeField' }, h('span', { className: 'modeLabel' }, '同步方式'), h('div', { className: 'segments', role: 'group', 'aria-label': '同步方式' }, [['smart', '智能合并', '合并两端变化'], ['cloud', '云端优先', '用云端覆盖本机'], ['local', '本地优先', '用本机覆盖云端']].map(([value, label, title]) => h('button', { key: value, className: strategy === value ? 'active' : '', title, 'aria-pressed': strategy === value, onClick: () => { setStrategy(value); setConflicts([]); setChanges([]) } }, label)))) : null), configured ? h('div', { className: 'actions' }, h('button', { className: 'primary', disabled: busy !== '', onClick: beginSync }, busy === 'sync' || busy === 'prepare-sync' ? '正在准备' : '开始同步')) : null, conflicts.length ? h('div', { className: 'conflicts' }, h('strong', null, `有 ${conflicts.length} 项无法自动合并`), h('p', { className: 'hint' }, '请选择本次冲突保留哪一侧的版本。'), h('div', { className: 'actions' }, h('button', { disabled: busy !== '', onClick: sync('cloud') }, '保留云端'), h('button', { disabled: busy !== '', onClick: sync('local') }, '保留本地'))) : null),
      h('section', { className: 'group' }, h('div', { className: 'sectionHead' }, h('div', null, h('h3', null, `历史与恢复${history.length ? `（${history.length}）` : ''}`), h('p', { className: 'hint' }, '恢复前会先备份当前配置，应用后需要重启 DSH。')), h('div', { className: 'serviceActions' }, h('button', { disabled: busy !== '' || !configured, onClick: run('history', async () => { const value = await refreshHistory(); return `已读取 ${value.length} 个历史快照。` }) }, '刷新历史'), h('button', { disabled: busy !== '' || !configured, onClick: run('preview', async () => { const value = await api('snapshot/pull'); return `远端快照: ${value.createdAt}\nProfile: ${value.plan.map(item => item.name).join(', ') || '无'}` }) }, '预览远端'), h('button', { className: 'danger', disabled: busy !== '' || !configured, onClick: run('restore', async () => { const value = await api('snapshot/pull', { apply: true }); return `恢复已应用；请完全退出并重新启动 DSH。\n本机备份: ${value.backup}` }) }, '应用远端'))), history.length ? h('div', { className: 'historyList' }, history.slice(0, 8).map(entry => h('div', { className: 'historyRow', key: entry.key }, h('div', null, h('div', { className: 'historyTime' }, new Date(entry.createdAt).toLocaleString()), h('div', { className: 'historyDevice' }, entry.deviceName || entry.deviceId || '未知设备')), h('button', { disabled: busy !== '', onClick: run(`rollback:${entry.key}`, async () => { const value = await api('snapshot/pull', { apply: true, snapshotKey: entry.key }); return `已回滚到历史快照，请重启 DSH。\n本机备份: ${value.backup}` }) }, '恢复此版本')))) : h('p', { className: 'empty' }, configured ? '尚无历史快照。' : '启用同步渠道后可查看历史。')),
      h('section', { className: 'group' }, h('div', { className: 'sectionHead' }, h('div', null, h('h3', null, '本地插件源码'), h('p', { className: 'hint' }, '用于补充归档无法自动发现源码目录的本地插件。'))), h('div', { className: 'sourceTools' }, h(Field, { label: '源码目录', wide: true }, h('input', { value: source, onChange: event => setSource(event.target.value), placeholder: 'E:\\dsh-plugin' })), h('div', { className: 'actions' }, h('button', { className: 'primary', disabled: busy !== '' || source.trim() === '', onClick: run('backup', async () => { const value = await api('source/backup', { directory: source }); return `已归档 ${value.name} ${value.version}，下次同步会上传。` }) }, '备份源码')))),
      diffOpen ? h(DiffDialog, { changes, selectedItems, setSelectedItems, strategy, busy, onClose: () => setDiffOpen(false), onSync: () => { setDiffOpen(false); (strategy === 'cloud' ? sync(undefined, true) : sync())() } }) : null
    )
  }

  function StatusTab({ run, busy, setResult }) {
    const [inventory, setInventory] = useState()
    const [settings, setSettings] = useState()
    const refresh = async () => {
      const [value, currentSettings] = await Promise.all([api('inventory'), api('settings/get')])
      setInventory(value); setSettings(currentSettings)
      return value
    }
    useEffect(() => { refresh().catch(error => setResult(`错误: ${error.message}`)) }, [])
    const install = plugin => run(`install:${plugin.name}`, async () => { const value = await api('plugin/install-configured', { packageName: plugin.name }); await refresh(); return value.buildApprovalRequired ? `${plugin.name} 已安装并启用，但部分依赖的构建脚本等待 pnpm 审批。重启 DSH 后可使用不依赖这些构建脚本的功能。` : `${plugin.name} 已安装并启用，请重启 DSH。` })
    const uninstall = plugin => run(`uninstall:${plugin.name}`, async () => { await api('plugin/uninstall', { packageName: plugin.name }); await refresh(); return `${plugin.name} 已卸载，请重启 DSH。` })
    if (inventory === undefined || settings === undefined) return h('p', { className: 'notice' }, '正在读取远端快照与本机安装状态...')
    const remote = inventory.remote
    const configured = providerIsConfigured(settings.provider)
    return h(React.Fragment, null,
      h('section', { className: 'group' }, h('div', { className: 'sectionHead' }, h('div', null, h('h3', null, '同步状态'), h('p', { className: 'hint' }, configured ? `当前渠道：${providerLabels[settings.provider.type]}` : '尚未启用同步渠道。')), h('button', { disabled: busy !== '', onClick: run('refresh', refresh) }, busy === 'refresh' ? '刷新中' : '刷新')), h('div', { className: 'overview' }, h('div', { className: 'metric' }, h('span', { className: 'metricLabel' }, '远端快照'), h('span', { className: 'metricValue' }, remote.available ? '可用' : '未连接'), h('span', { className: 'metricDetail' }, remote.available ? new Date(remote.createdAt).toLocaleString() : remote.error || '请先配置同步渠道并同步')), h('div', { className: 'metric' }, h('span', { className: 'metricLabel' }, '本机 Web Profile'), h('span', { className: 'metricValue' }, `${inventory.local.dependencies} 个插件`), h('span', { className: 'metricDetail' }, `${inventory.local.bundles} 个已启用 Bundle`)))),
      h('section', { className: 'group' }, h('div', { className: 'sectionHead' }, h('div', null, h('h3', null, '插件安装状态'), h('p', { className: 'hint' }, '对比远端快照与本机 Web Profile。'))), h('div', { className: 'pluginList' }, inventory.plugins.length === 0 ? h('p', { className: 'empty' }, '没有发现插件。') : inventory.plugins.map(plugin => h('div', { className: 'plugin', key: plugin.name }, h('div', null, h('div', { className: 'pluginName' }, plugin.name), h('div', { className: 'pluginMeta' }, h('span', { className: `pill ${plugin.installed ? 'ok' : 'warn'}` }, plugin.installed ? '已安装' : '未安装'), plugin.enabled ? h('span', { className: 'pill ok' }, '已启用') : null, plugin.localSource ? h('span', { className: `pill ${plugin.sourceArchived ? '' : 'warn'}` }, plugin.sourceArchived ? '本地源码' : '源码未归档') : null, h('span', null, plugin.requested))), plugin.name === '@dickpy/dsh-cloud-sync' ? h('button', { disabled: true }, '当前工具') : plugin.installed ? h('button', { className: 'danger', disabled: busy !== '', onClick: uninstall(plugin) }, '卸载') : h('button', { className: 'primary', disabled: busy !== '' || !plugin.configuredInRemote || (plugin.localSource && !plugin.sourceArchived), onClick: install(plugin) }, plugin.localSource && !plugin.sourceArchived ? '源码缺失' : '安装')))))
    )
  }

  function CloudSyncSection() {
    const [tab, setTab] = useState('services')
    const [busy, setBusy] = useState('')
    const [result, setResult] = useState('')
    const [version, setVersion] = useState('')
    useEffect(() => { api('release/check').then(value => setVersion(value.localVersion || '')).catch(() => {}) }, [])
    const run = (label, operation) => async () => { setBusy(label); try { const value = await operation(); if (typeof value === 'string') setResult(value) } catch (error) { setResult(`错误: ${error.message}`) } finally { setBusy('') } }
    return h('div', { className: 'dsh-cloud-sync' }, h('style', null, `${css}\n${layoutCss}`), h('div', { className: 'syncHeader' }, h('h2', null, '云同步', version === '' ? null : h('span', { className: 'version' }, `v${version}`)), h('p', { className: 'intro' }, '管理同步服务、配置与恢复历史。'), h(ReleaseUpdateNotice, { run, busy, setResult }), h('div', { className: 'tabs', role: 'tablist', 'aria-label': '云同步页面' }, h('button', { className: 'tab', role: 'tab', 'aria-selected': tab === 'services', onClick: () => setTab('services') }, '云服务'), h('button', { className: 'tab', role: 'tab', 'aria-selected': tab === 'history', onClick: () => setTab('history') }, '配置与历史'), h('button', { className: 'tab', role: 'tab', 'aria-selected': tab === 'status', onClick: () => setTab('status') }, '同步状态'))), h('div', { role: 'tabpanel' }, tab === 'services' ? h(ServicesTab, { run, busy, setResult }) : tab === 'history' ? h(ConfigurationHistoryTab, { run, busy, setResult }) : h(StatusTab, { run, busy, setResult })), h(Result, { value: result }))
  }

  const inject = ['slots']
  function apply(ctx) { ctx.slots.inject('settings.section', () => ctx.slots.register({ name: 'settings.section', id: 'cloud-sync', order: 25, label: () => '云同步' }, CloudSyncSection)) }
  return { inject, apply }
} })
