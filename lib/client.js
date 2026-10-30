window.__ModuleLoader__.load({ id: '@dickpy/dsh-cloud-sync', factory: (require) => {
  const React = require('react')
  const h = React.createElement
  const { useEffect, useState } = React
  const clientVersion = '0.20.10'

  const NS = '@dickpy/dsh-cloud-sync'
  const zh = {
    'ui.1': "错误:",
    'ui.2': "将从本地移除",
    'ui.3': "将写入本地",
    'ui.4': "将用云端版本替换本地",
    'ui.5': "将从云端加入本地",
    'ui.6': "将上传到云端",
    'ui.7': "保持云端状态",
    'ui.8': "将采用本地版本合并",
    'ui.9': "将保持云端版本",
    'ui.10': "云端同步对本机的影响",
    'ui.11': "智能合并：选择本地变化",
    'ui.12': "确认后，云端配置会写入本机。该操作不会立即安装或卸载依赖，重启 DSH 后才会按新配置处理。",
    'ui.13': "只勾选需要从本机带入合并的项目；未勾选项目将保持云端版本。",
    'ui.14': "同步差异",
    'ui.15': "关闭",
    'ui.16': "全选本地变化",
    'ui.17': "全部保留云端",
    'ui.18': "类别",
    'ui.19': "项目",
    'ui.20': "当前状态",
    'ui.21': "同步后",
    'ui.22': "插件",
    'ui.23': "配置",
    'ui.24': "取消",
    'ui.25': "按云端同步",
    'ui.26': "开始智能合并",
    'ui.27': "云同步已是最新版本。",
    'ui.28': "云同步有新版本",
    'ui.29': "正在更新",
    'ui.30': "更新",
    'ui.31': "阿里云 OSS",
    'ui.32': "腾讯云 COS",
    'ui.33': "七牛云 Kodo",
    'ui.34': "填写 WebDAV 地址、用户名和应用密码。密码只保存在本机凭据文件中。",
    'ui.35': "填写 S3 Endpoint、Region、Bucket 和访问密钥。",
    'ui.36': "Endpoint 与 Region 必须对应，例如 oss-cn-shanghai 对应 cn-shanghai。",
    'ui.37': "Bucket 通常包含 APPID，Region 使用腾讯云控制台显示的地域。",
    'ui.38': "填写 MinIO 服务地址、Bucket 和访问密钥。",
    'ui.39': "厂商赠送 10GB 免费额度。Bucket 使用控制台中的 S3 空间名（全局唯一），Endpoint 与 Region 对应七牛云 S3 区域，如 cn-east-1。",
    'ui.40': "GitHub Gist 适合不含本地源码归档的配置同步。每个同步对象最多约 700 KiB，超过请使用 WebDAV 或对象存储。",
    'ui.41': "AWS S3 控制台",
    'ui.42': "阿里云 OSS 控制台",
    'ui.43': "腾讯云 COS 控制台",
    'ui.44': "MinIO 官网",
    'ui.45': "七牛云 Kodo 控制台",
    'ui.46': "GitHub 官网",
    'ui.47': "等待 GitHub 授权...",
    'ui.48': "GitHub Gist 已连接并设为当前同步渠道。",
    'ui.49': "连接 GitHub Gist",
    'ui.50': "连接到 GitHub",
    'ui.51': "授权后会自动创建并连接一个 secret Gist。",
    'ui.52': "复制下方 code，并在 GitHub 页面完成授权。",
    'ui.53': "前往 GitHub",
    'ui.54': "正在获取授权码",
    'ui.55': "通过授权码连接 GitHub",
    'ui.56': "当前无法使用授权码连接。可使用下方拥有 gist 权限的 Token 继续。",
    'ui.57': "正在检查 GitHub 授权…",
    'ui.58': "GitHub 会创建或绑定一个 secret Gist。单个同步对象上限约 700 KiB，最多 200 个文件；需要归档本地插件源码时，请使用 WebDAV 或对象存储。",
    'ui.59': "授权码已复制。",
    'ui.60': "请手动复制授权码。",
    'ui.61': "复制 code",
    'ui.62': "打开 GitHub",
    'ui.63': "等待授权…",
    'ui.64': "改用 GitHub Token 连接",
    'ui.65': "Gist ID（留空自动创建）",
    'ui.66': "留空自动创建 secret Gist",
    'ui.67': "GitHub Token（需要 gist 权限）",
    'ui.68': "已保存，留空不变",
    'ui.69': "显示 Token",
    'ui.70': "正在连接",
    'ui.71': "连接 Token",
    'ui.72': "修改当前渠道的连接信息。",
    'ui.73': "已加载上次配置，确认后即可重新启用。",
    'ui.74': "当前渠道",
    'ui.75': "同步渠道设置",
    'ui.76': "端点地址",
    'ui.77': "用户名",
    'ui.78': "账号",
    'ui.79': "应用密码",
    'ui.80': "必填",
    'ui.81': "对象前缀",
    'ui.82': "显示密钥",
    'ui.83': "连接并保存",
    'ui.84': "确认停用同步服务",
    'ui.85': "停用同步服务？",
    'ui.86': "正在停用",
    'ui.87': "确认停用",
    'ui.88': "正在读取同步配置...",
    'ui.89': "已停用当前云服务。",
    'ui.90': "已保存配置",
    'ui.91': "未启用",
    'ui.92': "未填写用户名",
    'ui.93': "云服务",
    'ui.94': "选择一个远端服务作为当前同步渠道。",
    'ui.95': "已连接",
    'ui.96': "已保存",
    'ui.97': "编辑",
    'ui.98': "停用",
    'ui.99': "启用",
    'ui.100': "连接",
    'ui.101': "正在读取配置与历史...",
    'ui.102': "已从云端恢复配置",
    'ui.103': "已智能合并并同步",
    'ui.104': "已同步到云端",
    'ui.105': "本地与云端没有差异。",
    'ui.106': "同步配置",
    'ui.107': "同步方式",
    'ui.108': "智能合并",
    'ui.109': "合并两端变化",
    'ui.110': "云端优先",
    'ui.111': "用云端覆盖本机",
    'ui.112': "本地优先",
    'ui.113': "用本机覆盖云端",
    'ui.114': "正在准备",
    'ui.115': "开始同步",
    'ui.116': "请选择本次冲突保留哪一侧的版本。",
    'ui.117': "保留云端",
    'ui.118': "保留本地",
    'ui.119': "恢复前会先备份当前配置，应用后需要重启 DSH。",
    'ui.120': "无",
    'ui.121': "预览远端",
    'ui.122': "未知设备",
    'ui.123': "尚无历史快照。",
    'ui.124': "启用同步渠道后可查看历史。",
    'ui.125': "本地插件源码",
    'ui.126': "用于补充归档无法自动发现源码目录的本地插件。",
    'ui.127': "源码目录",
    'ui.128': "正在读取远端快照与本机安装状态...",
    'ui.129': "同步状态",
    'ui.130': "刷新中",
    'ui.131': "刷新",
    'ui.132': "远端快照",
    'ui.133': "可用",
    'ui.134': "未连接",
    'ui.135': "请先配置同步渠道并同步",
    'ui.136': "本机 Web Profile",
    'ui.137': "插件安装状态",
    'ui.138': "对比远端快照与本机 Web Profile。",
    'ui.139': "没有发现插件。",
    'ui.140': "已安装",
    'ui.141': "未安装",
    'ui.142': "已启用",
    'ui.143': "本地源码",
    'ui.144': "源码未归档",
    'ui.145': "当前工具",
    'ui.146': "卸载",
    'ui.147': "源码缺失",
    'ui.148': "安装",
    'ui.149': "已保存配置，可直接启用",
    'ui.150': "编辑当前渠道",
    'ui.151': "合并两端更改；发生冲突时再由你选择保留哪一端。",
    'ui.152': "用云端快照覆盖当前设备，适合新设备恢复。",
    'ui.153': "用当前设备覆盖云端快照，适合将本机作为最新版本。",
    'ui.154': "请先在“云服务”中连接一个同步渠道。",
    'ui.155': "选择同步方式后开始同步",
    'ui.156': "推荐",
    'ui.157': "正在准备同步",
    'ui.158': "恢复前会先备份当前配置",
    'ui.159': "最新",
    'ui.160': "连接同步渠道后可查看历史。",
    'ui.161': "GitHub Gist 已启用“仅配置同步”，本地插件源码不会上传。需要跨设备恢复源码时，请切换到 WebDAV 或对象存储。",
    'ui.162': "本地插件源码归档",
    'ui.163': "刷新状态",
    'ui.164': "远端状态",
    'ui.165': "请先完成一次同步",
    'ui.166': "对比远端快照与本机 Web Profile",
    'ui.167': "云同步服务",
    'ui.168': "觉得好用或有建议？欢迎来 GitHub 提 Issue、点亮 Star ⭐ 支持一下！",
    'ui.169': "打开 GitHub 仓库",
    'ui.170': "安全同步配置、插件与数据，随时保持一致",
    'ui.171': "云同步页面",
    'ui.172': "配置与历史",
    'ui.173': "云同步",
    'ui.174': "本地 {{local}} · 云端 {{remote}}",
    'ui.175': "已选择 {{selected}} / {{total}} 项本地变化",
    'ui.176': "共 {{count}} 项会影响本机",
    'ui.177': "当前 v{{version}}，可安装同版本修复",
    'ui.178': "当前 v{{version}}，可更新至 v{{release}}",
    'ui.179': "连接后将停用 {{provider}}。",
    'ui.180': "前往 {{provider}} 官网",
    'ui.181': "将断开 {{provider}}，之后不会再自动同步。云端数据不会被删除。",
    'ui.182': "智能合并发现 {{count}} 个冲突。请选择本次冲突优先保留的版本。",
    'ui.183': "当前渠道：{{provider}}",
    'ui.184': "请先到“云服务”连接一个渠道。",
    'ui.185': "有 {{count}} 项无法自动合并",
    'ui.186': "历史与恢复{{count}}",
    'ui.187': "已读取 {{count}} 个历史快照。",
    'ui.188': "Remote snapshot: {{date}}\nProfile: {{profile}}",
    'ui.190': "Rolled back to the history snapshot; restart DSH.\nLocal backup: {{backup}}",
    'ui.192': "{{name}} 已安装并启用，但部分依赖的构建脚本等待 pnpm 审批。重启 DSH 后可使用不依赖这些构建脚本的功能。",
    'ui.193': "{{name}} 已安装并启用，请重启 DSH。",
    'ui.194': "{{name}} 已卸载，请重启 DSH。",
    'ui.195': "尚未启用同步渠道。",
    'ui.196': "{{count}} 个插件",
    'ui.197': "{{count}} 个已启用 Bundle",
    'ui.198': "备份源码",
    'ui.199': "刷新历史",
    'ui.200': "应用远端",
    'ui.201': "恢复此版本",
    'ui.202': "刷新",
    'ui.203': "预览远端",
    'ui.204': "初始化失败: {{error}}",
    'ui.205': "操作失败: {{error}}",
    'ui.206': "云同步已更新到 v{{version}}，请完全退出并重新启动 DSH。",
    'ui.207': "未能读取本地源码: {{sources}}",
    'ui.208': "历史备份上限",
    'ui.209': "保存",
    'ui.210': "已保存：最多保留 {{count}} 个历史备份，超出后自动删除最旧的备份。",
    'ui.211': "云端保留的历史快照数量（1-200），超出后自动删除最旧的备份",
    'ui.212': "允许 HTTP（仅限可信内网）",
    'ui.213': "HTTP 会以明文传输账号凭据，仅请在家庭或内网等可信网络启用；公网访问请务必使用 HTTPS。",
    'ui.214': "{{provider}} 已连接并设为当前同步渠道。",
  }
  const en = {
    'ui.1': "Error:",
    'ui.2': "Will remove from local",
    'ui.3': "Will write to local",
    'ui.4': "Will replace local with cloud version",
    'ui.5': "Will add from cloud to local",
    'ui.6': "Will upload to cloud",
    'ui.7': "Keep cloud state",
    'ui.8': "Merge using local version",
    'ui.9': "Keep cloud version",
    'ui.10': "Impact of cloud sync on this device",
    'ui.11': "Smart merge: choose local changes",
    'ui.12': "After confirmation, the cloud configuration will be written to this device. Dependencies are not installed or uninstalled immediately; restart DSH to apply the new configuration.",
    'ui.13': "Select only items to bring from local into the merge; unchecked items keep the cloud version.",
    'ui.14': "Sync differences",
    'ui.15': "Close",
    'ui.16': "Select all local changes",
    'ui.17': "Keep all cloud versions",
    'ui.18': "Type",
    'ui.19': "Item",
    'ui.20': "Current state",
    'ui.21': "After sync",
    'ui.22': "Plugin",
    'ui.23': "Configuration",
    'ui.24': "Cancel",
    'ui.25': "Sync from cloud",
    'ui.26': "Start smart merge",
    'ui.27': "Cloud sync is already up to date.",
    'ui.28': "Cloud sync has a new version",
    'ui.29': "Updating",
    'ui.30': "Update",
    'ui.31': "Alibaba Cloud OSS",
    'ui.32': "Tencent Cloud COS",
    'ui.33': "Qiniu Cloud Kodo",
    'ui.34': "Enter the WebDAV URL, username, and app password. The password is stored only in the local credentials file.",
    'ui.35': "Enter the S3 Endpoint, Region, Bucket, and access key.",
    'ui.36': "Endpoint and Region must match; for example, oss-cn-shanghai corresponds to cn-shanghai.",
    'ui.37': "The Bucket usually includes the APPID; use the region shown in the Tencent Cloud console.",
    'ui.38': "Enter the MinIO server URL, Bucket, and access key.",
    'ui.39': "The provider offers 10 GB free. Use the S3 space name from the console (globally unique); match Endpoint and Region to a Qiniu S3 region such as cn-east-1.",
    'ui.40': "GitHub Gist is suitable for syncing configuration without local source archives. Each sync object is limited to about 700 KiB; use WebDAV or object storage for larger objects.",
    'ui.41': "AWS S3 Console",
    'ui.42': "Alibaba Cloud OSS Console",
    'ui.43': "Tencent Cloud COS Console",
    'ui.44': "MinIO Website",
    'ui.45': "Qiniu Cloud Kodo Console",
    'ui.46': "GitHub Website",
    'ui.47': "Waiting for GitHub authorization...",
    'ui.48': "GitHub Gist connected and set as the current sync channel.",
    'ui.49': "Connect GitHub Gist",
    'ui.50': "Connect to GitHub",
    'ui.51': "Authorization will create or connect a secret Gist automatically.",
    'ui.52': "Copy the code below and complete authorization on GitHub.",
    'ui.53': "Go to GitHub",
    'ui.54': "Getting authorization code",
    'ui.55': "Connect GitHub with a device code",
    'ui.56': "Device-code connection is currently unavailable. Use a Token with gist permission below instead.",
    'ui.57': "Checking GitHub authorization…",
    'ui.58': "GitHub will create or bind a secret Gist. Each sync object is limited to about 700 KiB and 200 files; use WebDAV or object storage to archive local plugin source.",
    'ui.59': "Authorization code copied.",
    'ui.60': "Please copy the authorization code manually.",
    'ui.61': "Copy code",
    'ui.62': "Open GitHub",
    'ui.63': "Waiting for authorization…",
    'ui.64': "Connect with a GitHub Token",
    'ui.65': "Gist ID (leave blank to create automatically)",
    'ui.66': "Leave blank to create a secret Gist automatically",
    'ui.67': "GitHub Token (gist permission required)",
    'ui.68': "Saved; leave blank to keep unchanged",
    'ui.69': "Show token",
    'ui.70': "Connecting",
    'ui.71': "Connect Token",
    'ui.72': "Edit the current channel connection details.",
    'ui.73': "Previous configuration loaded; confirm to re-enable it.",
    'ui.74': "Current channel",
    'ui.75': "Sync channel settings",
    'ui.76': "Endpoint URL",
    'ui.77': "Username",
    'ui.78': "Account",
    'ui.79': "App password",
    'ui.80': "Required",
    'ui.81': "Object prefix",
    'ui.82': "Show secret",
    'ui.83': "Connect & save",
    'ui.84': "Confirm disabling sync service",
    'ui.85': "Disable sync service?",
    'ui.86': "Disabling",
    'ui.87': "Confirm disable",
    'ui.88': "Loading sync configuration...",
    'ui.89': "Current cloud service disabled.",
    'ui.90': "Configuration saved",
    'ui.91': "Not enabled",
    'ui.92': "Username not provided",
    'ui.93': "Cloud services",
    'ui.94': "Choose a remote service as the current sync channel.",
    'ui.95': "Connected",
    'ui.96': "Saved",
    'ui.97': "Edit",
    'ui.98': "Disable",
    'ui.99': "Enable",
    'ui.100': "Connect",
    'ui.101': "Loading configuration and history...",
    'ui.102': "Configuration restored from cloud",
    'ui.103': "Smart merge completed and synced",
    'ui.104': "Synced to cloud",
    'ui.105': "No differences between local and cloud.",
    'ui.106': "Sync configuration",
    'ui.107': "Sync method",
    'ui.108': "Smart merge",
    'ui.109': "Merge changes from both sides",
    'ui.110': "Cloud first",
    'ui.111': "Overwrite local with cloud",
    'ui.112': "Local first",
    'ui.113': "Overwrite cloud with local",
    'ui.114': "Preparing",
    'ui.115': "Start sync",
    'ui.116': "Choose which side to keep for this conflict.",
    'ui.117': "Keep cloud",
    'ui.118': "Keep local",
    'ui.119': "The current configuration will be backed up before restore; restart DSH after applying.",
    'ui.120': "None",
    'ui.121': "Preview remote",
    'ui.122': "Unknown device",
    'ui.123': "No history snapshots yet.",
    'ui.124': "Enable a sync channel to view history.",
    'ui.125': "Local plugin source",
    'ui.126': "For local plugins whose source directory cannot be discovered automatically when archiving.",
    'ui.127': "Source directory",
    'ui.128': "Loading remote snapshot and local installation...",
    'ui.129': "Sync status",
    'ui.130': "Refreshing",
    'ui.131': "Refresh",
    'ui.132': "Remote snapshot",
    'ui.133': "Available",
    'ui.134': "Not connected",
    'ui.135': "Configure a sync channel and sync first",
    'ui.136': "Local Web Profile",
    'ui.137': "Plugin installation status",
    'ui.138': "Compare the remote snapshot with the local Web Profile.",
    'ui.139': "No plugins found.",
    'ui.140': "Installed",
    'ui.141': "Not installed",
    'ui.142': "Enabled",
    'ui.143': "Local source",
    'ui.144': "Source not archived",
    'ui.145': "Current tool",
    'ui.146': "Uninstall",
    'ui.147': "Source missing",
    'ui.148': "Install",
    'ui.149': "Saved configuration; ready to enable",
    'ui.150': "Edit current channel",
    'ui.151': "Merge changes from both sides; choose which side to keep when conflicts occur.",
    'ui.152': "Overwrite this device with the cloud snapshot; suitable for restoring a new device.",
    'ui.153': "Overwrite the cloud snapshot with this device; suitable for making this the latest version.",
    'ui.154': "Connect a sync channel under “Cloud services” first.",
    'ui.155': "Choose a sync method to start syncing",
    'ui.156': "Recommended",
    'ui.157': "Preparing sync",
    'ui.158': "The current configuration will be backed up before restore",
    'ui.159': "Latest",
    'ui.160': "Connect a sync channel to view history.",
    'ui.161': "GitHub Gist is configured for “configuration-only sync”; local plugin source is not uploaded. Switch to WebDAV or object storage to restore source across devices.",
    'ui.162': "Local plugin source archive",
    'ui.163': "Refresh status",
    'ui.164': "Remote status",
    'ui.165': "Complete a sync first",
    'ui.166': "Compare the remote snapshot with the local Web Profile",
    'ui.167': "Cloud sync service",
    'ui.168': "Finding this useful or have a suggestion? Open an issue or star the GitHub repository to show your support.",
    'ui.169': "Open GitHub repository",
    'ui.170': "Securely sync configuration, plugins, and data to keep everything consistent.",
    'ui.171': "Cloud sync page",
    'ui.172': "Configuration & history",
    'ui.173': "Cloud sync",
    'ui.174': "Local {{local}} · Cloud {{remote}}",
    'ui.175': "Selected {{selected}} / {{total}} local changes",
    'ui.176': "{{count}} items will affect this device",
    'ui.177': "Current v{{version}}; same-version fix available",
    'ui.178': "Current v{{version}}; update available to v{{release}}",
    'ui.179': "Connecting will disable {{provider}}.",
    'ui.180': "Visit {{provider}} website",
    'ui.181': "This will disconnect {{provider}}; automatic sync will stop. Cloud data will not be deleted.",
    'ui.182': "Smart merge found {{count}} conflicts. Choose which version to keep.",
    'ui.183': "Current channel: {{provider}}",
    'ui.184': "Connect a channel under “Cloud services” first.",
    'ui.185': "{{count}} items cannot be merged automatically",
    'ui.186': "History & restore{{count}}",
    'ui.187': "Read {{count}} history snapshots.",
    'ui.188': "Remote snapshot: {{date}}\nProfile: {{profile}}",
    'ui.189': "Restore applied; fully quit and restart DSH.\nLocal backup: {{backup}}",
    'ui.190': "Rolled back to the history snapshot; restart DSH.\nLocal backup: {{backup}}",
    'ui.191': "Archived {{name}} {{version}}; it will be uploaded on the next sync.",
    'ui.192': "{{name}} installed and enabled, but build scripts for some dependencies are awaiting pnpm approval. Restart DSH to use features that do not depend on them.",
    'ui.193': "{{name}} installed and enabled; restart DSH.",
    'ui.194': "{{name}} uninstalled; restart DSH.",
    'ui.195': "No sync channel enabled.",
    'ui.196': "{{count}} plugins",
    'ui.197': "{{count}} enabled Bundles",
    'ui.198': "Back up source",
    'ui.199': "Refresh history",
    'ui.200': "Apply remote",
    'ui.201': "Restore this version",
    'ui.202': "Refresh",
    'ui.203': "Preview remote",
    'ui.204': "Initialization failed: {{error}}",
    'ui.205': "Operation failed: {{error}}",
    'ui.206': "Cloud sync updated to v{{version}}; fully quit and restart DSH.",
    'ui.207': "Could not read local source: {{sources}}",
    'ui.208': "History retention limit",
    'ui.209': "Save",
    'ui.210': "Saved: keep at most {{count}} history backups; the oldest ones are deleted automatically.",
    'ui.211': "Number of history snapshots kept in the cloud (1-200); older ones are deleted automatically",
    'ui.212': "Allow HTTP (trusted network only)",
    'ui.213': "HTTP sends your credentials in plain text. Enable it only on trusted home or LAN networks; always prefer HTTPS over the public internet.",
    'ui.214': "{{provider}} connected and set as the active sync provider.",
  }
  let locale = key => zh[key] || key
  const interpolate = (value, vars = {}) => String(value).replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] === undefined ? '' : String(vars[key]))
  const t = (key, vars) => interpolate(locale(key), vars)
  function useLocale() {
    const [, redraw] = useState(0)
    useEffect(() => {
      if (typeof document === 'undefined' || typeof MutationObserver === 'undefined') return undefined
      const observer = new MutationObserver(() => redraw(value => value + 1))
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] })
      return () => observer.disconnect()
    }, [])
  }
  const kodoLogo = 'data:image/webp;base64,UklGRiIHAABXRUJQVlA4IBYHAABQJQCdASqvALQAPp1OokwlpKMiIzTqELATiU3cLiYeotewqt73f+n+j5V37n/T/tX5QScvPG8f/YvRV6Cf0h7AH6x9JDzAfuX61/oi/t/+b9gf+idR16AHSxft3wefSH9ReyGRHLDTuHmBpApqXjcfJ/sz7EC5u7u7u7u7u7u7uzb4F/he/T+zMxazgWGWhiAccUTrrW6WCiMKrayqoJs6xMOET599jRwkReDmpR6KTctXRKcI52CiWodKHOTH+nJaZhnLcy6h5UnS+wgO+zIsiCpHYgbYFou0KmRG27ZmL2SqCHYdkq500BJ3o9tshcD32kvRIOmW48c1EXVQpSc3smU6ValFycFMFWSUnU6ok7TPHtVMnVKY+qXEskUoz7RevLWjkXZmZmtl93szMzMzMzEAAP7/O5AAFFtzPc1NI6zrsIwG1a56GiHZrM4eUfc9DLzO5VWCAYcMz90MNn4pNoZUN+l4jEEh8y6zDNWILvPG1gz1rwpfeFdkc+OjrZ/DHKY2AyQZf2boI+6RLP1vCdwfemzHQiQBdl3HySn1uRlexXcBnoYHdAzMKjgybJ7o5szr9Yn3icigr9Oc/4CKGLVEprvujot+49ouq4XZiHz/UitVbqKarorlCfMpbUw8i2oiqKWQP0xsyyCWkeJjdsy3uJko1gYAWSXPJ2xuTkd7Ya1q2OrTL6PUcARhjAuBuKTx6HCdMxTXo/BKVo/lc497z4I1s+IcHnIY9r9KiB3yXjiIj7KA2ifjfm5lpkkX2/hu597eSarSTCFI5G4dBuqaGQlMqoIBackbAC2yyNZ945reP8BCaUHNH+Gc8hvpxE0UJ9+1iUr7ijWeUegaHCjJKJ8j1/E5eOXpFKwgDP6CApRlqus9dhhw2P6MEj8fF5KBJD1A3HL0EP8Tbd/IeFYAXGV4ndjUeBrw4Z8iXNreIQxmhNC0SxezBgl6vrxPsghnEnmawYl8PKlcVoSTzPjfDbixlqNaukT63sMUb0HOZxrjc6a+opzckCuFtrg2mNvPpnCXuBS1+qEHFO/X/2exU7kclKCK128G2ayQv9ecs7Ls9aHHzmp4aN9KJ/VnB5zPGodbZCU+Eq5tqwcyn+QMHN/cfhIS6P50XXiued+D3RYHTDv6IZmwx972+xjVX2rWIcMyBUFpfhnMHGeh2ZiFtcLBU+0TbYj7bWMgJBiriiUHXtu4p1xC8p5HtTdGmYUuYDBmDAwE/sSV+glM6Upks4MbzGyNp7WGJz4bFfXJYwgiEKiHLC8pS9ClbLMJ3pSnUNeDo12Y+gZPAhI6U/BCBx4RLAQjQhlckCIIia/+m/W9fpqMrmlvmd4P9FME/gjkCC0E7mE6SBUBvdx6DHMxcY1KD+u5mB9790JnfDBXyQPuXhNFa5GSPPu8u8y+BBB5rMYlxXuUPpUK3ZqPZ3xB46yCkPvvBIDMOnPkUO5aLbCKNq7jZY65ijPKpzd0WqD2J4Aftms6IXP+VuQrUmcWLcHbzvTstSwmWBDKcKauBq2NVCQC8Q2+YdaZTO4n8FMphcGpGAURXi0EcKaWy8r9zD2O7z9qC6nOEr3JhHKW+Wh0XnFouTxVCMRZoWayyszQb0Fo2LBdV4p3f1CJX1THnDBn4WAhqxH42nzKNY6xIE3pjNXIZk2gI9zha+7rp4UA5zug7VyTWa59iC58LlAK7qk8O4kZwBlazONQFJ/qYeJFQAHrFVrTlBzELAogZtcwUqn2cCdnt4ijh/Bu+BHII+VVS8j2Jitys86kuWNk3d5OIzCnOmTjPAoP+sq68gAqbdoPJ0U2yl53FcqemYzWCEm01+5ZpKAAoY90l1ceqTY+7vLTaR4t3cXkFP0voLPd3Cx0nBr1cEny7EjO9orBufeIuJJ5on0l99HmgZnaQxvkI5hsqR+wn6Kshf8s/LWc4P1KR88l+ohpW+kXSb0Xn8ABrzhtvO2uOqU4hj5er5L2B/4KxlwPKa5O5yiwj796QYNYdZrY8aouoikTrsgr3FL19dZyX3SaSwAFrjWHhb16gXOSaphpdqCywpDGz4c6WcddQL9GqL7iv7Qt2VPjrhiAA9ubBMK/sFdsFTIBSvWNgyYJESf3aSXCijbyiM/Y55+D8SrGtNfqEi8e388wSjKttyuX6taHu8GBHS83Crxtq1v5NdZdUZbhpZ2lemeRabqS2a90Kiak73BR8oKOXifpizCZ2eIXfySoFFDk/JRKYELDEfUCmqyKadoePIEqhJ9JG1WnYForEthW9fk9oDgQSmWJDZCTC+2Aegt7ihzBxAAhvYeOYnPUjrm5aWNV7hWX9CsJu0dkdd5vRbgZ/YbBnrDyJ6QLSb1ml7Y6oEFw1hJZHIQaigvQySA+NRKyTCpUU3wJvcMh3ShGiBF/+y978oy/YUBHrvQ9gAAAAAAAAA=='
  const githubLogo = 'data:image/webp;base64,UklGRnYFAABXRUJQVlA4IGoFAABwJACdASqoALQAPp1KoUulpCchplJ6COATiWlu/HvvPG1z9Ef4btU/z/n2+W8RO+GUdZJ4k9IFjo9CTOa9W+wh5V/sT/c72RP2SKLx3KasblM9++nYGvtuUQbOvBtHpj/KTnUFZ0ILC66S4CMyAQ8LkLvxqW54c1+1J6iwOzy5tGs1dQ4FF3JP3HSiEBO3as4A0zFDoSN8aIDJLEjfptlcIxKxCOiMvUXd1qajZltV7QbrpzOlZ1p03+NUoJrM8odOTWb+xh19o2N0AwOV8OnQYrkwL+AcgoI94hZ5KDkPotygdgPFrjNK2D6J+4j4dR8P/pvjKOnahy/uM8Q6ImihfYgmHvmUqWs9ak4l4MPGL7l/yJHXsvM3qxIAfLPjWUVeFNhjoeI2jn7D2gAA/vlYQLIXGa5xXBGmTLd1vNBvJlNBsoTsOME9QY6GVLdFw0ctNqPlbIBn71nzDNWNCva9Ab4mbmUhD/o3XO4Kn7DP5rUReOHFPab/jyw5VjIouxX4z8dJ3LnQacLqtGjtfvPxq03mkiAg3TkDHIYtOsnBgL60wNtVNrK8ssk1HBGo+5o/cBAoGUz85KVwnNmQJnXk7w1O70QjvrAPMdNnP3PMASm3dj8qaKLrHJc7HstNyUhw84RsPAxAMBO008S8UxxSOyWI0czbYMwJNZl41l86oMlat2hvx9wrxnKzqWI28R/2Klf50EyZTLB8/to2J36ZA9yNBYXaaA+nvVeJBvoHLwyQylsDuj/5DPl8ikHpqYm0TGXOVU2oe7CIIVolggsQWQetePjigIJr1lw5bwoF5WHNuV8sI7+LAWjBDU5lCJWCq7RkWv77WP+0Bdvh/XN+HlybSjuvSwTvR8K/cqwZNrOXtrxrQHKWIedfUuTc8FdFToTBL9+saxXdYvzjrWYtj3TWur9X6m2p8I/z/L6QV37LtUBr+UJTZivouzU5fRgh67K8bhgZ6QwjqZLSGYSIHIdYjwiT3UlPaVfokVtylIWjww+R9HfgKOK7B6cIOVqdzVidbtu84i/MUDvaxXni/Z74sYQ2gp/6Tyi1a5pVr0DcaD7wMLGtH3uGx1qRRcJ3fVCFme+8yuSAUn8vpBXmE4OSD9Pm+33nZJYu5vdTuMg4c1kGMgq3wSF0ew+13nI/pXbRL82QdIr5+NmKW8leikgd+C2eFuT/laPbVjodCN6/7ljEa3agtWhKP3YHX5ubVoOIc97cYp7+qez9Tfm+CXfa18Kb3VwxEiRRy9Q2AOYMSDTxBLFzK0f/TLPiv/EjK0DCG2C4YAj2DZfN/DJpqdlipL7+TYjmhYNYnXN5CvVr6Q+4cuQylu88/6j4aYtOr+yK7l4fDNZCPeJEKQjzxLYSLZuEc8Qu5WWr3Oh1oAbooLhS/C9OHpIzHHXIP8GWII3k7JCOX9Egw6vf8wyPh/uhD+RAHRAmN0C0xKcFk+ba+w9xe9om/yWw0jv5SKp1TYCsJv530Rx+eN4I7ItTkLxMtv+E5SF8j1c+AEjHnHdv5dI+lWC4ixf2I28oZAWWZLh/6BPViFUhm+YmoyEeisuk0CqWDev4NQoChwrSAIyDw0P0L3I51eGRxTX4eCRx4CZQMrg9JbXg3hpQd1eBuWBcJjfBT45MhiJQVlymBUk5WfLeLVAA7J9+mzyVUvAZtjvnq1skiWtQTXW99uurW84KPgaM9U+hIYbEf2YsKzVuUvbYd+kRBtE0dsckQ8wzMeH2Vxyw5cJJkPRnFi+UPD7gWt0Pe07zT9+w1DCdbHHAEcoUEE/Ad7cT97jyRYYNqrEim2asgvBV9CV669wqP0/ln8gXMBiCCGCyj7WzqtZJTjsx4ImQAAA='

  const api = async (path, value = {}) => {
    const response = await fetch(`/api/dsh-cloud-sync/${path}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(value) })
    const body = await response.json()
    if (!body.ok) throw new Error(body.message || `HTTP ${response.status}`)
    return body.value
  }

  const css = `
    .dsh-cloud-sync .result{display:flex;align-items:flex-start;gap:8px;margin-top:14px;padding:10px 12px;border:1px solid #cddaff;border-radius:7px;background:#f7f9ff;color:#53617b;font-size:11px;line-height:18px;white-space:pre-wrap;overflow-wrap:anywhere}.dsh-cloud-sync .resultIcon{display:grid;flex:0 0 16px;place-items:center;width:16px;height:16px;border-radius:50%;background:#dce6ff;color:var(--blue);font-size:10px;font-weight:700}.dsh-cloud-sync .result.error{border-color:#f1c0c8;background:#fff7f8;color:#9a4150}.dsh-cloud-sync .result.error .resultIcon{background:#ffe0e5;color:var(--red)}
    .dsh-cloud-sync{--ink:#202938;--muted:#7c8798;--line:#e7ebf2;--panel:#fff;--blue:#4a6fff;--blue-soft:#f3f6ff;--green:#13a56b;--red:#e55368;box-sizing:border-box;width:min(100%,980px);padding:8px 12px 30px;color:var(--ink);font:13px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI","Microsoft YaHei",sans-serif;background:#fff}
    .dsh-cloud-sync *{box-sizing:border-box}.dsh-cloud-sync button,.dsh-cloud-sync input,.dsh-cloud-sync select{font:inherit}.dsh-cloud-sync button{border:1px solid #dce2ec;border-radius:6px;background:#fff;color:var(--ink);padding:7px 12px;line-height:20px;cursor:pointer;transition:border-color .16s,background .16s,box-shadow .16s,color .16s}.dsh-cloud-sync button:hover:not(:disabled){border-color:#9cb2ff;color:var(--blue);background:#fafbff}.dsh-cloud-sync button:focus-visible,.dsh-cloud-sync input:focus-visible,.dsh-cloud-sync select:focus-visible{outline:3px solid rgba(74,111,255,.18);outline-offset:1px}.dsh-cloud-sync button.primary{border-color:var(--blue);background:var(--blue);color:#fff;box-shadow:0 4px 12px rgba(74,111,255,.18)}.dsh-cloud-sync button.primary:hover:not(:disabled){background:#3d61eb;color:#fff}.dsh-cloud-sync button.danger{border-color:#f2b4bf;color:var(--red)}.dsh-cloud-sync button:disabled{cursor:default;opacity:.45}
    .dsh-cloud-sync .version{display:inline-flex;align-items:center;margin-left:8px;padding:1px 6px;border:1px solid #e4e8ef;border-radius:10px;color:#929baa;font-size:11px;font-weight:500;line-height:16px;vertical-align:middle}.dsh-cloud-sync h2{margin:0;font-size:20px;line-height:28px;font-weight:650;letter-spacing:0}.dsh-cloud-sync h3{margin:0 0 4px;font-size:14px;line-height:20px;font-weight:650}.dsh-cloud-sync .intro,.dsh-cloud-sync .hint{color:var(--muted);font-size:12px;line-height:18px}.dsh-cloud-sync .intro{margin:3px 0 15px}.dsh-cloud-sync .hint{margin:0}.dsh-cloud-sync .notice{margin:0;padding:28px 4px;color:var(--muted);font-size:13px}.dsh-cloud-sync .syncHeader{position:sticky;top:-8px;z-index:5;margin:-8px -12px 0;padding:15px 16px 12px;background:rgba(255,255,255,.97);border-bottom:1px solid #f0f2f6}.dsh-cloud-sync .syncHeader .tabs{margin-bottom:0}
    .dsh-cloud-sync .tabs{display:flex;gap:2px;margin:0 0 18px;padding:3px;border:1px solid #edf0f5;border-radius:7px;background:#f7f8fb}.dsh-cloud-sync .tab{flex:1;border:0;border-radius:5px;background:transparent;color:#4b5565;padding:7px 12px;font-size:12px;line-height:20px}.dsh-cloud-sync .tab[aria-selected="true"]{border:1px solid #b9c9ff;background:#fff;color:var(--blue);box-shadow:0 1px 4px rgba(54,75,130,.08)}
    .dsh-cloud-sync .group{padding:18px 0;border-top:1px solid #edf0f5}.dsh-cloud-sync .group:first-child{border-top:0;padding-top:4px}.dsh-cloud-sync .configToolbar,.dsh-cloud-sync .sectionHead{display:flex;align-items:center;justify-content:space-between;gap:18px}.dsh-cloud-sync .sectionHead{align-items:flex-start}.dsh-cloud-sync .modeField{display:grid;gap:5px;justify-items:end}.dsh-cloud-sync .modeLabel{color:var(--muted);font-size:11px}.dsh-cloud-sync .segments{display:flex;gap:2px;padding:3px;border:1px solid var(--line);border-radius:7px;background:#f8f9fb}.dsh-cloud-sync .segments button{min-width:72px;border:0;padding:5px 9px;background:transparent;color:#687385;font-size:12px;line-height:18px}.dsh-cloud-sync .segments button.active{background:#fff;color:var(--blue);box-shadow:0 1px 4px rgba(54,75,130,.1)}
    .dsh-cloud-sync .providerList{display:grid;gap:9px;margin-top:15px}.dsh-cloud-sync .providerCard{display:grid;grid-template-columns:44px minmax(0,1fr) auto;gap:13px;align-items:center;min-height:70px;padding:12px 13px;border:1px solid var(--line);border-radius:7px;background:var(--panel);transition:border-color .16s,box-shadow .16s}.dsh-cloud-sync .providerCard:hover{border-color:#c8d3ed;box-shadow:0 3px 12px rgba(34,54,98,.05)}.dsh-cloud-sync .providerCard.active{border-color:#a7bbff;background:#fbfcff;box-shadow:0 0 0 1px rgba(74,111,255,.05)}.dsh-cloud-sync .providerMark{display:grid;place-items:center;width:42px;height:42px;border:1px solid #edf0f5;border-radius:8px;background:#fafbfc}.dsh-cloud-sync .providerMark svg{display:block;width:28px;height:28px}.dsh-cloud-sync .providerName{display:flex;align-items:center;gap:8px;font-size:13px;font-weight:650;line-height:20px}.dsh-cloud-sync .providerState{display:block;max-width:100%;margin-top:3px;color:var(--muted);font-size:11px;line-height:17px;overflow-wrap:anywhere}.dsh-cloud-sync .providerActions,.dsh-cloud-sync .serviceActions{display:flex;gap:7px;align-items:center;justify-content:flex-end}.dsh-cloud-sync .providerActions .connect{min-width:92px}.dsh-cloud-sync .dot{display:inline-block;width:7px;height:7px;border-radius:50%;background:#b8c0cd}.dsh-cloud-sync .dot.ok{background:var(--green);box-shadow:0 0 0 3px rgba(19,165,107,.1)}.dsh-cloud-sync .connectedLabel,.dsh-cloud-sync .savedLabel{display:inline-flex;align-items:center;padding:1px 5px;border-radius:4px;background:#eaf9f2;color:#12845b;font-size:10px;font-weight:600;line-height:15px}.dsh-cloud-sync .savedLabel{background:#f3f6ff;color:#536fcf}
    .dsh-cloud-sync .overview{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:14px}.dsh-cloud-sync .metric{min-height:82px;padding:12px 13px;border:1px solid var(--line);border-radius:7px;background:#fff}.dsh-cloud-sync .metricLabel{display:block;color:var(--muted);font-size:11px;line-height:17px}.dsh-cloud-sync .metricValue{display:block;margin-top:3px;font-size:17px;font-weight:700;line-height:24px}.dsh-cloud-sync .metricDetail{display:block;margin-top:2px;color:var(--muted);font-size:10px;line-height:16px}.dsh-cloud-sync .metricValue:has(+ .metricDetail){color:var(--ink)}
    .dsh-cloud-sync .pluginList{display:grid;gap:8px;margin-top:14px}.dsh-cloud-sync .plugin{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:12px;align-items:center;padding:11px 12px;border:1px solid var(--line);border-radius:7px;background:#fff}.dsh-cloud-sync .pluginName{font:650 12px/19px ui-monospace,SFMono-Regular,Consolas,monospace;overflow-wrap:anywhere}.dsh-cloud-sync .pluginMeta{display:flex;flex-wrap:wrap;gap:5px;margin-top:4px;color:var(--muted);font-size:10px;line-height:17px}.dsh-cloud-sync .pill{padding:1px 5px;border-radius:3px;background:#f3f5f8}.dsh-cloud-sync .pill.ok{color:#12845b;background:#eaf9f2}.dsh-cloud-sync .pill.warn{color:#b26a00;background:#fff6e6}.dsh-cloud-sync .empty{margin:0;padding:18px 4px;color:var(--muted);font-size:12px}.dsh-cloud-sync .actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}.dsh-cloud-sync pre{margin:14px 0 0;padding:11px 12px;max-height:180px;overflow:auto;border:1px solid #d9e4ff;border-radius:7px;background:#f6f8ff;color:#53617b;font:11px/18px ui-monospace,SFMono-Regular,Consolas,monospace;white-space:pre-wrap;overflow-wrap:anywhere}.dsh-cloud-sync .service{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:14px;align-items:center;padding:12px 13px;border:1px solid #cddaff;border-radius:7px;background:#f7f9ff}.dsh-cloud-sync .serviceTitle{display:flex;align-items:center;gap:8px;font-size:13px;font-weight:650;line-height:20px}.dsh-cloud-sync .serviceDetail{margin-top:3px;color:var(--muted);font-size:11px;line-height:17px;overflow-wrap:anywhere}
    .dsh-cloud-sync .historyList{display:grid;gap:7px;margin-top:14px}.dsh-cloud-sync .historyRow{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:12px;align-items:center;padding:10px 12px;border:1px solid var(--line);border-radius:7px;background:#fff}.dsh-cloud-sync .historyRow:first-child{border-color:#b7c8ff;background:#fbfcff}.dsh-cloud-sync .historyTime{font-size:12px;font-weight:650;line-height:19px}.dsh-cloud-sync .historyDevice{color:var(--muted);font-size:10px;line-height:16px}.dsh-cloud-sync .sourceTools{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;align-items:end;margin-top:13px}.dsh-cloud-sync label{display:grid;gap:5px;color:#697487;font-size:11px;line-height:17px}.dsh-cloud-sync .wide{grid-column:1/-1}.dsh-cloud-sync input,.dsh-cloud-sync select{min-width:0;width:100%;padding:7px 9px;border:1px solid #dce2ec;border-radius:6px;background:#fff;color:var(--ink);line-height:20px}.dsh-cloud-sync .conflicts{margin-top:14px;padding:12px;border:1px solid #f1d49d;border-radius:7px;background:#fffaf0}.dsh-cloud-sync .conflictList{margin:8px 0 0;padding-left:18px;color:#8c631e;font-size:11px;line-height:18px}.dsh-cloud-sync .warning{color:#b26a00}.dsh-cloud-sync .githubDeviceCode{margin-top:14px;padding:14px;border:1px solid #d9e1f0;border-radius:7px;background:#f7f8fb;text-align:center}.dsh-cloud-sync .githubDeviceCode strong{display:block;margin:10px 0;color:#273247;font:700 24px/32px ui-monospace,SFMono-Regular,Consolas,monospace;letter-spacing:3px}.dsh-cloud-sync .githubDeviceCode .actions{justify-content:center}.dsh-cloud-sync .manualToken{margin-top:16px;color:var(--muted);font-size:11px}.dsh-cloud-sync .manualToken summary{cursor:pointer}.dsh-cloud-sync .manualToken .grid{margin-top:12px}
    .dsh-cloud-sync .modalBack{position:fixed;inset:0;z-index:2147483647;display:grid;place-items:center;padding:20px;background:rgba(24,34,52,.28)}.dsh-cloud-sync .modal{box-sizing:border-box;width:min(460px,100%);max-height:calc(100vh - 40px);overflow:auto;padding:20px;border:1px solid #dfe5ef;border-radius:9px;background:#fff;color:var(--ink);box-shadow:0 18px 50px rgba(25,39,72,.2)}.dsh-cloud-sync .modalHead{display:flex;align-items:start;justify-content:space-between;gap:12px;margin-bottom:18px}.dsh-cloud-sync .modalHead h3{margin:0;font-size:17px;line-height:24px}.dsh-cloud-sync .modalClose{min-width:32px;padding:4px 8px;border:0;color:#8390a2;font-size:18px;line-height:20px}.dsh-cloud-sync .providerHint{margin:0 0 4px;padding:9px 10px;border:1px solid #e5eaff;border-radius:6px;background:#f7f9ff;color:#536fcf;font-size:11px;line-height:17px}.dsh-cloud-sync .check{display:flex;align-items:center;gap:8px;margin-top:12px;color:#697487;font-size:11px;line-height:18px}.dsh-cloud-sync .check input{width:auto;padding:0}.dsh-cloud-sync .modalFooter{display:flex;justify-content:flex-end;gap:8px;margin-top:20px}.dsh-cloud-sync .diffModal{width:min(980px,100%);padding:0;overflow:hidden}.dsh-cloud-sync .diffHead{position:sticky;top:0;z-index:2;padding:18px 20px 14px;border-bottom:1px solid var(--line);background:#fff}.dsh-cloud-sync .diffHead h3{margin:0 0 4px;font-size:17px}.dsh-cloud-sync .diffBody{max-height:calc(100vh - 260px);overflow:auto}.dsh-cloud-sync .diffGrid{display:grid;grid-template-columns:32px 80px minmax(180px,1.2fr) minmax(130px,1fr) minmax(130px,1fr);align-items:start}.dsh-cloud-sync .diffGrid>span{padding:10px 12px;border-bottom:1px solid #edf0f5;font-size:11px;line-height:18px;overflow-wrap:anywhere}.dsh-cloud-sync .diffGrid.head{position:sticky;top:0;z-index:1;background:#f7f8fb}.dsh-cloud-sync .diffGrid.head>span{color:#667286;font-weight:650}.dsh-cloud-sync .diffCheck{display:grid;place-items:center}.dsh-cloud-sync .diffCheck input{width:auto}.dsh-cloud-sync .diffKind{color:var(--blue)}.dsh-cloud-sync .diffFooter{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 20px;border-top:1px solid var(--line);background:#fff}.dsh-cloud-sync .muted{color:var(--muted);font-size:11px;line-height:18px}
    .dsh-cloud-sync .githubConnectModal{width:min(460px,100%);padding:25px 26px 22px}.dsh-cloud-sync .githubAuthHero{text-align:center}.dsh-cloud-sync .githubMark{display:grid;place-items:center;width:64px;height:64px;margin:0 auto 15px;border-radius:50%;background:#24292f}.dsh-cloud-sync .githubMark svg{width:34px;height:34px}.dsh-cloud-sync .githubMark svg path{fill:#fff}.dsh-cloud-sync .githubAuthHero h3{margin:0;font-size:19px;line-height:27px}.dsh-cloud-sync .githubAuthHero .hint{max-width:330px;margin:5px auto 0}.dsh-cloud-sync .githubLimits{margin:19px 0 0;padding:10px 12px;border:1px solid #dfe7ff;border-radius:7px;background:#f7f9ff;color:#536fcf;font-size:11px;line-height:18px;text-align:left}.dsh-cloud-sync .githubAuthorizeStart{display:flex;width:100%;min-height:40px;align-items:center;justify-content:center;margin-top:16px;font-weight:650}.dsh-cloud-sync .githubDeviceCode{margin-top:20px;text-align:center}.dsh-cloud-sync .githubCodeCard{padding:16px;border:1px solid #e2e5ea;border-radius:9px;background:#f0f0f1}.dsh-cloud-sync .githubCodeCard strong{display:block;color:#27303c;font:700 25px/33px ui-monospace,SFMono-Regular,Consolas,monospace;letter-spacing:4px}.dsh-cloud-sync .githubCopyCode{margin-top:10px;border:0!important;background:transparent!important;color:#3d4654!important}.dsh-cloud-sync .githubOpen{display:flex;width:100%;min-height:40px;align-items:center;justify-content:center;margin-top:16px;border-color:#e9c46b!important;background:#efca7d!important;color:#312914!important;font-weight:650}.dsh-cloud-sync .githubOpen:hover:not(:disabled){border-color:#d9ae51!important;background:#e9bc62!important;color:#312914!important}.dsh-cloud-sync .githubWait{display:flex;justify-content:center;align-items:center;gap:7px;margin:15px 0 0;color:var(--muted);font-size:12px}.dsh-cloud-sync .githubWait::before{content:'';width:11px;height:11px;border:2px solid #c8ced8;border-top-color:#66758c;border-radius:50%;animation:dsh-cloud-sync-spin .8s linear infinite}@keyframes dsh-cloud-sync-spin{to{transform:rotate(360deg)}}.dsh-cloud-sync .manualToken{margin-top:17px;padding-top:13px;border-top:1px solid var(--line)}.dsh-cloud-sync .githubTokenFallback{margin-top:18px;padding:11px 12px;border:1px solid #eceff4;border-radius:7px;background:#fafbfc;color:var(--muted);font-size:11px;line-height:18px}
  `

  const layoutCss = `
    .dsh-cloud-sync{width:min(100%,344px);min-height:640px;padding:0;border:1px solid #e8ebf1;border-radius:8px;background:#fff;box-shadow:0 10px 26px rgba(38,53,84,.08);overflow:hidden}.dsh-cloud-sync .syncHeader{position:relative;top:auto;margin:0;padding:15px 12px 11px;border-bottom:1px solid #edf0f5;background:#fff}.dsh-cloud-sync h2{display:flex;align-items:center;font-size:17px;line-height:24px}.dsh-cloud-sync h2::before{content:'☁';margin-right:7px;color:#4a6fff;font-size:21px;line-height:1}.dsh-cloud-sync .version{margin-left:7px;padding:0 5px;font-size:9px;line-height:15px}.dsh-cloud-sync .intro{display:none}.dsh-cloud-sync .tabs{margin:0;padding:3px;border:0;border-radius:7px;background:#f5f6f8}.dsh-cloud-sync .tab{padding:6px 5px;font-size:10px;line-height:18px}.dsh-cloud-sync .tab[aria-selected="true"]{border-color:#c2d0ff;color:#3e64f4}.dsh-cloud-sync [role="tabpanel"]{padding:0 12px 14px}.dsh-cloud-sync .group{padding:16px 0;border-top:0}.dsh-cloud-sync .referenceHero{display:flex;gap:10px;align-items:flex-start;padding:16px 2px 5px}.dsh-cloud-sync .referenceHeroIcon{display:grid;place-items:center;width:26px;height:26px;color:#4a6fff}.dsh-cloud-sync .referenceHeroIcon svg{width:24px;height:24px}.dsh-cloud-sync .referenceHero h3{font-size:16px;line-height:22px}.dsh-cloud-sync .referenceHero .hint{margin-top:2px;font-size:10px}.dsh-cloud-sync .referenceSectionTitle{display:flex;align-items:center;justify-content:space-between;margin-bottom:5px}.dsh-cloud-sync .referenceSectionTitle h3{margin:0;font-size:12px;line-height:18px}.dsh-cloud-sync .referenceSectionTitle .hint{font-size:10px}.dsh-cloud-sync .referenceProviderList{gap:9px;margin-top:8px}.dsh-cloud-sync .providerCard{min-height:62px;padding:10px 11px;border-radius:7px;grid-template-columns:34px minmax(0,1fr) auto;gap:9px}.dsh-cloud-sync .providerCard.active{border-color:#adc1ff;background:#fbfcff}.dsh-cloud-sync .providerMark{width:32px;height:32px;border:0;background:transparent}.dsh-cloud-sync .providerMark svg{width:27px;height:27px}.dsh-cloud-sync .providerName{gap:6px;font-size:11px;line-height:17px}.dsh-cloud-sync .providerState{font-size:9px;line-height:14px}.dsh-cloud-sync .connectedLabel{padding:1px 4px;border-radius:3px;background:#eaf9f2;color:#13a56b;font-size:9px;font-weight:600;line-height:13px}.dsh-cloud-sync .providerChevron{display:grid;place-items:center;width:24px;height:24px;padding:0;border:0;color:#4a6fff;font-size:19px}.dsh-cloud-sync .providerStop{padding:4px 7px;color:#d04c61;font-size:9px;line-height:14px}.dsh-cloud-sync .providerActions{gap:4px}.dsh-cloud-sync .providerActions .connect{min-width:0;padding:5px 8px;color:#4a6fff;font-size:9px;line-height:14px}.dsh-cloud-sync .addProvider{display:grid;place-items:center;width:100%;min-height:47px;margin-top:9px;border:1px dashed #c9d6ff;border-radius:7px;background:#fafcff;color:#4a6fff;font-size:10px;line-height:16px}.dsh-cloud-sync .addProvider strong{font-size:15px;font-weight:500}.dsh-cloud-sync .currentChannel{display:grid;grid-template-columns:34px minmax(0,1fr) auto;gap:9px;align-items:center;margin:14px 0 13px;padding:10px 11px;border:1px solid #e8ebf1;border-radius:7px;background:#fff}.dsh-cloud-sync .currentChannel .providerMark{width:32px;height:32px}.dsh-cloud-sync .currentChannelTitle{font-size:11px;font-weight:650;line-height:17px}.dsh-cloud-sync .currentChannelDetail{margin-top:2px;color:#8b95a5;font-size:9px;line-height:14px;overflow-wrap:anywhere}.dsh-cloud-sync .modeCards{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));margin-top:8px;border:1px solid #e4e8f0;border-radius:7px;overflow:hidden}.dsh-cloud-sync .modeCard{display:grid;justify-items:center;gap:3px;min-height:59px;padding:7px 4px;border:0;border-right:1px solid #e9edf3;border-radius:0;background:#fff;color:#667387;font-size:9px;line-height:13px}.dsh-cloud-sync .modeCard:last-child{border-right:0}.dsh-cloud-sync .modeCard.active{background:#f6f8ff;color:#4567f5;box-shadow:inset 0 0 0 1px #aabfff}.dsh-cloud-sync .modeCard svg{width:17px;height:17px}.dsh-cloud-sync .modeCard strong{font-size:10px;font-weight:650;line-height:14px}.dsh-cloud-sync .syncCta{display:flex;align-items:center;justify-content:center;width:100%;min-height:30px;margin-top:13px;border-radius:5px;font-size:11px;line-height:18px}.dsh-cloud-sync .syncCta svg{width:15px;height:15px;margin-right:6px}.dsh-cloud-sync .historyActions{display:flex;gap:6px}.dsh-cloud-sync .historyActions button{padding:5px 7px;font-size:9px;line-height:14px}.dsh-cloud-sync .historyList{gap:6px;margin-top:9px}.dsh-cloud-sync .historyRow{padding:9px 10px;border-radius:6px}.dsh-cloud-sync .historyTime{font-size:10px;line-height:16px}.dsh-cloud-sync .historyDevice{font-size:9px;line-height:13px}.dsh-cloud-sync .historyRow button{padding:5px 7px;color:#4a6fff;font-size:9px;line-height:14px}.dsh-cloud-sync .latestPill{display:inline-block;margin-left:5px;padding:0 3px;border-radius:3px;background:#eaf9f2;color:#13a56b;font-size:8px;font-weight:600;line-height:13px;vertical-align:middle}.dsh-cloud-sync .auxiliarySource{margin-top:12px;padding-top:11px;border-top:1px dashed #e3e8f0}.dsh-cloud-sync .auxiliarySource summary{color:#6f7c8f;font-size:10px;cursor:pointer}.dsh-cloud-sync .sourceTools{margin-top:9px}.dsh-cloud-sync .overview{gap:8px;margin-top:9px}.dsh-cloud-sync .metric{position:relative;min-height:75px;padding:10px;border-radius:7px}.dsh-cloud-sync .metricIcon{position:absolute;right:10px;bottom:10px;color:#7d63ff}.dsh-cloud-sync .metricIcon.ok{color:#15ad73}.dsh-cloud-sync .metricIcon svg{width:18px;height:18px}.dsh-cloud-sync .metricLabel{font-size:9px;line-height:14px}.dsh-cloud-sync .metricValue{margin-top:2px;font-size:16px;line-height:22px}.dsh-cloud-sync .metricDetail{font-size:9px;line-height:14px}.dsh-cloud-sync .pluginList{gap:8px;margin-top:9px}.dsh-cloud-sync .plugin{gap:8px;padding:9px 10px;border-radius:6px}.dsh-cloud-sync .pluginName{font-size:10px;line-height:16px}.dsh-cloud-sync .pluginMeta{margin-top:2px;font-size:8px;line-height:13px}.dsh-cloud-sync .pill{padding:0 4px;font-size:8px;line-height:13px}.dsh-cloud-sync .plugin button{padding:5px 7px;font-size:9px;line-height:14px}.dsh-cloud-sync .refreshButton{display:flex;align-items:center;gap:4px;padding:5px 7px;font-size:9px;line-height:14px}.dsh-cloud-sync .refreshButton svg{width:12px;height:12px}.dsh-cloud-sync .result{margin-top:0;border-right:0;border-bottom:0;border-left:0;border-radius:0;font-size:9px;line-height:15px}.dsh-cloud-sync .modal{border-radius:8px}.dsh-cloud-sync .diffModal{width:min(940px,100%)}
    .dsh-cloud-sync{width:100%;max-width:960px;min-height:0;margin:0 auto}.dsh-cloud-sync .syncHeader{padding:18px 20px 14px}.dsh-cloud-sync h2{font-size:20px;line-height:28px}.dsh-cloud-sync h2::before{font-size:24px}.dsh-cloud-sync .version{padding:1px 6px;font-size:10px;line-height:16px}.dsh-cloud-sync .tabs{padding:4px}.dsh-cloud-sync .tab{padding:8px 10px;font-size:12px;line-height:20px}.dsh-cloud-sync [role="tabpanel"]{padding:0 20px 22px}.dsh-cloud-sync .referenceHero{padding:21px 2px 10px}.dsh-cloud-sync .referenceHeroIcon{width:32px;height:32px}.dsh-cloud-sync .referenceHeroIcon svg{width:29px;height:29px}.dsh-cloud-sync .referenceHero h3{font-size:17px;line-height:24px}.dsh-cloud-sync .referenceHero .hint,.dsh-cloud-sync .referenceSectionTitle .hint{font-size:12px;line-height:18px}.dsh-cloud-sync .group{padding:20px 0}.dsh-cloud-sync .referenceSectionTitle h3{font-size:14px;line-height:20px}.dsh-cloud-sync .referenceProviderList{gap:10px;margin-top:12px}.dsh-cloud-sync .providerCard{min-height:74px;padding:13px 14px;grid-template-columns:44px minmax(0,1fr) auto;gap:13px}.dsh-cloud-sync .providerMark{width:42px;height:42px}.dsh-cloud-sync .providerMark svg{width:31px;height:31px}.dsh-cloud-sync .providerName{font-size:13px;line-height:20px}.dsh-cloud-sync .providerState{font-size:11px;line-height:17px}.dsh-cloud-sync .connectedLabel{font-size:10px;line-height:15px}.dsh-cloud-sync .providerActions .connect,.dsh-cloud-sync .providerStop{padding:6px 10px;font-size:11px;line-height:16px}.dsh-cloud-sync .addProvider{min-height:55px;font-size:12px}.dsh-cloud-sync .currentChannel{grid-template-columns:44px minmax(0,1fr) auto;gap:13px;margin:18px 0 16px;padding:13px 14px}.dsh-cloud-sync .currentChannel .providerMark{width:42px;height:42px}.dsh-cloud-sync .currentChannelTitle{font-size:13px;line-height:20px}.dsh-cloud-sync .currentChannelDetail{font-size:11px;line-height:17px}.dsh-cloud-sync .modeCards{margin-top:12px}.dsh-cloud-sync .modeCard{min-height:82px;padding:11px 6px;font-size:10px;line-height:15px}.dsh-cloud-sync .modeCard svg{width:20px;height:20px}.dsh-cloud-sync .modeCard strong{font-size:12px;line-height:17px}.dsh-cloud-sync .syncCta{min-height:38px;margin-top:16px;font-size:13px;line-height:20px}.dsh-cloud-sync .historyActions button{padding:6px 9px;font-size:11px;line-height:16px}.dsh-cloud-sync .historyList{gap:8px;margin-top:12px}.dsh-cloud-sync .historyRow{padding:12px 13px}.dsh-cloud-sync .historyTime{font-size:12px;line-height:19px}.dsh-cloud-sync .historyDevice{font-size:10px;line-height:16px}.dsh-cloud-sync .historyRow button{padding:6px 9px;font-size:11px;line-height:16px}.dsh-cloud-sync .overview{gap:12px;margin-top:14px}.dsh-cloud-sync .metric{min-height:98px;padding:14px}.dsh-cloud-sync .metricLabel{font-size:11px;line-height:17px}.dsh-cloud-sync .metricValue{font-size:19px;line-height:27px}.dsh-cloud-sync .metricDetail{font-size:10px;line-height:16px}.dsh-cloud-sync .pluginList{gap:10px;margin-top:12px}.dsh-cloud-sync .plugin{padding:12px 13px}.dsh-cloud-sync .pluginName{font-size:12px;line-height:19px}.dsh-cloud-sync .pluginMeta{font-size:10px;line-height:16px}.dsh-cloud-sync .pill{font-size:9px;line-height:14px}.dsh-cloud-sync .plugin button,.dsh-cloud-sync .refreshButton{padding:6px 9px;font-size:11px;line-height:16px}.dsh-cloud-sync .result{font-size:11px;line-height:18px}
    @media(max-width:620px){.dsh-cloud-sync{padding-right:8px;padding-left:8px}.dsh-cloud-sync .syncHeader{margin-right:-8px;margin-left:-8px;padding-right:12px;padding-left:12px}.dsh-cloud-sync .grid,.dsh-cloud-sync .overview{grid-template-columns:1fr}.dsh-cloud-sync .wide{grid-column:auto}.dsh-cloud-sync .configToolbar,.dsh-cloud-sync .sectionHead{align-items:stretch;flex-direction:column}.dsh-cloud-sync .modeField{justify-items:start}.dsh-cloud-sync .segments{width:100%}.dsh-cloud-sync .segments button{flex:1;min-width:0}.dsh-cloud-sync .providerCard{grid-template-columns:40px minmax(0,1fr);gap:10px}.dsh-cloud-sync .providerMark{width:40px;height:40px}.dsh-cloud-sync .providerActions{grid-column:2;justify-content:flex-start;flex-wrap:wrap}.dsh-cloud-sync .sourceTools{grid-template-columns:1fr}.dsh-cloud-sync .sourceTools .actions{justify-content:flex-start}.dsh-cloud-sync .plugin{grid-template-columns:1fr}.dsh-cloud-sync .plugin button{justify-self:start}.dsh-cloud-sync .service{grid-template-columns:1fr}.dsh-cloud-sync .serviceActions{justify-content:flex-start}.dsh-cloud-sync .historyRow{grid-template-columns:1fr}.dsh-cloud-sync .historyRow button{justify-self:start}.dsh-cloud-sync .diffModal{max-height:calc(100vh - 24px)}.dsh-cloud-sync .diffGrid{grid-template-columns:28px 58px minmax(130px,1fr) 0 0}.dsh-cloud-sync .diffGrid>span:nth-child(4),.dsh-cloud-sync .diffGrid>span:nth-child(5){display:none}.dsh-cloud-sync .diffFooter{align-items:flex-start;flex-direction:column}}
    .dsh-cloud-sync{--dsh-surface:#fff;--dsh-card:#fff;--dsh-subtle:#f5f6f8;--dsh-border:#e7ebf2;--dsh-text:#202938;--dsh-muted:#7c8798;--dsh-active:#f6f8ff;--dsh-active-line:#adc1ff;--dsh-input:#fff;--dsh-notice:#f7f9ff;--dsh-notice-line:#cddaff;background:var(--dsh-surface);border-color:var(--dsh-border);color:var(--dsh-text)}.dsh-cloud-sync .syncHeader,.dsh-cloud-sync .metric,.dsh-cloud-sync .plugin,.dsh-cloud-sync .historyRow,.dsh-cloud-sync .currentChannel,.dsh-cloud-sync .providerCard,.dsh-cloud-sync .modal,.dsh-cloud-sync .diffHead,.dsh-cloud-sync .diffFooter{background:var(--dsh-card);border-color:var(--dsh-border);color:var(--dsh-text)}.dsh-cloud-sync button:not(.primary),.dsh-cloud-sync input,.dsh-cloud-sync select{background:var(--dsh-input);border-color:var(--dsh-border);color:var(--dsh-text)}.dsh-cloud-sync .tabs,.dsh-cloud-sync .segments,.dsh-cloud-sync .diffGrid.head{background:var(--dsh-subtle);border-color:var(--dsh-border)}.dsh-cloud-sync .tab{color:var(--dsh-muted)}.dsh-cloud-sync .tab[aria-selected="true"],.dsh-cloud-sync .segments button.active{background:var(--dsh-card)}.dsh-cloud-sync .providerCard.active,.dsh-cloud-sync .modeCard.active,.dsh-cloud-sync .historyRow:first-child{background:var(--dsh-active);border-color:var(--dsh-active-line)}.dsh-cloud-sync .modeCards,.dsh-cloud-sync .modeCard{border-color:var(--dsh-border);background:var(--dsh-card)}.dsh-cloud-sync .referenceSectionTitle .hint,.dsh-cloud-sync .referenceHero .hint,.dsh-cloud-sync .providerState,.dsh-cloud-sync .currentChannelDetail,.dsh-cloud-sync .historyDevice,.dsh-cloud-sync .metricDetail,.dsh-cloud-sync .pluginMeta,.dsh-cloud-sync label,.dsh-cloud-sync .muted{color:var(--dsh-muted)}.dsh-cloud-sync .service,.dsh-cloud-sync .result{background:var(--dsh-notice);border-color:var(--dsh-notice-line)}.dsh-cloud-sync pre{background:var(--dsh-subtle);border-color:var(--dsh-border);color:var(--dsh-text)}
    @media(prefers-color-scheme:dark){.dsh-cloud-sync{--dsh-surface:#1b222d;--dsh-card:#242d3a;--dsh-subtle:#1a202a;--dsh-border:#3a4658;--dsh-text:#edf2fb;--dsh-muted:#a2aec0;--dsh-active:#202d49;--dsh-active-line:#6685ff;--dsh-input:#1d2530;--dsh-notice:#202b42;--dsh-notice-line:#3d5483;--ink:#edf2fb;--muted:#a2aec0;--line:#3a4658;--panel:#242d3a}.dsh-cloud-sync .providerMark{background:#2b3544}.dsh-cloud-sync .pill{background:#303b4b}.dsh-cloud-sync .pill.ok{background:#173e35;color:#58d6a1}.dsh-cloud-sync .pill.warn{background:#493619;color:#f6c76b}.dsh-cloud-sync .connectedLabel{background:#173e35;color:#58d6a1}.dsh-cloud-sync .result.error{background:#44252e;border-color:#7a3d4c;color:#ffc1cc}.dsh-cloud-sync .resultIcon{background:#32456f;color:#b8c8ff}.dsh-cloud-sync .result.error .resultIcon{background:#6a3341;color:#ffd4dc}.dsh-cloud-sync .conflicts{background:#3d321d;border-color:#73592d}.dsh-cloud-sync .modalBack{background:rgba(0,0,0,.55)}.dsh-cloud-sync .modalClose{color:#b9c3d3}.dsh-cloud-sync .addProvider{background:#202938;border-color:#506ba8}.dsh-cloud-sync button:hover:not(:disabled){background:#303a4b}}
    :is(html.dark,html[data-theme="dark"],body.dark,body[data-theme="dark"],.dark,.theme-dark,.semi-always-dark) .dsh-cloud-sync{--dsh-surface:#1b222d;--dsh-card:#242d3a;--dsh-subtle:#1a202a;--dsh-border:#3a4658;--dsh-text:#edf2fb;--dsh-muted:#a2aec0;--dsh-active:#202d49;--dsh-active-line:#6685ff;--dsh-input:#1d2530;--dsh-notice:#202b42;--dsh-notice-line:#3d5483;--ink:#edf2fb;--muted:#a2aec0;--line:#3a4658;--panel:#242d3a}:is(html.dark,html[data-theme="dark"],body.dark,body[data-theme="dark"],.dark,.theme-dark,.semi-always-dark) .dsh-cloud-sync .providerMark{background:#2b3544}:is(html.dark,html[data-theme="dark"],body.dark,body[data-theme="dark"],.dark,.theme-dark,.semi-always-dark) .dsh-cloud-sync .pill{background:#303b4b}:is(html.dark,html[data-theme="dark"],body.dark,body[data-theme="dark"],.dark,.theme-dark,.semi-always-dark) .dsh-cloud-sync .pill.ok{background:#173e35;color:#58d6a1}:is(html.dark,html[data-theme="dark"],body.dark,body[data-theme="dark"],.dark,.theme-dark,.semi-always-dark) .dsh-cloud-sync .pill.warn{background:#493619;color:#f6c76b}:is(html.dark,html[data-theme="dark"],body.dark,body[data-theme="dark"],.dark,.theme-dark,.semi-always-dark) .dsh-cloud-sync .connectedLabel{background:#173e35;color:#58d6a1}:is(html.dark,html[data-theme="dark"],body.dark,body[data-theme="dark"],.dark,.theme-dark,.semi-always-dark) .dsh-cloud-sync .result.error{background:#44252e;border-color:#7a3d4c;color:#ffc1cc}:is(html.dark,html[data-theme="dark"],body.dark,body[data-theme="dark"],.dark,.theme-dark,.semi-always-dark) .dsh-cloud-sync .resultIcon{background:#32456f;color:#b8c8ff}:is(html.dark,html[data-theme="dark"],body.dark,body[data-theme="dark"],.dark,.theme-dark,.semi-always-dark) .dsh-cloud-sync .result.error .resultIcon{background:#6a3341;color:#ffd4dc}:is(html.dark,html[data-theme="dark"],body.dark,body[data-theme="dark"],.dark,.theme-dark,.semi-always-dark) .dsh-cloud-sync .conflicts{background:#3d321d;border-color:#73592d}:is(html.dark,html[data-theme="dark"],body.dark,body[data-theme="dark"],.dark,.theme-dark,.semi-always-dark) .dsh-cloud-sync .modalBack{background:rgba(0,0,0,.55)}:is(html.dark,html[data-theme="dark"],body.dark,body[data-theme="dark"],.dark,.theme-dark,.semi-always-dark) .dsh-cloud-sync .modalClose{color:#b9c3d3}:is(html.dark,html[data-theme="dark"],body.dark,body[data-theme="dark"],.dark,.theme-dark,.semi-always-dark) .dsh-cloud-sync button:hover:not(:disabled){background:#303a4b}
  `

  const overridesCss = `
    .dsh-cloud-sync .syncTitleRow{display:flex;align-items:center;gap:8px}.dsh-cloud-sync .syncTitleRow>svg{flex:0 0 28px;width:28px;height:28px;color:var(--blue)}.dsh-cloud-sync .syncTitleRow h2{display:flex;align-items:center;margin:0}.dsh-cloud-sync .syncTitleRow h2::before{content:none}.dsh-cloud-sync .syncTitleRow .version{margin-left:8px}.dsh-cloud-sync .intro{display:block;margin:2px 0 12px;padding-left:36px}.dsh-cloud-sync .providerGroup{padding-top:18px}
    body[data-ds-dark-theme] .dsh-cloud-sync{color-scheme:dark;--dsh-surface:#202124;--dsh-card:#292b2f;--dsh-subtle:#222428;--dsh-border:#3c4046;--dsh-text:#f1f3f4;--dsh-muted:#aeb4bd;--dsh-active:#263656;--dsh-active-line:#7394ff;--dsh-input:#24262a;--dsh-notice:#27334a;--dsh-notice-line:#435b8e;--ink:#f1f3f4;--muted:#aeb4bd;--line:#3c4046;--panel:#292b2f;background:var(--dsh-surface);border-color:var(--dsh-border);box-shadow:0 10px 26px rgba(0,0,0,.24)}
    body[data-ds-dark-theme] .dsh-cloud-sync .providerMark{background:#34373c}body[data-ds-dark-theme] .dsh-cloud-sync .modeCard{color:#c3c8d0}body[data-ds-dark-theme] .dsh-cloud-sync .currentChannelDetail,body[data-ds-dark-theme] .dsh-cloud-sync .auxiliarySource summary{color:var(--dsh-muted)}body[data-ds-dark-theme] .dsh-cloud-sync .pill{background:#3a3d43}body[data-ds-dark-theme] .dsh-cloud-sync .pill.ok,body[data-ds-dark-theme] .dsh-cloud-sync .connectedLabel{background:#153d31;color:#72d9ae}body[data-ds-dark-theme] .dsh-cloud-sync .pill.warn{background:#503b1a;color:#ffd277}body[data-ds-dark-theme] .dsh-cloud-sync .result.error{background:#482a31;border-color:#824552;color:#ffd0d7}body[data-ds-dark-theme] .dsh-cloud-sync .resultIcon{background:#354d7e;color:#c5d2ff}body[data-ds-dark-theme] .dsh-cloud-sync .result.error .resultIcon{background:#743846;color:#ffe0e5}body[data-ds-dark-theme] .dsh-cloud-sync .conflicts{background:#40331d;border-color:#775d2e}body[data-ds-dark-theme] .dsh-cloud-sync .modalBack{background:rgba(0,0,0,.6)}body[data-ds-dark-theme] .dsh-cloud-sync .modalClose{color:#c2c8d2}body[data-ds-dark-theme] .dsh-cloud-sync .diffGrid>span{border-color:var(--dsh-border)}body[data-ds-dark-theme] .dsh-cloud-sync button:hover:not(:disabled){background:#383b41}
  `

  const systemCss = `
    .dsh-cloud-sync{--ink:var(--dsw-alias-label-primary);--muted:var(--dsw-alias-label-tertiary);--line:var(--dsw-alias-border-l2);--panel:var(--dsw-alias-bg-layer-1);--blue:var(--dsw-alias-brand-primary);--blue-soft:var(--dsw-alias-interactive-bg-hover);--green:var(--dsw-alias-state-success-primary);--red:var(--dsw-alias-state-error-primary);--dsh-surface:transparent;--dsh-card:var(--dsw-alias-bg-layer-1);--dsh-subtle:var(--dsw-alias-bg-module-platform);--dsh-border:var(--dsw-alias-border-l2);--dsh-text:var(--dsw-alias-label-primary);--dsh-muted:var(--dsw-alias-label-tertiary);--dsh-active:var(--dsw-alias-bg-module-platform);--dsh-active-line:var(--dsw-alias-brand-primary);--dsh-input:var(--dsw-alias-bg-layer-1);--dsh-notice:var(--dsw-alias-bg-module-platform);--dsh-notice-line:var(--dsw-alias-border-l2);width:100%;max-width:720px;min-height:0;margin:0;color:var(--dsw-alias-label-primary);font-family:var(--dsw-font-family);background:transparent;border:0;border-radius:0;box-shadow:none;overflow:visible}
    .dsh-cloud-sync .syncHeader{position:static;margin:0;padding:0 0 16px;background:transparent;border:0}.dsh-cloud-sync .syncTitleRow{display:flex;align-items:center;gap:8px}.dsh-cloud-sync .syncTitleRow>svg{width:24px;height:24px;flex:0 0 24px;color:var(--dsw-alias-brand-primary)}.dsh-cloud-sync .syncTitleRow h2{display:flex;align-items:center;color:var(--dsw-alias-label-primary);font-size:16px;font-weight:500;line-height:24px}.dsh-cloud-sync .syncTitleRow h2::before{content:none}.dsh-cloud-sync .version{border-color:var(--dsw-alias-border-l3);background:var(--dsw-alias-bg-module-platform);color:var(--dsw-alias-label-secondary);border-radius:10px;font-size:11px;line-height:16px}.dsh-cloud-sync .intro{display:block;color:var(--dsw-alias-label-tertiary);margin:5px 0 0;padding-left:32px;font-size:12px;line-height:18px}
    .dsh-cloud-sync .tabs{position:sticky;top:0;z-index:8;display:flex;gap:3px;margin:0;padding:3px;border:1px solid var(--dsw-alias-border-l2);border-radius:10px;background:var(--dsw-alias-bg-module-platform)}.dsh-cloud-sync .tab{flex:1;color:var(--dsw-alias-label-tertiary);border:1px solid transparent;border-radius:7px;background:transparent;padding:7px 10px;font-size:13px;line-height:20px}.dsh-cloud-sync .tab:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.dsh-cloud-sync .tab[aria-selected="true"]{border:1px solid var(--dsw-alias-border-l3);background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-brand-primary);box-shadow:none}.dsh-cloud-sync [role="tabpanel"]{padding:0}.dsh-cloud-sync .group{padding:16px 0;border:0}.dsh-cloud-sync .group+.group{border-top:1px solid var(--dsw-alias-border-l2)}.dsh-cloud-sync .providerGroup{padding-top:16px}
    .dsh-cloud-sync button{height:32px;color:var(--dsw-alias-label-secondary);border-color:var(--dsw-alias-border-l2);border-radius:14px;background:transparent;padding:0 12px;font-size:13px;line-height:20px}.dsh-cloud-sync button:hover:not(:disabled){border-color:var(--dsw-alias-border-l3);background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.dsh-cloud-sync button.primary{border:0;background:var(--dsw-alias-button-primary-fill);color:var(--dsw-alias-label-primary-foreground);box-shadow:none}.dsh-cloud-sync button.primary:hover:not(:disabled){background:var(--dsw-alias-button-primary-hover);color:var(--dsw-alias-label-primary-foreground)}.dsh-cloud-sync button.danger,.dsh-cloud-sync .providerStop{border-color:transparent;background:transparent;color:var(--dsw-alias-state-error-primary)}.dsh-cloud-sync button.danger:hover:not(:disabled),.dsh-cloud-sync .providerStop:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover-danger);color:var(--dsw-alias-state-error-primary)}.dsh-cloud-sync button:focus-visible,.dsh-cloud-sync input:focus-visible,.dsh-cloud-sync select:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:1px}
    .dsh-cloud-sync .providerList{gap:8px;margin-top:0}.dsh-cloud-sync .providerCard,.dsh-cloud-sync .currentChannel,.dsh-cloud-sync .metric,.dsh-cloud-sync .plugin,.dsh-cloud-sync .historyRow{border-color:var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);border-radius:12px;box-shadow:none}.dsh-cloud-sync .providerCard{min-height:72px;padding:12px 14px}.dsh-cloud-sync .providerCard:hover{border-color:var(--dsw-alias-border-l3);box-shadow:none}.dsh-cloud-sync .providerCard.active,.dsh-cloud-sync .historyRow:first-child{border-color:var(--dsw-alias-brand-primary);background:var(--dsw-alias-bg-module-platform);box-shadow:none}.dsh-cloud-sync .providerMark{background:transparent}.dsh-cloud-sync .providerName,.dsh-cloud-sync .currentChannelTitle,.dsh-cloud-sync .historyTime{color:var(--dsw-alias-label-primary);font-weight:500}.dsh-cloud-sync .providerState,.dsh-cloud-sync .currentChannelDetail,.dsh-cloud-sync .historyDevice,.dsh-cloud-sync .metricDetail,.dsh-cloud-sync .pluginMeta{color:var(--dsw-alias-label-tertiary)}.dsh-cloud-sync .connectedLabel,.dsh-cloud-sync .pill.ok,.dsh-cloud-sync .latestPill{background:var(--dsw-alias-state-success-tertiary);color:var(--dsw-alias-state-success-primary)}.dsh-cloud-sync .providerChevron{width:28px;height:28px;color:var(--dsw-alias-label-tertiary);border:0;background:transparent}.dsh-cloud-sync .providerChevron:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.dsh-cloud-sync .providerActions .connect{min-width:0}
    .dsh-cloud-sync .modeCards{gap:8px;margin-top:12px;border:0;border-radius:0;overflow:visible;background:transparent}.dsh-cloud-sync .modeCard{min-height:82px;color:var(--dsw-alias-label-secondary);border:1px solid var(--dsw-alias-border-l2);border-radius:12px;background:var(--dsw-alias-bg-layer-1)}.dsh-cloud-sync .modeCard:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.dsh-cloud-sync .modeCard.active{border-color:var(--dsw-alias-brand-primary);background:var(--dsw-alias-bg-module-platform);color:var(--dsw-alias-brand-primary);box-shadow:none}.dsh-cloud-sync .currentChannel{margin:16px 0;padding:12px 14px}.dsh-cloud-sync .metric{min-height:96px;padding:14px}.dsh-cloud-sync .metricLabel{color:var(--dsw-alias-label-tertiary)}.dsh-cloud-sync .metricValue,.dsh-cloud-sync .pluginName{color:var(--dsw-alias-label-primary)}.dsh-cloud-sync .pill{background:var(--dsw-alias-bg-module-platform);color:var(--dsw-alias-label-secondary)}.dsh-cloud-sync .pill.warn{background:var(--dsw-alias-state-warn-tertiary);color:var(--dsw-alias-state-warn-label)}
    .dsh-cloud-sync .historyRow,.dsh-cloud-sync .plugin{padding:12px 14px}.dsh-cloud-sync .auxiliarySource{border-color:var(--dsw-alias-border-l2)}.dsh-cloud-sync .auxiliarySource summary,.dsh-cloud-sync label,.dsh-cloud-sync .muted{color:var(--dsw-alias-label-secondary)}.dsh-cloud-sync input,.dsh-cloud-sync select{height:34px;color:var(--dsw-alias-label-primary);border-color:var(--dsw-alias-border-l2);border-radius:8px;background:var(--dsw-alias-bg-layer-1)}.dsh-cloud-sync input::placeholder{color:var(--dsw-alias-label-tertiary)}.dsh-cloud-sync .service,.dsh-cloud-sync .result{border-color:var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-module-platform);color:var(--dsw-alias-label-secondary);border-radius:12px}.dsh-cloud-sync .resultIcon{background:var(--dsw-alias-button-ghost-active-fill);color:var(--dsw-alias-brand-primary)}.dsh-cloud-sync .result.error{border-color:var(--dsw-alias-state-error-primary);background:var(--dsw-alias-interactive-bg-hover-danger);color:var(--dsw-alias-state-error-primary)}.dsh-cloud-sync .result.error .resultIcon{background:transparent;color:var(--dsw-alias-state-error-primary)}.dsh-cloud-sync .conflicts{border-color:var(--dsw-alias-state-warn-primary);background:var(--dsw-alias-state-warn-tertiary);color:var(--dsw-alias-state-warn-label)}
    .dsh-cloud-sync .modal{border-color:var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);border-radius:12px;box-shadow:var(--dsw-shadow-lv2)}.dsh-cloud-sync .modalBack{background:var(--dsw-alias-bg-mask-1);backdrop-filter:blur(4px)}.dsh-cloud-sync .diffHead,.dsh-cloud-sync .diffFooter{border-color:var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-base)}.dsh-cloud-sync .diffGrid.head{background:var(--dsw-alias-bg-module-platform)}.dsh-cloud-sync .diffGrid>span{border-color:var(--dsw-alias-border-l2)}.dsh-cloud-sync pre{border-color:var(--dsw-alias-border-l2);background:var(--dsw-alias-markdown-code-block);color:var(--dsw-alias-label-secondary)}
  `

  function Field({ label, wide = false, children }) { return h('label', { className: wide ? 'wide' : undefined }, label, children) }
  function Result({ value }) {
    if (value === '' || value === undefined || value === null) return null
    const error = typeof value === 'object' && value.error === true
    const message = typeof value === 'object' ? value.message : value
    return h('div', { className: `result ${error ? 'error' : ''}`, role: 'status', 'aria-live': 'polite' }, h('span', { className: 'resultIcon', 'aria-hidden': 'true' }, error ? '!' : '✓'), h('span', null, message))
  }

  function DiffDialog({ changes, selectedItems, setSelectedItems, strategy, onClose, onSync, busy }) {
    const selected = new Set(selectedItems)
    const selectAll = value => setSelectedItems(value ? changes.map(item => item.id) : [])
    const toggle = item => setSelectedItems(current => selected.has(item.id) ? current.filter(id => id !== item.id) : [...current, item.id])
    const impact = item => {
      if (strategy === 'cloud') return item.remote === undefined ? t('ui.2') : item.local === undefined ? t('ui.3') : t('ui.4')
      if (item.local === undefined) return t('ui.5')
      if (item.remote === undefined) return selected.has(item.id) ? t('ui.6') : t('ui.7')
      return selected.has(item.id) ? t('ui.8') : t('ui.9')
    }
    const title = strategy === 'cloud' ? t('ui.10') : t('ui.11')
    const hint = strategy === 'cloud' ? t('ui.12') : t('ui.13')
    return h('div', { className: 'modalBack', onMouseDown: onClose }, h('section', { className: 'modal diffModal', role: 'dialog', 'aria-modal': 'true', 'aria-label': t('ui.14'), onMouseDown: event => event.stopPropagation() },
      h('div', { className: 'diffHead' }, h('div', { className: 'modalHead' }, h('div', null, h('h3', null, title), h('p', { className: 'hint' }, hint)), h('button', { className: 'modalClose', onClick: onClose, 'aria-label': t('ui.15') }, '×')), strategy === 'smart' ? h('div', { className: 'actions' }, h('button', { disabled: busy !== '', onClick: () => selectAll(true) }, t('ui.16')), h('button', { disabled: busy !== '', onClick: () => selectAll(false) }, t('ui.17'))) : null),
      h('div', { className: 'diffBody' }, h('div', { className: 'diffGrid head' }, h('span', null), h('span', null, t('ui.18')), h('span', null, t('ui.19')), h('span', null, t('ui.20')), h('span', null, t('ui.21'))), changes.map(item => h('div', { className: 'diffGrid', key: item.id }, h('span', { className: 'diffCheck' }, strategy === 'smart' ? h('input', { type: 'checkbox', checked: selected.has(item.id), onChange: () => toggle(item) }) : null), h('span', { className: 'diffKind' }, item.kind === 'plugin' ? t('ui.22') : t('ui.23')), h('span', null, `${item.profile} / ${item.name}`), h('span', null, t('ui.174', { local: item.local || t('ui.141'), remote: item.remote || t('ui.141') })), h('span', null, impact(item))))),
      h('div', { className: 'diffFooter' }, h('span', { className: 'muted' }, strategy === 'smart' ? t('ui.175', { selected: selectedItems.length, total: changes.length }) : t('ui.176', { count: changes.length })), h('div', { className: 'serviceActions' }, h('button', { disabled: busy !== '', onClick: onClose }, t('ui.24')), h('button', { className: 'primary', disabled: busy !== '' || (strategy === 'smart' && changes.length > 0 && selectedItems.length === 0), onClick: onSync }, strategy === 'cloud' ? t('ui.25') : t('ui.26'))))
    ))
  }

  function ReleaseUpdateNotice({ run, busy, setResult }) {
    const [update, setUpdate] = useState()
    useEffect(() => { api('release/check').then(setUpdate).catch(() => setUpdate({ available: false })) }, [])
    if (update === undefined || !update.available || update.release === undefined) return null
    const install = run('self-update', async () => {
      const value = await api('release/update')
      setUpdate(value)
      return value.updated ? t('ui.206', { version: value.release.version }) : t('ui.27')
    })
    return h('div', { className: 'service updateNotice' }, h('div', null,
      h('div', { className: 'serviceTitle' }, t('ui.28')),
      h('div', { className: 'serviceDetail' }, update.sameVersionRevision ? t('ui.177', { version: update.localVersion }) : t('ui.178', { version: update.localVersion, release: update.release.version }))
    ), h('div', { className: 'serviceActions' }, h('button', { className: 'primary', disabled: busy !== '', onClick: install }, busy === 'self-update' ? t('ui.29') : t('ui.30'))))
  }

  const providerLabels = { webdav: 'WebDAV', s3: 'Amazon S3', oss: 'ui.31', cos: 'ui.32', minio: 'MinIO', kodo: 'ui.33', gist: 'GitHub Gist' }
  const providerLabel = type => {
    const value = providerLabels[type]
    return value && value.startsWith('ui.') ? t(value) : value || t('ui.74')
  }
  const providerDefaults = {
    s3: { endpoint: 'https://s3.amazonaws.com', region: 'us-east-1' },
    oss: { endpoint: 'https://oss-cn-hangzhou.aliyuncs.com', region: 'cn-hangzhou' },
    cos: { endpoint: 'https://cos.ap-guangzhou.myqcloud.com', region: 'ap-guangzhou' },
    minio: { endpoint: 'http://127.0.0.1:9000', region: 'us-east-1' },
    kodo: { endpoint: 'https://s3.cn-east-1.qiniucs.com', region: 'cn-east-1' },
  }
  const providerHints = {
    webdav: 'ui.34',
    s3: 'ui.35',
    oss: 'ui.36',
    cos: 'ui.37',
    minio: 'ui.38',
    kodo: 'ui.39',
    gist: 'ui.40',
  }
  const providerHint = type => t(providerHints[type] || 'ui.74')
  const objectProviderTypes = ['s3', 'oss', 'cos', 'minio', 'kodo']
  // 快捷跳转到各云服务官网/控制台。WebDAV 是协议而非单一云服务，无固定控制台地址。
  const providerLinks = {
    s3: { label: 'ui.41', url: 'https://console.aws.amazon.com/s3/' },
    oss: { label: 'ui.42', url: 'https://oss.console.aliyun.com/' },
    cos: { label: 'ui.43', url: 'https://console.cloud.tencent.com/cos' },
    minio: { label: 'ui.44', url: 'https://min.io/' },
    kodo: { label: 'ui.45', url: 'https://portal.qiniu.com/kodo/bucket' },
    gist: { label: 'ui.46', url: 'https://github.com/' },
  }
  const providerLink = type => {
    const link = providerLinks[type]
    return link ? { ...link, label: t(link.label) } : undefined
  }
  const providerTypes = Object.keys(providerLabels)
  const providerIsConfigured = provider => provider?.type === 'webdav' ? Boolean(provider.url) : provider?.type === 'gist' ? Boolean(provider.gistId) : objectProviderTypes.includes(provider?.type) && Boolean(provider.endpoint) && Boolean(provider.bucket)
  const providerHasSavedConfig = provider => provider?.type === 'webdav' ? Boolean(provider.url) : provider?.type === 'gist' ? Boolean(provider.gistId) : objectProviderTypes.includes(provider?.type) && Boolean(provider.endpoint) && Boolean(provider.bucket)

  function ProviderLogo({ type }) {
    const svg = { viewBox: '0 0 24 24', role: 'img', 'aria-label': providerLabel(type) }
    if (type === 'webdav') return h('svg', svg, h('rect', { x: 3, y: 4, width: 18, height: 6, rx: 1.5, fill: 'none', stroke: '#68737d', 'stroke-width': 1.7 }), h('rect', { x: 3, y: 14, width: 18, height: 6, rx: 1.5, fill: 'none', stroke: '#68737d', 'stroke-width': 1.7 }), h('circle', { cx: 7, cy: 7, r: 1, fill: '#68737d' }), h('circle', { cx: 7, cy: 17, r: 1, fill: '#68737d' }))
    if (type === 's3') return h('svg', svg, h('path', { d: 'M5 5.5c0-1.4 3.1-2.5 7-2.5s7 1.1 7 2.5v13c0 1.4-3.1 2.5-7 2.5s-7-1.1-7-2.5z', fill: '#f5a800' }), h('path', { d: 'M5 5.5c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5M5 11.9c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5', fill: 'none', stroke: '#fff', 'stroke-width': 1.2 }))
    if (type === 'oss') return h('svg', svg, h('path', { d: 'M4 4.5h6l-1.4 2L4.2 7.7A1.7 1.7 0 0 0 3 9.3v5.4c0 .8.5 1.4 1.2 1.7l4.4 1.3 1.4 1.8H4a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3ZM20 4.5h-6l1.4 2 4.4 1.2c.7.3 1.2.9 1.2 1.6v5.4c0 .8-.5 1.4-1.2 1.7l-4.4 1.3-1.4 1.8h6a3 3 0 0 0 3-3V7.5a3 3 0 0 0-3-3ZM8 10.6h8v2H8z', fill: '#ff6a00' }))
    if (type === 'cos') return h('svg', svg, h('path', { d: 'M7.2 18.5h10.4a4.1 4.1 0 0 0 .7-8.1A6.3 6.3 0 0 0 6 8.8a4.9 4.9 0 0 0 1.2 9.7Z', fill: 'none', stroke: '#1677ff', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }), h('circle', { cx: 8, cy: 16, r: 1.2, fill: '#1677ff' }))
    if (type === 'kodo') return h('img', { src: kodoLogo, alt: providerLabel(type) })
    if (type === 'gist') return h('img', { src: githubLogo, alt: providerLabel(type) })
    return h('svg', svg, h('path', { d: 'M13.2.3a2 2 0 0 0-1.5.6 2.2 2.2 0 0 0-.1 3.1l3.4 3.5a3 3 0 0 1-.7 4.7l-.5.2V7.3a15.4 15.4 0 0 0-8 10.5l6.5-3.3v7.6l1.4 1.9V13.7l.9-.5a4.4 4.4 0 0 0 1.2-7l-3.4-3.6a.75.75 0 0 1 1.1-1l.5.5 4.1 4.2.1-.1-3.1-5.1-.2.1.2-.1A3.2 3.2 0 0 0 13.2.3Z', fill: '#c72e49' }))
  }

  function GitHubGistDialog({ settings, busy, onClose, onConnected, run }) {
    const initial = settings.provider?.type === 'gist' ? settings.provider : settings.savedProviders?.gist ?? {}
    const [authorization, setAuthorization] = useState()
    const [authorizationStatus, setAuthorizationStatus] = useState('')
    const [deviceAuthorizationAvailable, setDeviceAuthorizationAvailable] = useState(null)
    const [token, setToken] = useState('')
    const [gistId, setGistId] = useState(initial.gistId || '')
    const [showToken, setShowToken] = useState(false)
    useEffect(() => { api('github/device/status').then(value => setDeviceAuthorizationAvailable(value.configured === true)).catch(() => setDeviceAuthorizationAvailable(false)) }, [])
    useEffect(() => {
      if (authorization?.requestId === undefined) return undefined
      let stopped = false
      let timer
      const poll = async () => {
        try {
          const value = await api('github/device/poll', { requestId: authorization.requestId })
          if (stopped) return
          if (value.status === 'connected') { onConnected(value.settings); onClose(); return }
          timer = setTimeout(poll, Math.max(5, value.intervalSeconds || authorization.intervalSeconds) * 1000)
        } catch (error) { if (!stopped) setAuthorizationStatus(t('ui.205', { error: error.message })) }
      }
      timer = setTimeout(poll, Math.max(1, authorization.intervalSeconds || 5) * 1000)
      return () => { stopped = true; clearTimeout(timer) }
    }, [authorization?.requestId])
    const startAuthorization = run('github-device-start', async () => {
      const value = await api('github/device/start')
      setAuthorization(value)
      setAuthorizationStatus(t('ui.47'))
      try { await navigator.clipboard?.writeText(value.userCode) } catch {}
      if (value.verificationUriComplete) window.open(value.verificationUriComplete, '_blank', 'noopener,noreferrer')
      return ''
    })
    const connectWithToken = run('github-token-connect', async () => {
      const value = await api('provider/connect', { provider: { type: 'gist', gistId, token } })
      onConnected(value); onClose(); return t('ui.48')
    })
    return h('div', { className: 'modalBack', onMouseDown: onClose }, h('section', { className: 'modal githubConnectModal', role: 'dialog', 'aria-modal': 'true', 'aria-label': t('ui.49'), onMouseDown: event => event.stopPropagation() },
      h('button', { className: 'modalClose', onClick: onClose, 'aria-label': t('ui.15') }, '×'),
      h('div', { className: 'githubAuthHero' }, h('div', { className: 'githubMark' }, h(ProviderLogo, { type: 'gist' })), h('h3', null, t('ui.50')), h('p', { className: 'hint' }, authorization === undefined ? t('ui.51') : t('ui.52')), h('a', { className: 'providerLink githubJump', href: 'https://github.com/', target: '_blank', rel: 'noopener noreferrer' }, h('svg', { viewBox: '0 0 24 24', 'aria-hidden': 'true' }, h('path', { d: 'M14 4h6v6M20 4l-9 9M19 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5' })), t('ui.53'))),
      authorization === undefined && deviceAuthorizationAvailable === true ? h('button', { className: 'primary githubAuthorizeStart', disabled: busy !== '', onClick: startAuthorization }, busy === 'github-device-start' ? t('ui.54') : t('ui.55')) : null,
      authorization === undefined && deviceAuthorizationAvailable === false ? h('div', { className: 'githubTokenFallback' }, t('ui.56')) : null,
      authorization === undefined && deviceAuthorizationAvailable === null ? h('p', { className: 'githubWait' }, t('ui.57')) : null,
      authorization === undefined ? h('p', { className: 'githubLimits' }, t('ui.58')) : h('div', { className: 'githubDeviceCode' },
        h('div', { className: 'githubCodeCard' }, h('strong', null, authorization.userCode), h('button', { className: 'githubCopyCode', disabled: busy !== '', onClick: async () => { try { await navigator.clipboard?.writeText(authorization.userCode); setAuthorizationStatus(t('ui.59')) } catch { setAuthorizationStatus(t('ui.60')) } } }, t('ui.61'))),
        h('button', { className: 'githubOpen', disabled: busy !== '', onClick: () => window.open(authorization.verificationUriComplete || authorization.verificationUri, '_blank', 'noopener,noreferrer') }, t('ui.62')),
        h('p', { className: 'githubWait' }, authorizationStatus || t('ui.63'))
      ),
      h('details', { className: 'manualToken', open: deviceAuthorizationAvailable === false }, h('summary', null, t('ui.64')),
        h('div', { className: 'grid' },
          h(Field, { label: t('ui.65'), wide: true }, h('input', { value: gistId, onChange: event => setGistId(event.target.value), placeholder: t('ui.66') })),
          h(Field, { label: t('ui.67'), wide: true }, h('input', { type: showToken ? 'text' : 'password', value: token, onChange: event => setToken(event.target.value), placeholder: initial.secretStored ? t('ui.68') : 'ghp_...' }))
        ),
        h('label', { className: 'check' }, h('input', { type: 'checkbox', checked: showToken, onChange: event => setShowToken(event.target.checked) }), t('ui.69')),
        h('div', { className: 'modalFooter' }, h('button', { disabled: busy !== '', onClick: connectWithToken }, busy === 'github-token-connect' ? t('ui.70') : t('ui.71')))
      ),
      h('div', { className: 'modalFooter' }, h('button', { disabled: busy !== '', onClick: onClose }, t('ui.24')))
    ))
  }

  function ProviderDialog({ settings, type, busy, onClose, onConnected, run }) {
    if (type === 'gist') return h(GitHubGistDialog, { settings, busy, onClose, onConnected, run })
    const initial = settings.provider?.type === type ? settings.provider : settings.savedProviders?.[type] ?? {}
    const [url, setUrl] = useState(initial.url || 'https://dav.example.invalid/dav/DSH-Sync')
    const [allowInsecure, setAllowInsecure] = useState(initial.allowInsecure === true)
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
      const provider = type === 'webdav' ? { type, url, username, password, allowInsecure } : { type, endpoint, region, bucket, prefix, accessKeyId, secretAccessKey }
      const value = await api('provider/connect', { provider })
      onConnected(value); onClose(); return t('ui.214', { provider: providerLabel(type) })
    })
    const storedSecret = settings.provider?.type === type && (settings.provider?.password === '<stored-locally>' || settings.provider?.secretAccessKey === '<stored-locally>') || settings.savedProviders?.[type]?.secretStored === true
    const dialogHint = settings.provider?.type === type ? t('ui.72') : settings.savedProviders?.[type] ? t('ui.73') : t('ui.179', { provider: providerLabel(settings.provider?.type) || t('ui.74') })
    return h('div', { className: 'modalBack', onMouseDown: onClose }, h('section', { className: 'modal', role: 'dialog', 'aria-modal': 'true', 'aria-label': t('ui.75'), onMouseDown: event => event.stopPropagation() },
      h('div', { className: 'modalHead' }, h('div', null, h('h3', null, providerLabel(type)), h('p', { className: 'hint' }, dialogHint)), h('div', { className: 'modalHeadActions' }, providerLinks[type] ? h('a', { className: 'providerLink', href: providerLink(type).url, target: '_blank', rel: 'noopener noreferrer', title: t('ui.180', { provider: providerLabel(type) }) }, h('svg', { viewBox: '0 0 24 24', 'aria-hidden': 'true' }, h('path', { d: 'M14 4h6v6M20 4l-9 9M19 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5' })), providerLink(type).label) : null, h('button', { className: 'modalClose', onClick: onClose, 'aria-label': t('ui.15') }, '×'))),
      h('div', { className: 'grid' },
        h('p', { className: 'providerHint wide' }, providerHint(type)),
        type === 'webdav' ? h(React.Fragment, null,
          h(Field, { label: t('ui.76'), wide: true }, h('input', { value: url, onChange: event => setUrl(event.target.value), placeholder: 'https://dav.example.invalid/dav/DSH-Sync' })),
          h(Field, { label: t('ui.77'), wide: true }, h('input', { value: username, onChange: event => setUsername(event.target.value), placeholder: t('ui.78') })),
          h(Field, { label: t('ui.79'), wide: true }, h('input', { type: showSecret ? 'text' : 'password', value: password, onChange: event => setPassword(event.target.value), placeholder: storedSecret ? t('ui.68') : t('ui.80') })),
          h('label', { className: 'check wide' }, h('input', { type: 'checkbox', checked: allowInsecure, onChange: event => setAllowInsecure(event.target.checked) }), t('ui.212')),
          allowInsecure ? h('p', { className: 'providerHint warning wide' }, t('ui.213')) : null
        ) : h(React.Fragment, null,
          h(Field, { label: 'Endpoint', wide: true }, h('input', { value: endpoint, onChange: event => setEndpoint(event.target.value), placeholder: providerDefaults[type].endpoint })),
          h(Field, { label: 'Region' }, h('input', { value: region, onChange: event => setRegion(event.target.value), placeholder: providerDefaults[type].region })),
          h(Field, { label: 'Bucket' }, h('input', { value: bucket, onChange: event => setBucket(event.target.value), placeholder: type === 'cos' ? 'bucket-appid' : 'bucket-name' })),
          h(Field, { label: t('ui.81'), wide: true }, h('input', { value: prefix, onChange: event => setPrefix(event.target.value), placeholder: 'DSH-Sync' })),
          h(Field, { label: 'Access Key ID', wide: true }, h('input', { value: accessKeyId, onChange: event => setAccessKeyId(event.target.value), placeholder: 'Access Key ID' })),
          h(Field, { label: 'Secret Access Key', wide: true }, h('input', { type: showSecret ? 'text' : 'password', value: secretAccessKey, onChange: event => setSecretAccessKey(event.target.value), placeholder: storedSecret ? t('ui.68') : t('ui.80') }))
        )
      ),
      h('label', { className: 'check' }, h('input', { type: 'checkbox', checked: showSecret, onChange: event => setShowSecret(event.target.checked) }), t('ui.82')),
      h('div', { className: 'modalFooter' }, h('button', { disabled: busy !== '', onClick: onClose }, t('ui.24')), h('button', { className: 'primary', disabled: busy !== '', onClick: connect }, busy === 'connect' ? t('ui.70') : t('ui.83')))
    ))
  }

  function DisableProviderDialog({ type, busy, onClose, onConfirm }) {
    return h('div', { className: 'modalBack', onMouseDown: onClose },
      h('section', { className: 'modal disableProviderModal', role: 'dialog', 'aria-modal': 'true', 'aria-label': t('ui.84'), onMouseDown: event => event.stopPropagation() },
        h('div', { className: 'modalHead' }, h('div', null, h('h3', null, t('ui.85')), h('p', { className: 'hint' }, t('ui.181', { provider: providerLabel(type) }))), h('button', { className: 'modalClose', disabled: busy !== '', onClick: onClose, 'aria-label': t('ui.15') }, '×')),
        h('div', { className: 'modalFooter' }, h('button', { disabled: busy !== '', onClick: onClose }, t('ui.24')), h('button', { className: 'danger', disabled: busy !== '', onClick: onConfirm }, busy === 'cancel-provider' ? t('ui.86') : t('ui.87')))
      )
    )
  }

  function LegacyServicesTab({ run, busy, setResult }) {
    const [settings, setSettings] = useState()
    const [editingProvider, setEditingProvider] = useState()
    useEffect(() => { api('settings/get').then(setSettings).catch(error => setResult({ error: true, message: t('ui.204', { error: error.message }) })) }, [])
    const configured = providerIsConfigured(settings?.provider)
    if (settings === undefined) return h('p', { className: 'notice' }, t('ui.88'))
    const cancelProvider = run('cancel-provider', async () => { const value = await api('settings/clear-provider'); setSettings(value); return t('ui.89') })
    const providerDetail = type => {
      if (settings.provider?.type !== type || !configured) return providerHasSavedConfig(settings.savedProviders?.[type]) ? t('ui.90') : t('ui.91')
      if (type === 'webdav') return `${settings.provider.username || t('ui.92')} · ${settings.provider.url}`
      return `${settings.provider.bucket} · ${settings.provider.endpoint}${settings.provider.prefix ? `/${settings.provider.prefix}` : ''}`
    }
    return h(React.Fragment, null,
      h('section', { className: 'group' },
        h('div', { className: 'configToolbar' }, h('div', null, h('h3', null, t('ui.93')), h('p', { className: 'hint' }, t('ui.94')))),
        h('div', { className: 'providerList' }, providerTypes.map(type => {
          const active = configured && settings.provider.type === type
          const saved = !active && providerHasSavedConfig(settings.savedProviders?.[type])
          return h('div', { className: `providerCard ${active ? 'active' : ''}`, key: type },
            h('div', { className: 'providerMark' }, h(ProviderLogo, { type })),
            h('div', null, h('div', { className: 'providerName' }, providerLabel(type), active ? h('span', { className: 'connectedLabel' }, t('ui.95')) : saved ? h('span', { className: 'savedLabel' }, t('ui.96')) : h('span', { className: 'dot' })), h('div', { className: 'providerState' }, providerDetail(type))),
            h('div', { className: 'providerActions' }, active ? h(React.Fragment, null, h('button', { disabled: busy !== '', onClick: () => setEditingProvider(type) }, t('ui.97')), h('button', { className: 'danger', disabled: busy !== '', onClick: cancelProvider }, t('ui.98'))) : h('button', { className: 'connect', disabled: busy !== '', onClick: () => setEditingProvider(type) }, saved ? t('ui.99') : t('ui.100')))
          )
        }))
      ),
      editingProvider ? h(ProviderDialog, { settings, type: editingProvider, busy, onClose: () => setEditingProvider(undefined), onConnected: setSettings, run }) : null,
    )
  }

  function LegacyConfigurationHistoryTab({ run, busy, setResult }) {
    const [settings, setSettings] = useState()
    const [strategy, setStrategy] = useState('smart')
    const [conflicts, setConflicts] = useState([])
    const [changes, setChanges] = useState([])
    const [selectedItems, setSelectedItems] = useState([])
    const [diffOpen, setDiffOpen] = useState(false)
    const [history, setHistory] = useState([])
    const [source, setSource] = useState('')
    useEffect(() => { api('settings/get').then(value => { setSettings(value); setStrategy(value.syncPolicy || 'smart'); if (providerIsConfigured(value.provider)) api('snapshot/history').then(setHistory).catch(() => {}) }).catch(error => setResult({ error: true, message: t('ui.204', { error: error.message }) })) }, [])
    const configured = providerIsConfigured(settings?.provider)
    const refreshChanges = async () => { const value = await api('snapshot/diff'); setChanges(value.items); setSelectedItems(value.items.map(item => item.id)); return value }
    const refreshHistory = async () => { const value = await api('snapshot/history'); setHistory(value); return value }
    if (settings === undefined) return h('p', { className: 'notice' }, t('ui.101'))
    const sync = (resolveConflicts, all = false) => run('sync', async () => {
      const value = await api('snapshot/push', { strategy, resolveConflicts, selectedItems: all ? undefined : selectedItems })
      if (value.direction === 'needs-choice') { setConflicts(value.conflicts); return t('ui.182', { count: value.conflicts.length }) }
      setConflicts([]); await refreshChanges(); await refreshHistory().catch(() => {})
      const sourceWarning = value.missingLocalSources?.length ? `\n${t('ui.207', { sources: value.missingLocalSources.join(', ') })}` : ''
      const build = value.direction === 'downloaded' ? t('ui.102') : value.direction === 'merged' ? t('ui.103') : t('ui.104')
      return `${build}: ${new Date(value.createdAt).toLocaleString()}${sourceWarning}`
    })
    const beginSync = strategy === 'local' ? sync(undefined, true) : run('prepare-sync', async () => { const value = await refreshChanges(); setDiffOpen(true); return value.items.length === 0 ? t('ui.105') : '' })
    return h(React.Fragment, null,
      h('section', { className: 'group' }, h('div', { className: 'configToolbar' }, h('div', null, h('h3', null, t('ui.106')), h('p', { className: 'hint' }, configured ? t('ui.183', { provider: providerLabel(settings.provider.type) }) : t('ui.184'))), configured ? h('div', { className: 'modeField' }, h('span', { className: 'modeLabel' }, t('ui.107')), h('div', { className: 'segments', role: 'group', 'aria-label': t('ui.107') }, [['smart', t('ui.108'), t('ui.109')], ['cloud', t('ui.110'), t('ui.111')], ['local', t('ui.112'), t('ui.113')]].map(([value, label, title]) => h('button', { key: value, className: strategy === value ? 'active' : '', title, 'aria-pressed': strategy === value, onClick: () => { setStrategy(value); setConflicts([]); setChanges([]) } }, label)))) : null), configured ? h('div', { className: 'actions' }, h('button', { className: 'primary', disabled: busy !== '', onClick: beginSync }, busy === 'sync' || busy === 'prepare-sync' ? t('ui.114') : t('ui.115'))) : null, conflicts.length ? h('div', { className: 'conflicts' }, h('strong', null, t('ui.185', { count: conflicts.length })), h('p', { className: 'hint' }, t('ui.116')), h('div', { className: 'actions' }, h('button', { disabled: busy !== '', onClick: sync('cloud') }, t('ui.117')), h('button', { disabled: busy !== '', onClick: sync('local') }, t('ui.118')))) : null),
      h('section', { className: 'group' }, h('div', { className: 'sectionHead' }, h('div', null, h('h3', null, t('ui.186', { count: history.length ? ` (${history.length})` : '' })), h('p', { className: 'hint' }, t('ui.119'))), h('div', { className: 'serviceActions' }, h('button', { disabled: busy !== '' || !configured, onClick: run('history', async () => { const value = await refreshHistory(); return t('ui.187', { count: value.length }) }) }, t('ui.199')), h('button', { disabled: busy !== '' || !configured, onClick: run('preview', async () => { const value = await api('snapshot/pull'); return t('ui.188', { date: value.createdAt, profile: value.plan?.map(item => item.name).join(', ') || t('ui.120') }) }) }, t('ui.121')), h('button', { className: 'danger', disabled: busy !== '' || !configured, onClick: run('restore', async () => { const value = await api('snapshot/pull', { apply: true }); return t('ui.189', { backup: value.backup }) }) }, t('ui.200')))), history.length ? h('div', { className: 'historyList' }, history.slice(0, 8).map(entry => h('div', { className: 'historyRow', key: entry.key }, h('div', null, h('div', { className: 'historyTime' }, new Date(entry.createdAt).toLocaleString()), h('div', { className: 'historyDevice' }, entry.deviceName || entry.deviceId || t('ui.122'))), h('button', { disabled: busy !== '', onClick: run(`rollback:${entry.key}`, async () => { const value = await api('snapshot/pull', { apply: true, snapshotKey: entry.key }); return t('ui.190', { backup: value.backup }) }) }, t('ui.201'))))) : h('p', { className: 'empty' }, configured ? t('ui.123') : t('ui.124'))),
      h('section', { className: 'group' }, h('div', { className: 'sectionHead' }, h('div', null, h('h3', null, t('ui.125')), h('p', { className: 'hint' }, t('ui.126')))), h('div', { className: 'sourceTools' }, h(Field, { label: t('ui.127'), wide: true }, h('input', { value: source, onChange: event => setSource(event.target.value), placeholder: 'E:\\dsh-plugin' })), h('div', { className: 'actions' }, h('button', { className: 'primary', disabled: busy !== '' || source.trim() === '', onClick: run('backup', async () => { const value = await api('source/backup', { directory: source }); return t('ui.191', { name: value.name, version: value.version }) }) }, t('ui.198'))))),
      diffOpen ? h(DiffDialog, { changes, selectedItems, setSelectedItems, strategy, busy, onClose: () => setDiffOpen(false), onSync: () => { setDiffOpen(false); (strategy === 'cloud' ? sync(undefined, true) : sync())() } }) : null
    )
  }

  function LegacyStatusTab({ run, busy, setResult }) {
    const [inventory, setInventory] = useState()
    const [settings, setSettings] = useState()
    const refresh = async () => {
      const [value, currentSettings] = await Promise.all([api('inventory'), api('settings/get')])
      setInventory(value); setSettings(currentSettings)
      return value
    }
    useEffect(() => { refresh().catch(error => setResult({ error: true, message: t('ui.204', { error: error.message }) })) }, [])
    const install = plugin => run(`install:${plugin.name}`, async () => { const value = await api('plugin/install-configured', { packageName: plugin.name }); await refresh(); return value.buildApprovalRequired ? t('ui.192', { name: plugin.name }) : t('ui.193', { name: plugin.name }) })
    const uninstall = plugin => run(`uninstall:${plugin.name}`, async () => { await api('plugin/uninstall', { packageName: plugin.name }); await refresh(); return t('ui.194', { name: plugin.name }) })
    if (inventory === undefined || settings === undefined) return h('p', { className: 'notice' }, t('ui.128'))
    const remote = inventory.remote
    const configured = providerIsConfigured(settings.provider)
    return h(React.Fragment, null,
      h('section', { className: 'group' }, h('div', { className: 'sectionHead' }, h('div', null, h('h3', null, t('ui.129')), h('p', { className: 'hint' }, configured ? t('ui.183', { provider: providerLabel(settings.provider.type) }) : t('ui.195'))), h('button', { disabled: busy !== '', onClick: run('refresh', refresh) }, busy === 'refresh' ? t('ui.130') : t('ui.131'))), h('div', { className: 'overview' }, h('div', { className: 'metric' }, h('span', { className: 'metricLabel' }, t('ui.132')), h('span', { className: 'metricValue' }, remote.available ? t('ui.133') : t('ui.134')), h('span', { className: 'metricDetail' }, remote.available ? new Date(remote.createdAt).toLocaleString() : remote.error || t('ui.135'))), h('div', { className: 'metric' }, h('span', { className: 'metricLabel' }, t('ui.136')), h('span', { className: 'metricValue' }, t('ui.196', { count: inventory.local.dependencies })), h('span', { className: 'metricDetail' }, t('ui.197', { count: inventory.local.bundles }))))),
      h('section', { className: 'group' }, h('div', { className: 'sectionHead' }, h('div', null, h('h3', null, t('ui.137')), h('p', { className: 'hint' }, t('ui.138')))), h('div', { className: 'pluginList' }, inventory.plugins.length === 0 ? h('p', { className: 'empty' }, t('ui.139')) : inventory.plugins.map(plugin => h('div', { className: 'plugin', key: plugin.name }, h('div', null, h('div', { className: 'pluginName' }, plugin.name), h('div', { className: 'pluginMeta' }, h('span', { className: `pill ${plugin.installed ? 'ok' : 'warn'}` }, plugin.installed ? t('ui.140') : t('ui.141')), plugin.enabled ? h('span', { className: 'pill ok' }, t('ui.142')) : null, plugin.localSource ? h('span', { className: `pill ${plugin.sourceArchived ? '' : 'warn'}` }, plugin.sourceArchived ? t('ui.143') : t('ui.144')) : null, h('span', null, plugin.requested))), plugin.name === '@dickpy/dsh-cloud-sync' ? h('button', { disabled: true }, t('ui.145')) : plugin.installed ? h('button', { className: 'danger', disabled: busy !== '', onClick: uninstall(plugin) }, t('ui.146')) : h('button', { className: 'primary', disabled: busy !== '' || !plugin.configuredInRemote || (plugin.localSource && !plugin.sourceArchived), onClick: install(plugin) }, plugin.localSource && !plugin.sourceArchived ? t('ui.147') : t('ui.148'))))))
    )
  }

  function UiIcon({ name }) {
    const props = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 1.8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'aria-hidden': 'true' }
    if (name === 'cloud') return h('svg', props, h('path', { d: 'M7.1 18.3h10.3a4.2 4.2 0 0 0 .7-8.3A6.3 6.3 0 0 0 6 8.7a4.8 4.8 0 0 0 1.1 9.6Z' }))
    if (name === 'server') return h('svg', props, h('rect', { x: 3, y: 4, width: 18, height: 6, rx: 1.5 }), h('rect', { x: 3, y: 14, width: 18, height: 6, rx: 1.5 }), h('path', { d: 'M7 7h.01M7 17h.01' }))
    if (name === 'sync') return h('svg', props, h('path', { d: 'M20 7v5h-5M4 17v-5h5' }), h('path', { d: 'M6.1 9A7 7 0 0 1 18.7 7M17.9 15A7 7 0 0 1 5.3 17' }))
    if (name === 'desktop') return h('svg', props, h('rect', { x: 3, y: 4, width: 18, height: 12, rx: 1.5 }), h('path', { d: 'M8 20h8M12 16v4' }))
    if (name === 'cube') return h('svg', props, h('path', { d: 'm12 3 7 4v10l-7 4-7-4V7l7-4Z' }), h('path', { d: 'm5 7 7 4 7-4M12 11v10' }))
    if (name === 'check') return h('svg', props, h('circle', { cx: 12, cy: 12, r: 8 }), h('path', { d: 'm8.7 12 2.2 2.2 4.5-4.7' }))
    if (name === 'chevron') return h('svg', props, h('path', { d: 'm9 6 6 6-6 6' }))
    return h('svg', props, h('path', { d: 'M4 12a8 8 0 1 0 2.3-5.7' }), h('path', { d: 'M4 4v5h5' }))
  }

  function ServicesTab({ run, busy, setResult }) {
    const [settings, setSettings] = useState()
    const [editingProvider, setEditingProvider] = useState()
    const [confirmingDisable, setConfirmingDisable] = useState(false)
    useEffect(() => { api('settings/get').then(setSettings).catch(error => setResult({ error: true, message: t('ui.204', { error: error.message }) })) }, [])
    if (settings === undefined) return h('p', { className: 'notice' }, t('ui.88'))
    const configured = providerIsConfigured(settings.provider)
    const cancelProvider = run('cancel-provider', async () => { const value = await api('settings/clear-provider'); setSettings(value); return t('ui.89') })
    const detail = type => {
      if (settings.provider?.type !== type || !configured) return providerHasSavedConfig(settings.savedProviders?.[type]) ? t('ui.149') : t('ui.134')
      if (type === 'webdav') return `${settings.provider.username || t('ui.92')} · ${settings.provider.url}`
      if (type === 'gist') return `Secret Gist · ${settings.provider.gistId}`
      return `${settings.provider.bucket} · ${settings.provider.endpoint}${settings.provider.prefix ? `/${settings.provider.prefix}` : ''}`
    }
    return h(React.Fragment, null,
      h('section', { className: 'group providerGroup' },
        h('div', { className: 'providerList referenceProviderList' }, providerTypes.map(type => {
          const active = configured && settings.provider.type === type
          const saved = !active && providerHasSavedConfig(settings.savedProviders?.[type])
          return h('div', { className: `providerCard ${active ? 'active' : ''}`, key: type },
            h('div', { className: 'providerMark' }, h(ProviderLogo, { type })),
            h('div', null, h('div', { className: 'providerName' }, providerLabel(type), active ? h('span', { className: 'connectedLabel' }, t('ui.95')) : saved ? h('span', { className: 'savedLabel' }, t('ui.96')) : h('span', { className: 'dot' })), h('div', { className: 'providerState' }, detail(type))),
            active ? h('div', { className: 'providerActions' }, h('button', { className: 'providerChevron', disabled: busy !== '', title: t('ui.150'), 'aria-label': t('ui.150'), onClick: () => setEditingProvider(type) }, h(UiIcon, { name: 'chevron' })), h('button', { className: 'providerStop', disabled: busy !== '', onClick: () => setConfirmingDisable(true) }, t('ui.98'))) : h('button', { className: 'connect', disabled: busy !== '', onClick: () => setEditingProvider(type) }, saved ? t('ui.99') : t('ui.100'))
          )
        })),
      ),
      editingProvider ? h(ProviderDialog, { settings, type: editingProvider, busy, onClose: () => setEditingProvider(undefined), onConnected: setSettings, run }) : null,
      confirmingDisable ? h(DisableProviderDialog, { type: settings.provider.type, busy, onClose: () => setConfirmingDisable(false), onConfirm: () => { setConfirmingDisable(false); cancelProvider()() } }) : null
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
    const [limitInput, setLimitInput] = useState('')
    useEffect(() => { api('settings/get').then(value => { setSettings(value); setStrategy(value.syncPolicy || 'smart'); setLimitInput(String(value.historyLimit ?? 30)); if (providerIsConfigured(value.provider)) api('snapshot/history').then(setHistory).catch(() => {}) }).catch(error => setResult({ error: true, message: t('ui.204', { error: error.message }) })) }, [])
    if (settings === undefined) return h('p', { className: 'notice' }, t('ui.101'))
    const configured = providerIsConfigured(settings.provider)
    const limit = Number(limitInput)
    const limitValid = Number.isInteger(limit) && limit >= 1 && limit <= 200
    const saveLimit = () => run('history-limit', async () => {
      const value = await api('settings/preferences', { historyLimit: Number(limitInput) })
      setSettings(previous => ({ ...previous, historyLimit: value.historyLimit }))
      setLimitInput(String(value.historyLimit))
      await refreshHistory().catch(() => {})
      return t('ui.210', { count: value.historyLimit })
    })
    const refreshChanges = async () => { const value = await api('snapshot/diff'); setChanges(value.items); setSelectedItems(value.items.map(item => item.id)); return value }
    const refreshHistory = async () => { const value = await api('snapshot/history'); setHistory(value); return value }
    const sync = (resolveConflicts, all = false) => run('sync', async () => {
      const value = await api('snapshot/push', { strategy, resolveConflicts, selectedItems: all ? undefined : selectedItems })
      if (value.direction === 'needs-choice') { setConflicts(value.conflicts); return t('ui.182', { count: value.conflicts.length }) }
      setConflicts([]); await refreshChanges(); await refreshHistory().catch(() => {})
      const sourceWarning = value.missingLocalSources?.length ? `\n${t('ui.207', { sources: value.missingLocalSources.join(', ') })}` : ''
      const message = value.direction === 'downloaded' ? t('ui.102') : value.direction === 'merged' ? t('ui.103') : t('ui.104')
      return `${message}: ${new Date(value.createdAt).toLocaleString()}${sourceWarning}`
    })
    const beginSync = strategy === 'local' ? sync(undefined, true) : run('prepare-sync', async () => { const value = await refreshChanges(); setDiffOpen(true); return value.items.length === 0 ? t('ui.105') : '' })
    const modes = [
      ['smart', t('ui.108'), t('ui.151'), 'sync', true],
      ['cloud', t('ui.110'), t('ui.152'), 'cloud', false],
      ['local', t('ui.112'), t('ui.153'), 'desktop', false],
    ]
    const detail = settings.provider?.type === 'webdav' ? settings.provider.url : settings.provider?.type === 'gist' ? `Secret Gist · ${settings.provider.gistId}` : settings.provider?.endpoint
    return h(React.Fragment, null,
      configured ? h('div', { className: 'currentChannel' }, h('div', { className: 'providerMark' }, h(ProviderLogo, { type: settings.provider.type })), h('div', null, h('div', { className: 'currentChannelTitle' }, providerLabel(settings.provider.type), h('span', { className: 'connectedLabel' }, t('ui.95'))), h('div', { className: 'currentChannelDetail' }, detail)), h(UiIcon, { name: 'chevron' })) : h('p', { className: 'notice' }, t('ui.154')),
      h('section', { className: 'group' }, h('div', { className: 'referenceSectionTitle' }, h('div', null, h('h3', null, t('ui.106')), h('p', { className: 'hint' }, t('ui.155')))),
        h('div', { className: 'modeCards', role: 'group', 'aria-label': t('ui.107') }, modes.map(([value, label, description, icon, recommended]) => h('button', { key: value, className: `modeCard ${strategy === value ? 'active' : ''}`, disabled: !configured || busy !== '', title: description, 'aria-pressed': strategy === value, onClick: () => { setStrategy(value); setConflicts([]); setChanges([]) } }, h(UiIcon, { name: icon }), h('strong', null, label), recommended ? h('span', { className: 'modeRecommendation' }, t('ui.156')) : null))),
        h('p', { className: 'modeSummary' }, modes.find(([value]) => value === strategy)?.[2]),
        h('button', { className: 'primary syncCta', disabled: !configured || busy !== '', onClick: beginSync }, h(UiIcon, { name: 'sync' }), busy === 'sync' || busy === 'prepare-sync' ? t('ui.157') : t('ui.115')),
        conflicts.length ? h('div', { className: 'conflicts' }, h('strong', null, t('ui.185', { count: conflicts.length })), h('div', { className: 'actions' }, h('button', { disabled: busy !== '', onClick: sync('cloud') }, t('ui.117')), h('button', { disabled: busy !== '', onClick: sync('local') }, t('ui.118')))) : null
      ),
      h('section', { className: 'group' }, h('div', { className: 'referenceSectionTitle' }, h('div', null, h('h3', null, t('ui.186', { count: history.length ? ` (${history.length})` : '' })), h('p', { className: 'hint' }, t('ui.158'))), h('div', { className: 'historyActions' }, h('button', { disabled: busy !== '' || !configured, onClick: run('history', async () => { const value = await refreshHistory(); return t('ui.187', { count: value.length }) }) }, t('ui.202')), h('button', { disabled: busy !== '' || !configured, onClick: run('preview', async () => { const value = await api('snapshot/pull'); return t('ui.188', { date: value.createdAt, profile: value.plan?.map(item => item.name).join(', ') || t('ui.120') }) }) }, t('ui.203')))),
        history.length ? h('div', { className: 'historyList' }, history.slice(0, 5).map((entry, index) => h('div', { className: 'historyRow', key: entry.key }, h('div', null, h('div', { className: 'historyTime' }, new Date(entry.createdAt).toLocaleString(), index === 0 ? h('span', { className: 'latestPill' }, t('ui.159')) : null), h('div', { className: 'historyDevice' }, entry.deviceName || entry.deviceId || t('ui.122'))), h('button', { disabled: busy !== '', onClick: run(`rollback:${entry.key}`, async () => { const value = await api('snapshot/pull', { apply: true, snapshotKey: entry.key }); return t('ui.190', { backup: value.backup }) }) }, t('ui.201'))))) : h('p', { className: 'empty' }, configured ? t('ui.123') : t('ui.160')),
        configured ? h('div', { className: 'sourceTools' }, h(Field, { label: t('ui.208') }, h('input', { type: 'number', min: 1, max: 200, value: limitInput, onChange: event => setLimitInput(event.target.value), title: t('ui.211') })), h('div', { className: 'actions' }, h('button', { className: 'primary', disabled: busy !== '' || !limitValid || limit === settings.historyLimit, onClick: saveLimit() }, t('ui.209')))) : null,
        settings.provider?.type === 'gist' ? h('p', { className: 'providerHint' }, t('ui.161')) : h('details', { className: 'auxiliarySource' }, h('summary', null, t('ui.162')), h('div', { className: 'sourceTools' }, h(Field, { label: t('ui.127'), wide: true }, h('input', { value: source, onChange: event => setSource(event.target.value), placeholder: 'E:\\dsh-plugin' })), h('div', { className: 'actions' }, h('button', { className: 'primary', disabled: busy !== '' || source.trim() === '', onClick: run('backup', async () => { const value = await api('source/backup', { directory: source }); return t('ui.191', { name: value.name, version: value.version }) }) }, t('ui.198')))))
      ),
      diffOpen ? h(DiffDialog, { changes, selectedItems, setSelectedItems, strategy, busy, onClose: () => setDiffOpen(false), onSync: () => { setDiffOpen(false); (strategy === 'cloud' ? sync(undefined, true) : sync())() } }) : null
    )
  }

  function StatusTab({ run, busy, setResult }) {
    const [inventory, setInventory] = useState()
    const [settings, setSettings] = useState()
    const refresh = async () => { const [value, currentSettings] = await Promise.all([api('inventory'), api('settings/get')]); setInventory(value); setSettings(currentSettings); return value }
    useEffect(() => { refresh().catch(error => setResult({ error: true, message: t('ui.204', { error: error.message }) })) }, [])
    const install = plugin => run(`install:${plugin.name}`, async () => { const value = await api('plugin/install-configured', { packageName: plugin.name }); await refresh(); return value.buildApprovalRequired ? t('ui.192', { name: plugin.name }) : t('ui.193', { name: plugin.name }) })
    const uninstall = plugin => run(`uninstall:${plugin.name}`, async () => { await api('plugin/uninstall', { packageName: plugin.name }); await refresh(); return t('ui.194', { name: plugin.name }) })
    if (inventory === undefined || settings === undefined) return h('p', { className: 'notice' }, t('ui.128'))
    const remote = inventory.remote
    const configured = providerIsConfigured(settings.provider)
    return h(React.Fragment, null,
      h('section', { className: 'group' }, h('div', { className: 'referenceSectionTitle' }, h('div', null, h('h3', null, t('ui.129')), h('p', { className: 'hint' }, configured ? t('ui.183', { provider: providerLabel(settings.provider.type) }) : t('ui.195'))), h('button', { className: 'refreshButton', disabled: busy !== '', onClick: run('refresh', refresh) }, h(UiIcon, { name: 'refresh' }), busy === 'refresh' ? t('ui.130') : t('ui.163'))),
        h('div', { className: 'overview' }, h('div', { className: 'metric' }, h('span', { className: 'metricLabel' }, t('ui.164')), h('span', { className: 'metricValue', style: { color: remote.available ? '#13a56b' : '#d04c61' } }, remote.available ? t('ui.133') : t('ui.134')), h('span', { className: 'metricDetail' }, remote.available ? new Date(remote.createdAt).toLocaleString() : remote.error || t('ui.165')), h('span', { className: 'metricIcon ok' }, h(UiIcon, { name: remote.available ? 'check' : 'cloud' }))), h('div', { className: 'metric' }, h('span', { className: 'metricLabel' }, t('ui.136')), h('span', { className: 'metricValue' }, t('ui.196', { count: inventory.local.dependencies })), h('span', { className: 'metricDetail' }, t('ui.197', { count: inventory.local.bundles })), h('span', { className: 'metricIcon' }, h(UiIcon, { name: 'cube' }))))
      ),
      h('section', { className: 'group' }, h('div', { className: 'referenceSectionTitle' }, h('div', null, h('h3', null, t('ui.137')), h('p', { className: 'hint' }, t('ui.166')))), h('div', { className: 'pluginList' }, inventory.plugins.length === 0 ? h('p', { className: 'empty' }, t('ui.139')) : inventory.plugins.map(plugin => h('div', { className: 'plugin', key: plugin.name }, h('div', null, h('div', { className: 'pluginName' }, plugin.name), h('div', { className: 'pluginMeta' }, h('span', { className: `pill ${plugin.installed ? 'ok' : 'warn'}` }, plugin.installed ? t('ui.140') : t('ui.141')), plugin.enabled ? h('span', { className: 'pill ok' }, t('ui.142')) : null, plugin.localSource ? h('span', { className: `pill ${plugin.sourceArchived ? '' : 'warn'}` }, plugin.sourceArchived ? t('ui.143') : t('ui.144')) : null, h('span', null, plugin.requested))), plugin.name === '@dickpy/dsh-cloud-sync' ? h('button', { disabled: true }, t('ui.145')) : plugin.installed ? h('button', { className: 'danger', disabled: busy !== '', onClick: uninstall(plugin) }, t('ui.146')) : h('button', { className: 'primary', disabled: busy !== '' || !plugin.configuredInRemote || (plugin.localSource && !plugin.sourceArchived), onClick: install(plugin) }, plugin.localSource && !plugin.sourceArchived ? t('ui.147') : t('ui.148')))))
      )
    )
  }

  function CloudSyncSection() {
    useLocale()
    const [tab, setTab] = useState('services')
    const [busy, setBusy] = useState('')
    const [result, setResult] = useState('')
    const [version, setVersion] = useState(clientVersion)
    useEffect(() => { api('release/check').then(value => setVersion(value.localVersion || '')).catch(() => {}) }, [])
    const run = (label, operation) => async () => { setBusy(label); try { const value = await operation(); if (typeof value === 'string') setResult(value) } catch (error) { setResult({ error: true, message: t('ui.204', { error: error.message }) }) } finally { setBusy('') } }
    return h('div', { className: 'dsh-cloud-sync' },
      h('style', null, `${css}\n.dsh-cloud-sync .githubConnectModal{position:relative}.dsh-cloud-sync .githubConnectModal>.modalClose{position:absolute;top:12px;right:12px}.dsh-cloud-sync .modeCard{position:relative;gap:6px}.dsh-cloud-sync .modeRecommendation{padding:1px 5px;border-radius:3px;background:#eaf9f2;color:#12845b;font-size:9px;font-weight:650;line-height:14px}.dsh-cloud-sync .modeSummary{min-height:18px;margin:9px 2px 0;color:var(--muted);font-size:11px;line-height:18px;text-align:center}\n.dsh-cloud-sync .githubLink{display:inline-grid;flex:0 0 auto;place-items:center;width:30px;height:30px;margin-left:auto;padding:0;border:1px solid var(--line);border-radius:50%;background:transparent;color:var(--muted);cursor:pointer;transition:color .16s,border-color .16s,background .16s,transform .16s}.dsh-cloud-sync .githubLink:hover{border-color:#9cb2ff;color:var(--blue);background:var(--blue-soft);transform:translateY(-1px)}.dsh-cloud-sync .githubLink:focus-visible{outline:2px solid var(--blue);outline-offset:1px}.dsh-cloud-sync .githubLink svg{display:block;width:17px;height:17px}\n.dsh-cloud-sync .providerMark img{display:block;width:28px;height:28px;object-fit:contain}.dsh-cloud-sync .githubMark{background:#fff;border:1px solid #e2e5ea}.dsh-cloud-sync .githubMark img{display:block;width:36px;height:36px;object-fit:contain}\n.dsh-cloud-sync .modalHeadActions{display:flex;align-items:center;gap:6px}.dsh-cloud-sync .providerLink{display:inline-flex;align-items:center;gap:5px;padding:6px 10px;border:1px solid #dce2ec;border-radius:6px;color:#536fcf;background:transparent;font-size:11px;line-height:16px;text-decoration:none;cursor:pointer;transition:border-color .16s,background .16s,color .16s}.dsh-cloud-sync .providerLink:hover{border-color:#9cb2ff;background:#fafbff;color:var(--blue)}.dsh-cloud-sync .providerLink svg{display:block;width:11px;height:11px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}.dsh-cloud-sync .githubJump{margin-top:10px}\n${layoutCss}\n${systemCss}`),
      h('div', { className: 'syncHeader' },
        h('div', { className: 'syncTitleRow' }, h(UiIcon, { name: 'cloud' }), h('h2', null, t('ui.167'), version === '' ? null : h('span', { className: 'version' }, `v${version}`)),
          h('a', { className: 'githubLink', href: 'https://github.com/dickpy/dsh-cloud-sync', target: '_blank', rel: 'noopener noreferrer', title: t('ui.168'), 'aria-label': t('ui.169') },
            h('svg', { viewBox: '0 0 24 24', 'aria-hidden': 'true' }, h('path', { d: 'M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55v-2.15c-3.2.69-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.75 2.69 1.25 3.34.95.1-.74.4-1.25.72-1.53-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.7 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z', fill: 'currentColor' })))),
        h('p', { className: 'intro' }, t('ui.170')),
        h(ReleaseUpdateNotice, { run, busy, setResult })
      ),
      h('div', { className: 'tabs', role: 'tablist', 'aria-label': t('ui.171') },
        h('button', { className: 'tab', role: 'tab', 'aria-selected': tab === 'services', onClick: () => setTab('services') }, t('ui.93')),
        h('button', { className: 'tab', role: 'tab', 'aria-selected': tab === 'history', onClick: () => setTab('history') }, t('ui.172')),
        h('button', { className: 'tab', role: 'tab', 'aria-selected': tab === 'status', onClick: () => setTab('status') }, t('ui.129'))
      ),
      h('div', { role: 'tabpanel' }, tab === 'services' ? h(ServicesTab, { run, busy, setResult }) : tab === 'history' ? h(ConfigurationHistoryTab, { run, busy, setResult }) : h(StatusTab, { run, busy, setResult })),
      h(Result, { value: result })
    )
  }

  const inject = ['slots', 'locale']
  function apply(ctx) { ctx.locale.register(NS, { zh, en }); locale = ctx.locale.bind(NS); ctx.slots.inject('settings.section', () => ctx.slots.register({ name: 'settings.section', id: 'cloud-sync', order: 25, locale: NS, label: () => t('ui.173') }, CloudSyncSection)) }
  return { inject, apply }
} })
