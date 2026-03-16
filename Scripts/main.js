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
        
        if (Config.formatOnSave()) {
            editor.onWillSave(() => formatter.format(editor));
        }
    });
};

exports.deactivate = function() {
    // Cleanup if needed
};
