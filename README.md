<div align="center">

# DSH Cloud Sync

**可移植的 DeepSeek Harness 配置文件与本地插件源码同步工具**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-0.19.1-blue)](package.json)
[![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](package.json)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/dickpy/dsh-cloud-sync/pulls)

`@dsh-local/dsh-cloud-sync` · WebDAV / S3 / OSS / COS / MinIO · AES-256-GCM 客户端加密 · 快照历史与回滚

[English](README.en.md) · [变更日志](CHANGELOG.md) · [问题反馈](https://github.com/dickpy/dsh-cloud-sync/issues)

</div>

---

## 它是什么？

DSH Cloud Sync 是 [DeepSeek Harness](https://github.com/deepseek-ai/dsh)（DSH）的官方 bundle 插件，用于**跨设备移植 DSH 环境**。

它的核心思路是：**只同步小而可复现的配置文件**，而不是复制 `node_modules`。配置快照与本地插件源码归档可存入 WebDAV、S3、OSS、COS 或 MinIO，目标电脑上由 DSH / pnpm 自动重建依赖，从而在多台设备间保持一致的插件环境。

```
┌─────────────┐   只同步配置快照 + 源码归档   ┌──────────────┐
│  设备 A      │ ───────────────────────────▶ │  远端存储     │
│  (办公室)     │                              │ WebDAV / S3  │
└─────────────┘                              └──────────────┘
┌─────────────┐   恢复快照，pnpm 重建依赖      ▲
│  设备 B      │ ───────────────────────────┘
│  (家里)      │
└─────────────┘
```

**绝不**复制：会话、附件、pnpm 缓存、`node_modules`、凭据。

## 功能特性

| 特性 | 说明 |
| --- | --- |
| 📦 **轻量同步** | 只同步 `package.json`、`pnpm-lock.yaml`、`.npmrc`、`pnpm-workspace.yaml`、`cordis.patch.yml`、`cordis.yml` 及市场热更新 YAML |
| ☁ **多渠道存储** | WebDAV、Amazon S3、阿里云 OSS、腾讯云 COS、MinIO；同一时间只启用一个渠道 |
| 🔗 **源码自动归档** | 同步时自动捕获所有可达的 `file:` / `link:` 依赖源码，剥离旧驱动器路径 |
| 🔒 **客户端加密** | 可选 AES-256-GCM 加密，每次对象携带全新 KDF salt，口令与派生密钥绝不落盘 |
| 🕘 **快照历史与回滚** | 每次成功同步记录历史（远端保留最近 30 条），支持一键回滚 |
| 🔀 **三种同步策略** | 智能合并（默认）、云端优先、本地优先 |
| 🧩 **插件生命周期管理** | 面板直接从同步的 profile 派生插件列表，支持远程插件安装 / 卸载 |
| 🔄 **自动同步** | 设备名 + 5 分钟 ~ 24 小时间隔，仅在检测到变化时运行 |
| 🆕 **自更新** | 通过 GitHub Releases 分发自身 `.tgz`，使用 GitHub SHA-256 资产摘要校验后显式更新 |

## 快速开始

### 1. 安装

将本文件夹拷贝到目标电脑，然后运行：

```powershell
dsh plugin --profile web add .
```

重启 DSH，打开 **设置**，在左侧导航中选择 **云同步**。

### 2. 首次备份

1. 点击 **连接**，选择 WebDAV、S3、OSS、COS 或 MinIO，并填写对应端点和凭据。
2. 保存连接；切换并保存另一渠道时会替换当前渠道配置。
3. 点击 **同步**，自动归档每个可达的本地源码插件。`.dshsyncignore` 可额外排除文件或目录名。

### 3. 在新设备恢复

在新设备安装本 Sync bundle 并配置同一目标后：

1. **同步状态** 页查看远端插件与本机安装状态；
2. 选择安装缺失的插件，或依次点击 **预览恢复** → **应用恢复** 完成完整 profile 恢复；
3. 恢复只写 profile 文件，**依赖安装延迟到 DSH 完全重启后执行**。

## 同步策略

| 策略 | 说明 |
| --- | --- |
| **智能合并**（默认） | 合并插件依赖、bundle 与源码归档；双方同时修改同一项时暂停，询问保留云端还是本地 |
| **云端优先** | 用远端快照恢复当前 profile |
| **本地优先** | 用当前 profile 覆盖远端快照 |

## 客户端加密

在设置面板中提供加密口令（至少 8 个字符）启用：

- 快照、历史与本地插件源码归档在上传前均以 **AES-256-GCM** 加密；
- 每个加密对象携带独立 KDF salt —— 第二台设备只需相同口令，无需拷贝本地设置文件；
- 口令与派生密钥**从不写入磁盘**；重启 DSH 后需重新输入口令解锁。

## 自更新机制

- Cloud Sync 设置页打开时检查最新 [GitHub Release](https://github.com/dickpy/dsh-cloud-sync/releases)，无需配置同步渠道；
- 检测到新版本时显示 **更新** 按钮：下载到 `~/.dsh/dsh-cloud-sync/releases/`，SHA-256 校验后安装进 `web` profile；
- 更新是显式的：同步**永远不会**静默替换正在运行的 Cloud Sync bundle；
- 版本与校验和同时比较，允许同版本修复包显示更新动作，无需虚增版本号。

## 安全说明

- WebDAV、S3、OSS、COS 应使用 HTTPS；MinIO 支持本机或可信内网 HTTP，公网部署仍应使用 HTTPS；
- 源码归档恢复前做 SHA-256 校验，写入 DSH 同步目录，**拒绝路径穿越**；
- 恢复前先将旧 profile 写入 `~/.dsh/dsh-cloud-sync/backups/`，仅保留最近 10 个本地备份；
- Windows 下记住的密码或 Secret Access Key 以 **DPAPI**（当前用户）保护；其他平台存放于独立的仅属主（`0600`）本地凭据文件；`settings.json` 永远不含明文密钥；
- 加密保护远端快照内容，但不能替代访问控制，也无法保护已被入侵的设备。

## 开发

### 环境要求

- Node.js ≥ 18
- pnpm

### 命令

```powershell
# 语法检查
pnpm check

# 单元测试（内置 WebDAV / S3 兼容模拟服务器）
pnpm test
```

### 项目结构

```
lib/
  index.js   # DSH bundle 入口：注册 /api/dsh-cloud-sync/* 路由（仅回环地址）
  core.js    # 核心逻辑：存储 provider、快照、加密、插件生命周期
  client.js  # Web 面板（React，注入设置页"云同步"区块）
test/
  core.test.mjs  # 核心流程集成测试（模拟 WebDAV / S3 兼容服务器）
cordis.patch.yml # 向 DSH web profile 注入 host API 与面板
```

### 发布新版本

版本号遵循 `major.minor.patch`：

1. 更新 `package.json` 的 `version` 与 README 徽章；
2. 执行 `pnpm check` 与 `pnpm test`；
3. 创建 GitHub Release 并附带 `.tgz` 资产（`npm pack`）；
4. 其他设备在云同步设置页会检测到新版本并显式更新。

## 常见问题

**Q: 对象存储 Endpoint 怎么填？**
A: 填服务根地址，Bucket 单独填写。S3 / OSS / COS 使用对应区域的 S3 兼容 Endpoint；COS 的 Bucket 通常包含 APPID。MinIO 可填写反向代理基础路径。

**Q: 会自动替换正在运行的 Cloud Sync 吗？**
A: 不会。更新永远是显式操作，需要你在设置页点击 **更新** 并重启 DSH。

**Q: 如何排除某些文件不同步？**
A: 在 DSH 同步目录创建 `.dshsyncignore`，每行一个文件或目录名。

**Q: 远程安装插件时构建脚本需要审批怎么办？**
A: Cloud Sync 会导入源 profile 的 `allowBuilds` 条目与 lockfile 锁定的 Git 版本；只批准你信任的构建脚本。

## 贡献

欢迎提交 [Issue](https://github.com/dickpy/dsh-cloud-sync/issues) 与 [Pull Request](https://github.com/dickpy/dsh-cloud-sync/pulls)！

## 许可

[MIT](LICENSE) © 2025 dickpy
