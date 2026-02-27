**Nova md-fixup** provides integration with [md-fixup][1], a powerful Markdown formatter by Brett Terpstra that wraps text and ensures proper formatting.

[1]: https://github.com/ttscoff/md-fixup

## Requirements

Nova md-fixup requires md-fixup to be installed on your Mac:

- [md-fixup][1] - Follow the installation instructions in the repository

**Important:** If md-fixup is not in a standard location, you'll need to configure the full path in the extension settings (e.g., `/opt/homebrew/bin/md-fixup` or `/usr/local/bin/md-fixup`).

To find the path to md-fixup, run `which md-fixup` in Terminal.

## Usage

Nova md-fixup provides two commands:

- **Format Document** - Format the current Markdown file
- **Format Workspace** - Format all open Markdown files

To format a document:

- Select **Editor → Nova md-fixup → Format Document**; or
- Open the command palette and type "Format Document"

You can also enable **Format on Save** in the extension preferences to automatically format Markdown files when saving.

### Configuration

To configure global preferences, open **Extensions → Extension Library...** then select Nova md-fixup's **Preferences** tab.

You can also configure preferences on a per-project basis in **Project → Project Settings...**

Available settings:

- **Executable Path** - Path to md-fixup (leave empty to use PATH)
- **Wrap Width** - Text wrap width in characters (default: 60)
- **Skip Rules** - Comma-separated list of rules to skip (e.g., "wrap,typography")
- **Format on Save** - Automatically format when saving (default: off)
- **Reverse Emphasis** - Use ** for bold and _ for italic (default: off)
- **Additional Arguments** - Custom command-line arguments

### md-fixup Rules

md-fixup applies 33 formatting rules including:

- Normalize line endings and whitespace
- Ensure proper spacing around headers, lists, and code blocks
- Wrap text at specified width
- Normalize bold/italic markers
- Fix typography (smart quotes, em dashes, etc.)
- Format tables
- And much more...

See the [md-fixup documentation][1] for the complete list of rules and their keywords.
