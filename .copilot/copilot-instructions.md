# Copilot Instructions for Nova md-fixup Extension

## Project Overview

This is a Nova editor extension that integrates [md-fixup](https://github.com/ttscoff/md-fixup) for Markdown linting. Nova extensions use JavaScript and run within the Nova editor's extension runtime.

## Extension Architecture

### Key Files

- **extension.json**: Extension manifest defining metadata, commands, activation events, entitlements, and configuration options
- **Scripts/main.js**: Entry point with `activate()` and `deactivate()` lifecycle hooks

### Nova Extension Patterns

Commands are registered using `nova.commands.register(identifier, handler)` where the identifier must match those declared in `extension.json`:

```javascript
nova.commands.register("extension-id.commandName", (workspace) => {
    // Command implementation
});
```

The extension activates based on `activationEvents` in the manifest. This extension activates on `onLanguage:markdown` and `onWorkspaceContains:*.md`.

### External Process Integration

When calling external tools (like md-fixup), use Nova's `Process` API:

```javascript
var process = new Process("/path/to/tool", {
    args: [],
    env: {},
    cwd: workspace.path
});

process.onStdout((data) => { /* handle output */ });
process.onStderr((data) => { /* handle errors */ });
process.onDidExit((status) => { /* cleanup */ });

process.start();
```

## Required Dependencies

Users must install [md-fixup](https://github.com/ttscoff/md-fixup) externally and ensure it's in Nova's PATH. The extension requires these entitlements:
- `filesystem: readwrite` - to read/write Markdown files
- `process: true` - to execute md-fixup

## Extension Distribution

Nova extensions are distributed as `.novaextension` directories. The entire project directory structure is the extension package.
