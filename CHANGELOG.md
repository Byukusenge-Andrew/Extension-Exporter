# Change Log

All notable changes to the "Extension Exporter" extension will be documented in this file.

## [0.0.1] - 2026-05-13
### Added
- Initial release of the extension.
- Command `Extension Exporter: Export Installed Extensions`.
- Command `Extension Exporter: Import Extensions` for installing directly from an `extensions.txt` file inside the IDE.
- Generates `extensions.txt` containing all non-builtin extensions.
- Generates `install.ps1` for Windows mass-installation.
- Generates `install.sh` for Mac/Linux mass-installation.
- Auto-detects running IDE (VS Code, Cursor, Windsurf, Antigravity) to properly format installation scripts.
