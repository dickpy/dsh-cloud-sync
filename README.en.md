<div align="center">

# DSH Cloud Sync

**Portable DeepSeek Harness profile and local-plugin source synchronization**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-0.19.1-blue)](package.json)
[![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](package.json)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/dickpy/dsh-cloud-sync/pulls)

`@dsh-local/dsh-cloud-sync` · WebDAV / S3 / OSS / COS / MinIO · AES-256-GCM client-side encryption · Snapshot history & rollback

[中文](README.md) · [Changelog](CHANGELOG.md) · [Issues](https://github.com/dickpy/dsh-cloud-sync/issues)

</div>

---

## What is it?

**DSH Cloud Sync** is a [DeepSeek Harness](https://github.com/deepseek-ai/dsh) (DSH) bundle for portable profile recovery. It synchronizes small, reproducible profile files to WebDAV, S3, OSS, COS, or MinIO rather than copying `node_modules`, then lets DSH/pnpm rebuild packages on the target computer.

It **never** copies sessions, attachments, pnpm cache, `node_modules`, or credentials.

## Features

| Feature | Description |
| --- | --- |
| 📦 **Lightweight sync** | Syncs `package.json`, `pnpm-lock.yaml`, `.npmrc`, `pnpm-workspace.yaml`, `cordis.patch.yml`, `cordis.yml`, and marketplace hot-update YAML files |
| ☁ **Storage providers** | WebDAV, Amazon S3, Alibaba Cloud OSS, Tencent Cloud COS, and MinIO; only one provider is active at a time |
| 🔗 **Source auto-archiving** | Local-plugin source archives automatically captured from reachable `file:` / `link:` dependencies during Sync |
| 🔒 **Client-side encryption** | Optional AES-256-GCM encryption; each object carries a fresh KDF salt; passphrase never written to disk |
| 🕘 **History & rollback** | Every successful sync records a dated snapshot (latest 30 retained remotely) with one-click rollback |
| 🔀 **Three sync policies** | Smart merge (default), Cloud first, Local first |
| 🧩 **Plugin lifecycle** | Panel derives plugins from the synced profile; install / uninstall remote-declared plugins |
| 🔄 **Automatic sync** | Device name + interval from 5 minutes to 24 hours; runs only when changes are detected |
| 🆕 **Self-update** | Distributes its own `.tgz` via GitHub Releases with GitHub SHA-256 asset-digest verification and explicit updates |

## Quick start

### 1. Install

Copy this folder to the target computer, then run:

```powershell
dsh plugin --profile web add .
```

Restart DSH, open Settings, then choose **Cloud Sync** in the left navigation.

### 2. First backup

1. Select **Connect**, choose WebDAV, S3, OSS, COS, or MinIO, then enter its endpoint and credentials.
2. Save the connection. Selecting and saving another provider replaces the active provider.
3. Select **Sync**. It automatically archives every reachable local source plugin without retaining its old drive path. `.dshsyncignore` can exclude additional file or directory names.

### 3. Restore on a new device

Install this Sync bundle and configure the same target, then:

1. The **Sync status** tab lists remote plugins and their local installation state;
2. Install missing plugins there, or choose **Preview restore** → **Apply restore** for complete profile recovery;
3. Restore writes profile files only; it deliberately defers dependency installation until DSH is fully restarted.

## Sync policies

| Policy | Description |
| --- | --- |
| **Smart merge** (default) | Unions plugin dependencies, bundles, and source archives; pauses and asks when both sides changed the same item |
| **Cloud first** | Restores the remote snapshot to the current profile |
| **Local first** | Replaces the remote snapshot with the current profile |

## Client-side encryption

Provide a passphrase (≥ 8 characters) in the Settings panel to enable:

- Snapshots, history, and local-plugin source archives are encrypted with AES-256-GCM before upload;
- Each encrypted object carries a fresh KDF salt — a second device only needs the same passphrase, never a copied local settings file;
- The passphrase and derived key are never written to disk; re-enter the passphrase after restarting DSH.

## Self-update

- Checks the latest [GitHub Release](https://github.com/dickpy/dsh-cloud-sync/releases) when the settings page opens; no sync provider is required;
- When a newer version is available an **Update** button is shown: package is downloaded to `~/.dsh/dsh-cloud-sync/releases/`, SHA-256 verified, then installed into the `web` profile;
- Updating is explicit: a sync never silently replaces the running Cloud Sync bundle;
- Release checks compare both version and checksum, so a same-version repair can show an **Update** action without bumping the version.

## Safety notes

- Use HTTPS for WebDAV, S3, OSS, and COS. MinIO may use HTTP on localhost or a trusted private network; public deployments should still use HTTPS;
- Source archives are checksummed before restoration, written under the DSH sync directory, and reject traversal paths;
- A restore first writes the prior profile files to `~/.dsh/dsh-cloud-sync/backups/`; only the newest ten local backups are retained;
- On Windows remembered passwords and Secret Access Keys are protected with DPAPI for the current user; on other platforms they are stored in a separate owner-only (`0600`) credentials file; `settings.json` never contains plaintext secrets;
- Encryption protects remote snapshot contents, but it does not replace access controls or protect a device that is already compromised.

## Development

### Requirements

- Node.js ≥ 18
- pnpm

### Commands

```powershell
# Syntax check
pnpm check

# Unit tests (built-in mock WebDAV / S3-compatible server)
pnpm test
```

### Structure

```
lib/
  index.js   # Bundle entry: registers /api/dsh-cloud-sync/* routes (loopback only)
  core.js    # Core logic: storage providers, snapshots, encryption, plugin lifecycle
  client.js  # Web panel (React, injected into the Settings "Cloud Sync" section)
test/
  core.test.mjs  # Integration tests with mock WebDAV / S3-compatible storage
cordis.patch.yml # Injects the host API and panel into the DSH web profile
```

### Releasing

Versioning follows `major.minor.patch`:

1. Bump `version` in `package.json` and the README badges;
2. Run `pnpm check` and `pnpm test`;
3. Create a GitHub Release with the `.tgz` asset (`npm pack`);
4. Other devices detect the new version and update explicitly from the settings page.

## FAQ

**Q: What object-storage endpoint should I use?**
A: Enter the service root and provide the bucket separately. S3, OSS, and COS use their regional S3-compatible endpoints; COS bucket names commonly include the APPID. MinIO endpoints may include a reverse-proxy base path.

**Q: Will it silently replace the running Cloud Sync?**
A: No. Updates are always explicit — click **Update** in the settings page and restart DSH.

**Q: How do I exclude files from sync?**
A: Create a `.dshsyncignore` in the DSH sync directory, one file or directory name per line.

**Q: What about build-script approvals for remote plugin installs?**
A: Cloud Sync imports the source profile's `allowBuilds` entries and lockfile-pinned Git revisions; approve only the build scripts you trust.

## Contributing

Issues and pull requests are welcome!

## License

[MIT](LICENSE) © 2025 dickpy
