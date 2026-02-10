<!--
👋 Hello! As Nova users browse the extensions library, a good README can help them understand what your extension does, how it works, and what setup or configuration it may require.

Not every extension will need every item described below. Use your best judgement when deciding which parts to keep to provide the best experience for your new users.

💡 Quick Tip! As you edit this README template, you can preview your changes by selecting **Extensions → Activate Project as Extension**, opening the Extension Library, and selecting "Nova md-fixup" in the sidebar.

Let's get started!
-->


**Nova-md-fixup** provides integration with [md-fixup][1], providing (configurable) linting for Markdown files. 

[1]: https://github.com/ttscoff/md-fixup

## Requirements

<!--
🎈 If your extension depends on external processes or tools that users will need to have, it's helpful to list those and provide links to their installers:
-->

Nova md-fixup requires some additional tools to be installed on your Mac:

- [md-fixup][1]

Follow the install instructions in the repo and make sure the install location is in Nova's PATH. 

## Usage

<!--
🎈 If users will interact with your extension manually, describe those options:
-->

To run Nova md-fixup:

- Select the **Editor → Nova md-fixup** menu item; or
- Open the command palette and type `Nova md-fixup`

<!--
🎈 Alternatively, if your extension runs automatically (as in the case of a validator), consider showing users what they can expect to see:
-->

Nova md-fixup runs any time you open a local project, automatically lints all open files, then reports errors and warnings in Nova's **Issues** sidebar and the editor gutter:

![](https://nova.app/images/en/light/tools/sidebars.png)

### Configuration

<!--
🎈 If your extension offers global- or workspace-scoped preferences, consider pointing users toward those settings. For example:
-->

To configure global preferences, open **Extensions → Extension Library...** then select Nova md-fixup's **Preferences** tab.

You can also configure preferences on a per-project basis in **Project → Project Settings...**
