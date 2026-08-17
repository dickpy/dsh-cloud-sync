# Changelog

All notable changes to this project are documented in this file.

## 0.19.3 — 2026-08-17

- Fix Alibaba Cloud OSS first-sync uploads by using its overwrite-prevention header instead of the unsupported `If-None-Match: *` condition.

## 0.19.2 — 2026-08-16

- 重构云同步界面以匹配紧凑的三页工作台：云服务、配置与历史、同步状态。
- 统一复用 DSH 主题 token，支持系统明暗模式与自定义皮肤。
- 固定顶部同步导航，并在停用当前同步服务前要求二次确认。
- 固定显示客户端版本号，网络更新检查失败时仍显示当前构建版本。

## 0.19.1 — 2026-08-16

- “云服务”页完整展示 WebDAV、S3、OSS、COS、MinIO 渠道，当前仅启用一个渠道；连接弹窗直接对应所选渠道。
- 同步方式改为配置页右上角的分段切换，移除“自动同步与加密（可选）”界面区块。
- 新增“配置与历史”页，集中放置同步策略、历史恢复和本地插件源码；“同步状态”页仅保留状态概览和插件安装状态，并优化桌面与移动端布局。

## Unreleased

## 0.19.0 — 2026-08-16

- 同步渠道在 WebDAV 基础上新增 Amazon S3、阿里云 OSS、腾讯云 COS 和 MinIO；对象存储使用 S3 Signature V4 兼容 API。
- 设置页统一为单一同步渠道选择器；保存新渠道会替换旧渠道，同一时间仅启用一个 provider。
- Access Key Secret 与 WebDAV 密码继续使用独立凭据文件保存，Windows 下由 DPAPI 保护；切换渠道时不会复用旧渠道密钥。
- 新增对象存储连接、签名请求、快照上传/读取、密钥掩码与渠道切换集成测试。

## 0.18.3 — 2026-08-15

- 自更新改为检查并下载 GitHub Releases（`dickpy/dsh-cloud-sync`），不再依赖每个用户各自的 WebDAV；使用 GitHub 资产 SHA-256 摘要校验，不再需要私有 WebDAV 的 `releases/dsh-cloud-sync/latest.json`。
- 同步主流程按策略调整：本地优先直接同步；云端优先和智能合并先展示对本机的影响再确认。
- 差异窗口改为“当前状态 / 同步后”的结果导向展示，智能合并可逐项选择本地变化。
- 顶部导航固定；高级设置收起为自动同步、加密、历史恢复和本地源码区域。
- 设备名称自动读取，仅用于历史记录。

## 0.18.2 — 2025

- 修复与稳定性改进（同版本修复发布：`latest.json` 同时比较版本与校验和，允许同版本修复显示更新动作）。

## 0.18.x

- 自动同步仅在检测到变化时运行，遗留冲突交由人工处理。
- 同步范围支持单独关闭本地插件源码归档（仅同步配置）。

## 0.17.x

- 客户端加密（AES-256-GCM）与解锁/锁定会话支持。
- 快照历史、回滚与刷新历史。

## 0.16.x

- 智能合并策略：插件/配置冲突时按条目选择云端或本地版本。
- 支持勾选条目参与本次同步（同步选中项 / 一键同步全部）。

## 0.15.x

- 面板从同步的 profile 派生插件列表，支持远程插件安装、卸载与构建脚本审批传递。
- Windows profile 本地 `pnpm.cmd` shim。

## 0.14.x

- 本地插件源码自动归档与恢复（`file:` / `link:` 依赖，剥离旧驱动器路径）。
- 设备名、自动同步间隔配置。

## 0.13.x

- 首次 WebDAV 连接、快照推送/拉取、云同步设置页基础版本。
- 自更新：私有 WebDAV `releases/dsh-cloud-sync/latest.json` 版本检查与显式更新。
