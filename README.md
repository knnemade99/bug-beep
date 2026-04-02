# Bug Beep

A VS Code extension that plays a sound **on save** when it detects problems in your file — so you get an audible cue without watching the Problems panel.

## Features

- Plays a sound when you save a file that contains:
  - **Errors** — compilation errors, type errors, syntax errors, etc.
  - **Unused variables** — declared but never used
  - **Unused imports** — imported but not referenced
- **Inline highlights on save** — problem lines are highlighted directly in the editor:
  - **Red** background for errors
  - **Dark yellow** background for unused imports and variables
  - Highlights automatically clear when you start editing
- **Toggle sound on/off** — disable the beep while keeping visual highlights via `bugBeep.soundEnabled`
- **Custom sound file** — replace the default beep with any sound file on your machine via `bugBeep.soundFilePath`
- Works with diagnostics from your language extensions (ESLint, TypeScript, etc.)
- Automatically adjusts playback volume based on your system volume to keep it non-intrusive
- Cross-platform — works on macOS, Windows, and Linux

## Requirements

- macOS (uses `afplay` for audio playback)
- VS Code `^1.105.0` or later

## Extension Settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `bugBeep.soundFilePath` | `string` | `""` | Absolute path to a custom sound file (`.wav`, `.mp3`, `.aiff`, etc.). Leave empty to use the default built-in sound. |
| `bugBeep.soundEnabled` | `boolean` | `true` | Enable or disable the beep sound on save. Highlights will still appear when disabled. |

### Using a Custom Sound

You can replace the default beep with any sound file on your machine:

1. Open VS Code Settings (`Cmd + ,`)
2. Search for **`bugBeep.soundFilePath`**
3. Set it to the absolute path of your sound file

Or add it directly to your `settings.json`:

```json
{
  "bugBeep.soundFilePath": "/Users/you/Downloads/my-sound.mp3",
  "bugBeep.soundEnabled": false
}
```

Leave the value empty (`""`) or remove the setting to use the default built-in sound.

### Volume Behavior

Bug Beep automatically scales playback volume based on your current system volume to keep the alert subtle:

| System Volume | Playback Ratio |
|---------------|----------------|
| 90–100% | `0.03` |
| 80–89% | `0.05` |
| 70–79% | `0.1` |
| 50–69% | `0.15` |
| 30–49% | `0.3` |
| Below 30% | `1.0` (no reduction) |

Your system volume is never changed.

## Commands

| Command | Description |
|---------|-------------|
| `Bug Beep: Check and Play` | Manually check the active file and play the sound if issues are found |

## Known Issues

None at this time. If you run into problems, please [open an issue](https://github.com/knnemade99/bug-beep/issues) in the repository.

## Release Notes

### 0.2.0

- Added inline editor highlights on save — errors shown in red, unused imports/variables in dark yellow
- Highlights automatically clear when you start editing
- Added `bugBeep.soundEnabled` setting to toggle sound on/off (highlights still work when sound is disabled)

### 0.1.0

- Added cross-platform support for Windows and Linux
- Added custom sound file setting (`bugBeep.soundFilePath`)
- Added smart volume scaling based on system volume

### 0.0.1

- Initial release (macOS only)

---

**Enjoy coding with Bug Beep!**
