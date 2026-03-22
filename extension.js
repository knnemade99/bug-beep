const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
const os = require("os");
const { exec, execSync } = require("child_process");
const DIAGNOSTIC_WAIT_MS = 3500;
const UNUSED_CODES = new Set([
  "6133",
  "6192",
  "6196",
  "no-unused-vars",
  "@typescript-eslint/no-unused-vars",
]);
const UNUSED_PATTERNS = [
  "unused",
  "never read",
  "never used",
  "declared but",
  "is assigned a value but never used",
];
// Sorted descending by min — first match wins
const VOLUME_RATIO_MAP = [
  { min: 90, ratio: 0.03 },
  { min: 80, ratio: 0.05 },
  { min: 70, ratio: 0.1 },
  { min: 50, ratio: 0.15 },
  { min: 30, ratio: 0.3 },
];
const platform = os.platform();
// --- Diagnostics ---
function isUnusedDiagnostic(diagnostic) {
  const msg = (diagnostic.message || "").toLowerCase();
  const code =
    diagnostic.code != null ? String(diagnostic.code).toLowerCase() : "";
  return (
    UNUSED_PATTERNS.some((p) => msg.includes(p)) ||
    UNUSED_CODES.has(code) ||
    code.includes("unused")
  );
}
function getDiagnosticsForUri(uri) {
  const direct = vscode.languages.getDiagnostics(uri);
  if (direct.length > 0) return direct;
  const targetStr = uri.toString();
  const targetPath = uri.fsPath;
  for (const [u, diags] of vscode.languages.getDiagnostics()) {
    if (u.toString() === targetStr || (targetPath && u.fsPath === targetPath))
      return diags;
  }
  return [];
}
function hasSoundTrigger(uri) {
  return getDiagnosticsForUri(uri).some(
    (d) =>
      isUnusedDiagnostic(d) || d.severity === vscode.DiagnosticSeverity.Error
  );
}
// --- Sound ---
function resolveSoundPath(context) {
  const userPath = vscode.workspace
    .getConfiguration("bugBeep")
    .get("soundFilePath", "");
  if (userPath && fs.existsSync(userPath)) return userPath;
  const builtIn = path.join(context.extensionPath, "sound", "beep.wav");
  if (fs.existsSync(builtIn)) return builtIn;
  if (platform === "darwin") return "/System/Library/Sounds/Ping.aiff";
  if (platform === "win32") return "C:\\Windows\\Media\\Windows Notify.wav";
  return "/usr/share/sounds/freedesktop/stereo/bell.oga";
}
function getSystemVolume() {
  try {
    if (platform === "darwin") {
      return parseInt(
        execSync("osascript -e 'output volume of (get volume settings)'")
          .toString()
          .trim(),
        10
      );
    }
    if (platform === "win32") {
      const raw = execSync(
        'powershell -Command "(Get-AudioDevice -PlaybackVolume)"'
      )
        .toString()
        .trim();
      return parseInt(raw, 10);
    }
    // Linux — try pactl
    const raw = execSync(
      "pactl get-sink-volume @DEFAULT_SINK@ | grep -oP '\\d+%' | head -1"
    )
      .toString()
      .trim();
    return parseInt(raw, 10);
  } catch {
    return -1;
  }
}
function getVolumeRatio(systemVol) {
  for (const { min, ratio } of VOLUME_RATIO_MAP) {
    if (systemVol >= min) return ratio;
  }
  return 1;
}
function playSound(context) {
  const soundPath = resolveSoundPath(context);
  const ratio = getVolumeRatio(getSystemVolume());
  try {
    if (platform === "darwin") {
      exec(`afplay -v ${ratio} "${soundPath}"`).unref();
    } else if (platform === "win32") {
      const vol = Math.round(ratio * 100) / 100;
      exec(
        `powershell -Command "Add-Type -AssemblyName PresentationCore; $p = New-Object System.Windows.Media.MediaPlayer; $p.Open([Uri]'${soundPath}'); $p.Volume = ${vol}; $p.Play(); Start-Sleep -Milliseconds 3000"`
      ).unref();
    } else {
      // Linux — try paplay with volume (0-65536), fallback to aplay
      const vol = Math.round(ratio * 65536);
      exec(`paplay --volume=${vol} "${soundPath}" 2>/dev/null || aplay "${soundPath}" 2>/dev/null`).unref();
    }
  } catch (_) {}
  vscode.window.showInformationMessage("Please fix the file");
}
// --- Lifecycle ---
function activate(context) {
  let pendingSaveUri = null;
  let pendingTimeout = null;
  function checkAndMaybePlay(uri) {
    if (!pendingSaveUri || uri.toString() !== pendingSaveUri.toString()) return;
    if (hasSoundTrigger(uri)) playSound(context);
    pendingSaveUri = null;
    if (pendingTimeout) {
      clearTimeout(pendingTimeout);
      pendingTimeout = null;
    }
  }
  context.subscriptions.push(
    vscode.languages.onDidChangeDiagnostics((e) => {
      if (!pendingSaveUri) return;
      for (const uri of e.uris) {
        if (uri.toString() === pendingSaveUri.toString()) {
          checkAndMaybePlay(uri);
          return;
        }
      }
    })
  );
  context.subscriptions.push(
    vscode.workspace.onDidSaveTextDocument((doc) => {
      if (pendingTimeout) clearTimeout(pendingTimeout);
      pendingSaveUri = doc.uri;
      pendingTimeout = setTimeout(() => {
        if (pendingSaveUri) checkAndMaybePlay(pendingSaveUri);
        pendingTimeout = null;
      }, DIAGNOSTIC_WAIT_MS);
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("bug-beep.play", () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) return;
      if (hasSoundTrigger(editor.document.uri)) playSound(context);
    })
  );
}
function deactivate() {}
module.exports = { activate, deactivate };

