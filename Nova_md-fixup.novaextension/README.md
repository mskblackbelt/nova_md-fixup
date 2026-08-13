**Nova md-fixup** provides integration with
[md-fixup](https://github.com/ttscoff/md-fixup), a powerful Markdown formatter
by Brett Terpstra that wraps text and ensures proper formatting.

## Requirements

Nova md-fixup requires md-fixup to be installed on your Mac:

* [md-fixup](https://github.com/ttscoff/md-fixup) - Follow the installation
  instructions in the repository

**Important:** The `md-fixup` binary needs to be accessible in Nova. There are a
few default locations coded in, and the extension will check Nova's PATH. If the
defaults don't work, the full path can be specified in the extension settings,
_e.g.,_ `/opt/homebrew/bin/md-fixup` or `/usr/local/bin/md-fixup` (to find the
path to `md-fixup` , run `which md-fixup` in a terminal window).

## Usage

Nova md-fixup provides two commands:

* **Format Document** - Format the current Markdown file
* **Format Workspace** - Format all open Markdown files

To format a document:

* Select **Editor → Nova md-fixup → Format Document**; or
* Open the command palette and type "Format Document"

To format every open Markdown file, select **Extensions → Nova md-fixup →
Format Workspace**.

You can also enable **Format on Save** in the extension preferences to
automatically format Markdown files when saving.

### Configuration

To configure global preferences, open **Extensions → Extension Library...** then
select Nova md-fixup's **Preferences** tab.

You can also configure preferences on a per-project basis in **Project → Project
Settings...** Project settings override the global ones; leave a text field
empty, or a toggle set to **Use Global Setting**, to inherit the global value.

Available settings:

* **Executable Path** - Path to md-fixup (leave empty to use PATH)
* **Wrap Width** - Text wrap width in characters (default: 60)
* **Skip Rules** - Comma-separated list of rules to skip (e.g.,
  "wrap,typography")
* **Format on Save** - Automatically format when saving (default: off)
* **Reverse Emphasis** - Use ** for bold and _ for italic (default: off)
* **Additional Arguments** - Custom command-line arguments

### md-fixup Rules

md-fixup applies 33 formatting rules including:

* Normalize line endings and whitespace
* Ensure proper spacing around headers, lists, and code blocks
* Wrap text at specified width
* Normalize bold/italic markers
* Fix typography (smart quotes, em dashes, etc.)
* Format tables
* And many more...

See the [md-fixup documentation](https://github.com/ttscoff/md-fixup) for the
complete list of rules and their keywords. If rules are specified in a user's 
global `.md-fixup` file, they should be used.

