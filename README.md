# edit-manifest

Changes AndroidManifest.xml to disable auto backup by setting android:allowBackup and android:debuggable to false.

## Installation

By default adding this plugin to your cordova-android project will set the `android:allowBackup` property in the `<application/>` tag to `false`.

```bash
cordova plugin add https://github.com/VormerICT/edit-manifest.git
```
