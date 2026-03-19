# Bug Beep – VS Code Extension Quickstart

**Bug Beep** plays a sound **on save** when it detects problems in your file: errors, unused variables, or unused imports.

## What's in the folder

- This folder contains all of the files for the Bug Beep extension.
- `package.json` – The manifest that declares the extension (name, description, activation, etc.).
- `extension.js` – The main implementation. It subscribes to document save events and plays a sound when the current file has diagnostics (errors, unused variables, unused imports).

## Get up and running

- Press `F5` to open a new window with the extension loaded.
- Open a file that has an error, unused variable, or unused import, then **save** the file. You should hear the beep.
- Set breakpoints in `extension.js` to debug (e.g. in the save handler or diagnostic check).
- Check the Debug Console for any `console.log` output from the extension.

## Make changes

- After editing `extension.js`, relaunch from the debug toolbar or reload the Extension Development Host window (`Ctrl+R` or `Cmd+R` on Mac) to pick up changes.

## Explore the API

- Open `node_modules/@types/vscode/index.d.ts` to see the full VS Code API (e.g. `vscode.workspace.onDidSaveTextDocument`, `vscode.languages.getDiagnostics`).

## Run tests

- Install the [Extension Test Runner](https://marketplace.visualstudio.com/items?itemName=ms-vscode.extension-test-runner).
- Open the Testing view and click **Run Test**, or use `Ctrl/Cmd + ; A`.
- Edit `test/extension.test.js` or add test files under `test/` (e.g. `**.test.js`).

## Go further

- [UX guidelines](https://code.visualstudio.com/api/ux-guidelines/overview) for extensions.
- [Publish your extension](https://code.visualstudio.com/api/working-with-extensions/publishing-extension) on the marketplace.
- [CI for extensions](https://code.visualstudio.com/api/working-with-extensions/continuous-integration).
- [Issue reporting](https://code.visualstudio.com/api/get-started/wrapping-up#issue-reporting) for user feedback.
