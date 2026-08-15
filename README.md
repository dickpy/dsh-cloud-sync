# DSH Cloud Sync

`@dsh-local/dsh-cloud-sync` is a DeepSeek Harness bundle for portable profile recovery. It synchronizes small, reproducible profile files to WebDAV rather than copying `node_modules`, then lets DSH/pnpm rebuild packages on the target computer.

## Included in a profile snapshot

- `package.json`, `pnpm-lock.yaml`, `.npmrc`, and `pnpm-workspace.yaml`
- `cordis.patch.yml`, `cordis.yml`, and marketplace hot-update YAML files
- Local-plugin source archives automatically captured from reachable `file:` and `link:` dependencies during Sync

It never copies sessions, attachments, pnpm cache, `node_modules`, or credentials. WebDAV credentials never enter a snapshot. On Windows the remembered app password is protected with DPAPI for the current user; on other platforms it is stored in a separate owner-only (`0600`) local credentials file. `settings.json` never contains the password.

## Install

Copy this folder to the target computer, then run:

```powershell
dsh plugin --profile web add .
```

Restart DSH, open Settings, then choose Cloud Sync in the left navigation.

## First backup

1. Select **Connect** and enter a WebDAV endpoint, account email, and app password. For Nutstore, create the app password under account security settings. A new endpoint directory is created on the first sync.
2. Save the connection. The profile is now configured for WebDAV-only sync.
3. Select **Sync**. It automatically archives every reachable local source plugin without retaining its old drive path. `.dshsyncignore` can exclude additional file or directory names.

On a new device, install this one Sync bundle and configure the same target. The **Sync status** tab lists the remote plugins and their local installation state. Install missing plugins there, or choose **Preview restore** then **Apply restore** for a complete profile recovery. Restore writes profile files only; it deliberately defers dependency installation until DSH is fully restarted. Local plugin sources are restored below `~/.dsh/dsh-cloud-sync/local-plugins/` and profile dependencies are rewritten to their new local paths.

## Providers

Cloud Sync supports WebDAV only. The endpoint must use HTTPS; HTTP Basic authentication is rejected to avoid sending credentials in clear text.

## Cloud Sync updates

When a device synchronizes a locally installed Cloud Sync `.tgz`, it publishes that package to the same private WebDAV target. Other devices check `releases/dsh-cloud-sync/latest.json` when the Cloud Sync settings page opens. If a newer version is available, an **Update** button is shown. Updating is explicit: the package is downloaded to `~/.dsh/dsh-cloud-sync/releases/`, SHA-256 verified, then installed into the `web` profile. Fully restart DSH after the update.

The first installation of Cloud Sync is still manual. A sync never silently replaces the running Cloud Sync bundle, and an older device cannot overwrite a newer release already stored in WebDAV.

Release checks compare both version and package checksum. This permits a fixed same-version repair to show an **Update** action without artificially increasing the displayed version.

Cloud Sync itself is intentionally excluded from profile snapshots and lockfiles. Its local `.tgz` path must never be copied to another computer. Each device keeps its own bootstrap installation, then uses the explicit WebDAV update action for later versions.

Only packages declared in the profile `package.json` can be rebuilt automatically. Before syncing, add a manually cloned plugin through `dsh plugin --profile web add` so its package source is declared; a Cordis configuration entry alone cannot tell a target device where to download that package.

## Sync policies

- **Smart merge** is the default. It unions plugin dependencies, bundles, and source archives. When both sides changed the same dependency, source archive, or profile configuration, it pauses and asks whether to keep the cloud or local version for that sync.
- **Cloud first** restores the remote snapshot to the current profile.
- **Local first** replaces the remote snapshot with the current profile.

## History, selection, and devices

- Every successful sync records a dated snapshot history entry with the originating device name and identifier. Use **Refresh history** and **Rollback** in Settings to recover a selected snapshot. The latest 30 remote history entries are retained.
- **Check differences** lists changed plugin versions and profile configuration files. Select only the entries that should move in the current sync, or use **Sync all** for the complete snapshot.
- Set a device name and enable automatic sync with an interval from 5 minutes to 24 hours. Automatic sync checks for changes and leaves unresolved smart-merge conflicts for manual review.
- Local-plugin source archives can be excluded independently, allowing configuration-only synchronization.

## Client-side encryption

Client-side encryption is optional and uses an encryption passphrase supplied in the Settings panel. Snapshots, history, and local-plugin source archives are encrypted with AES-256-GCM before they are uploaded to WebDAV. Each encrypted object carries a fresh KDF salt, so a second device only needs the same passphrase and never a copied local settings file. The passphrase and derived key are never written to disk; after restarting DSH, enter the passphrase again before accessing encrypted sync data. Cloud Sync release archives remain unencrypted so devices can still discover and explicitly download an update.

Installing a package can complete while pnpm reports that optional dependency build scripts require approval. In that case the bundle is enabled and DSH can be restarted; approve only the build scripts you trust before relying on features that need their native or download-time setup.

For remote plugin installation, Cloud Sync imports the source profile's approved `allowBuilds` entries and its lockfile-pinned Git revision before running pnpm. The source device must perform a Sync after granting a build approval so that permission is available to a new device.

On Windows, Cloud Sync creates a profile-local `pnpm.cmd` shim that points to that device's own global pnpm installation. This lets installed DSH plugins run `pnpm update` even when the desktop application's PATH does not include the global npm shim directory. The generated shim is machine-local and is not copied into a snapshot.

Machine-specific pnpm paths such as `storeDir`, `cacheDir`, and global directory settings are removed from both `pnpm-workspace.yaml` and `.npmrc` before a snapshot is uploaded or restored. Before any pnpm operation, Cloud Sync reads the profile's current `node_modules/.modules.yaml` and writes that device's own store path locally. Portable pnpm settings including `allowBuilds`, release-age policy, and the lockfile remain synchronized.

## Plugin lifecycle

The panel derives plugins from the synced profile instead of asking for package specs manually. It can install missing remote-declared plugins and uninstall installed packages. Both actions modify the selected DSH profile and update the `dsh.profile.bundles` list when the package declares `dsh.bundle`. They require a restart.

Uninstalling a plugin removes it only from the current profile. It does not remove a backed-up local source archive from the sync target.

## Safety notes

Use a private HTTPS WebDAV directory and an app password. Source archives are checksummed before restoration, written under the DSH sync directory, and reject traversal paths. A restore first writes the prior profile files to `~/.dsh/dsh-cloud-sync/backups/`; only the newest ten local backups are retained. Encryption protects remote snapshot contents, but it does not replace access controls or protect a device that is already compromised.
