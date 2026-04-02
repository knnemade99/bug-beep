# Change Log

All notable changes to the "bug-beep" extension will be documented in this file.

## [0.2.0] - 2026-04-02

### Added
- Inline editor highlights on save: red background for errors, dark yellow for unused imports/variables
- Highlights auto-clear when editing resumes
- `bugBeep.soundEnabled` setting to toggle sound playback on/off (highlights remain active)

## [0.1.0] - 2026-03-19

### Added
- Cross-platform support: Windows (PowerShell MediaPlayer) and Linux (PulseAudio/ALSA)
- Custom sound file via `bugBeep.soundFilePath` setting
- Smart volume scaling based on system volume

## [0.0.1] - 2026-03-19

### Added
- Initial release
- Plays a sound on save when errors, unused variables, or unused imports are detected
- macOS support via `afplay`
