const Config = require("./config");
const Formatter = require("./formatter");

exports.activate = function() {
    const formatter = new Formatter();

    // Register format document command
    nova.commands.register("nova-md-fixup.formatDocument", () => {
        const editor = nova.workspace.activeTextEditor;
        if (!editor) {
            nova.workspace.showErrorMessage("No active editor");
            return;
        }
        formatter.format(editor);
    });

    // Register format workspace command
    nova.commands.register("nova-md-fixup.formatWorkspace", () => {
        formatter.formatWorkspace();
    });

    // Set up format-on-save if enabled
    nova.workspace.onDidAddTextEditor((editor) => {
        if (editor.document.syntax !== "markdown") {
            return;
        }
        
        // Read the preference at save time, not here: an editor opened while
        // Format on Save was off would otherwise never pick up the setting
        // being turned on, and one opened while it was on would keep
        // formatting after it was turned off.
        editor.onWillSave(() => {
            if (!Config.formatOnSave()) {
                return;
            }
            // Returned so Nova waits for the edit before writing the file.
            return formatter.format(editor);
        });
    });
};

exports.deactivate = function() {
    // Cleanup if needed
};
