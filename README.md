# DSH Cloud Sync

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-0.18.2-blue)](package.json)
[![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](package.json)

**DSH Cloud Sync** 是 [DeepSeek Harness](https://github.com/deepseek-ai/dsh)（DSH）的官方 bundle 插件，用于**可移植的配置文件与本地插件源码同步**。它只同步小而可复现的配置文件到 WebDAV，而不是复制 `node_modules`，目标电脑上由 DSH / pnpm 自动重建依赖。

> `@dsh-local/dsh-cloud-sync` · 支持 WebDAV · 客户端加密（AES-256-GCM）· 快照历史与回滚

---

## 功能亮点

- 📦 **轻量同步** — 只同步 `package.json`、`pnpm-lock.yaml`、`.npmrc`、`pnpm-workspace.yaml`、`cordis.patch.yml`、`cordis.yml` 及市场热更新 YAML；绝不复制会话、附件、pnpm 缓存、`node_modules` 或凭据。
- 🔗 **本地插件源码自动归档** — 同步时自动捕获所有可达的 `file:` / `link:` 依赖源码，并剥离旧驱动器路径。
- 🔒 **客户端加密** — 可选 AES-256-GCM 加密，每次加密对象携带全新 KDF salt，口令与派生密钥绝不落盘。
- 🕘 **快照历史与回滚** — 每次成功同步记录历史（保留最近 30 条），支持一键回滚。
- 🔀 **三种同步策略** — 智能合并（默认，冲突时询问）、云端优先、本地优先。
- 🧩 **插件生命周期管理** — 面板直接从同步的 profile 派生插件列表，支持远程插件安装 / 卸载。
- 🔄 **自动同步** — 设备名 + 5 分钟 ~ 24 小时间隔自动同步；仅在检测到变化时运行。
- 🆕 **自更新** — 通过私有 WebDAV 目标分发自身 `.tgz`，SHA-256 校验后显式更新。

## 快速开始

### 安装

将本文件夹拷贝到目标电脑，然后运行：

```powershell
dsh plugin --profile web add .
```

重启 DSH，打开 **设置**，在左侧导航中选择 **云同步**。

### 首次备份

1. 点击 **连接**，输入 WebDAV 端点、账号邮箱与应用密码（坚果云请在账号安全设置中创建应用密码）。首次同步会自动创建端点目录。
2. 保存连接，profile 即配置为仅 WebDAV 同步。
3. 点击 **同步**，自动归档每个可达的本地源码插件。`.dshsyncignore` 可额外排除文件或目录名。

### 在新设备恢复

在新设备安装本 Sync bundle 并配置同一目标，在 **同步状态** 页可查看远端插件与本机安装状态，选择安装缺失插件，或 **预览恢复** → **应用恢复** 完成完整 profile 恢复。恢复只写 profile 文件，依赖安装延迟到 DSH 完全重启后执行。

## 提供商

Cloud Sync 目前仅支持 **WebDAV**。端点必须使用 HTTPS；明文 HTTP Basic 认证会被拒绝，以避免凭据明文传输。

## 同步策略

| 策略 | 说明 |
| --- | --- |
| **智能合并**（默认） | 合并插件依赖、bundle 与源码归档；双方同时修改同一项时暂停询问保留云端还是本地。 |
| **云端优先** | 用远端快照恢复当前 profile。 |
| **本地优先** | 用当前 profile 覆盖远端快照。 |

## 客户端加密

在设置面板中提供加密口令启用。快照、历史与本地插件源码归档在上传前均以 AES-256-GCM 加密，每个加密对象携带独立 KDF salt——第二台设备只需相同口令，无需拷贝本地设置文件。重启 DSH 后需重新输入口令。

## 安全说明

- 使用**私有** HTTPS WebDAV 目录与应用密码。
- 源码归档在恢复前做 SHA-256 校验，写入 DSH 同步目录，拒绝路径穿越。
- 恢复前先将旧 profile 文件写入 `~/.dsh/dsh-cloud-sync/backups/`，仅保留最近 10 个本地备份。
- 加密保护远端快照内容，但不能替代访问控制，也无法保护已被入侵的设备。
- Windows 下记住的应用密码用 DPAPI（当前用户）保护；其他平台存放于独立的仅属主（0600）本地凭据文件，`settings.json` 永远不含密码。

## 开发

```powershell
# 语法检查
pnpm check

# 单元测试（内置 WebDAV 模拟服务器）
pnpm test
```

### 项目结构

```
lib/
  index.js   # DSH bundle 入口：注册 /api/dsh-cloud-sync/* 路由（仅回环地址）
  core.js    # 核心逻辑：WebDAV 客户端、快照、加密、插件生命周期
  client.js  # Web 面板（React，注入设置页"云同步"区块）
test/
  core.test.mjs  # 核心流程集成测试
cordis.patch.yml # 向 DSH web profile 注入 host API 与面板
```

## 发布

版本号遵循 `major.minor.patch`。每次发布：

1. 更新 `package.json` 的 `version` 与 `README.md` 徽章；
2. 执行 `pnpm check` 与 `pnpm test`；
3. 打包 `.tgz`（`npm pack`），通过已同步设备推送到 WebDAV `releases/dsh-cloud-sync/`；
4. 其他设备在云同步设置页会检测到新版本并显式更新。

## 许可

[MIT](LICENSE) © 2025 dickpy
