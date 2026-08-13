## Version 1.1

### Fixed

- Formatting no longer empties the document when md-fixup exits successfully
  without writing anything to standard output
- md-fixup is now found in `/opt/homebrew/bin` and `/usr/local/bin` when Nova's
  inherited PATH does not include them
- Toggling "Format on Save" now takes effect on already-open documents, in both
  directions
- The first format on a new install no longer fails when the extension's
  storage directory does not exist yet
- Temporary files are written to the extension's private storage instead of a
  shared location in `/tmp`

### Changed

- "Format Document" now appears in the Editor menu; "Format Workspace" remains
  in the Extensions menu
- Settings can now be overridden per-project in Project Settings. "Format on
  Save" and "Reverse Emphasis" are three-way there — On, Off, or Use Global
  Setting — so a project can turn a global setting off as well as on
- The extension also activates in workspaces containing Markdown files, so
  "Format Workspace" works before a Markdown file is opened

## Version 1.0

Initial release

### Features

- Format Markdown files using md-fixup
- Manual "Format Document" command
- "Format Workspace" command to format all open Markdown files
- Format on save (configurable)
- Configuration options:
  - Custom executable path
  - Text wrap width
  - Skip specific rules
  - Reverse emphasis markers
  - Additional command-line arguments
