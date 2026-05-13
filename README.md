# Extension Exporter

**Extension Exporter** is a powerful yet lightweight VS Code extension designed to help you back up and synchronize your installed extensions across different machines and IDEs. 

Whether you're switching to a new laptop, setting up a fresh environment, or moving between VS Code, Cursor, Windsurf, or Antigravity, this extension ensures that your favorite tools come with you effortlessly.

## 🚀 Features

- **One-Click Export**: Export a clean list of all your installed (non-builtin) extensions instantly.
- **One-Click Import**: Directly install extensions from an exported `extensions.txt` file straight from your IDE Command Palette—no terminal required!
- **Cross-IDE Compatibility**: Automatically detects your current environment (VS Code, Cursor, Windsurf, Antigravity) and generates tailored installation scripts.
- **Ready-to-Use Backup Scripts**: Also generates `install.ps1` and `install.sh` so you have terminal backup options.

## 🛠️ Usage

1. Open the Command Palette (`Ctrl+Shift+P` on Windows/Linux, `Cmd+Shift+P` on Mac).
2. Type and run: **`Extension Exporter: Export Installed Extensions`**.
3. A folder dialog will appear. Select the destination folder where you want your backup files saved.
4. The extension will generate the following files in the chosen folder:
   - `extensions.txt`
   - `install.ps1`
   - `install.sh`

### Restoring on a new machine

The easiest way to restore your extensions is directly inside the IDE:
1. Open the Command Palette and run: **`Extension Exporter: Import Extensions`**.
2. Select your exported `extensions.txt` file.
3. Sit back and watch as the extension installs everything for you with a progress bar!

**Alternative: Using Terminal Scripts**
If you prefer the terminal, you can also copy the exported folder to your new machine, open a terminal there, and run the generated scripts:
- **Windows**: `.\install.ps1`
- **Mac/Linux**: `./install.sh`

> **Tip**: If you exported your extensions from VS Code but want to install them into a different IDE (like Cursor), simply open the `install.ps1` or `install.sh` file and change the CLI command variable at the top of the file!

## ⚙️ Requirements

No external dependencies are required. This extension uses the standard VS Code API to read your installed packages.

## 📝 Release Notes

See the [CHANGELOG.md](CHANGELOG.md) for details on recent updates.

---

*Made with ❤️ by Antigravity User.*
