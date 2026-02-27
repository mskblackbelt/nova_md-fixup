const Config = require("./config");
const Formatter = require("./formatter");

exports.activate = function() {
    console.log("Nova md-fixup extension activating...");
    
    const formatter = new Formatter();

    console.info(`md-fixup executable: ${Config.executablePath()}`);
    console.info(`Wrap width: ${Config.wrapWidth()}`);
    console.info(`Format on save: ${Config.formatOnSave()}`);

    // Register format document command
    nova.commands.register("nova-md-fixup.formatDocument", () => {
        console.log("Format Document command triggered");
        const editor = nova.workspace.activeTextEditor;
        if (!editor) {
            console.error("No active editor");
            nova.workspace.showErrorMessage("No active editor");
            return;
        }
        console.log(`Formatting document: ${editor.document.path}`);
        formatter.format(editor);
    });

    // Register format workspace command
    nova.commands.register("nova-md-fixup.formatWorkspace", () => {
        console.log("Format Workspace command triggered");
        formatter.formatWorkspace();
    });

    // Set up format-on-save if enabled
    nova.workspace.onDidAddTextEditor((editor) => {
        if (editor.document.syntax !== "markdown") {
            return;
        }
        
        if (Config.formatOnSave()) {
            console.log(`Setting up format-on-save for: ${editor.document.path}`);
            editor.onWillSave(() => formatter.provideFormat(editor));
        }
    });

    // Watch for config changes to format-on-save
    for (const config of [nova.config, nova.workspace.config]) {
        config.observe(`${nova.extension.identifier}.formatOnSave`, () => {
            console.info(`Format on save changed to: ${Config.formatOnSave()}`);
        });
    }
    
    console.log("Nova md-fixup extension activated successfully");
};

exports.deactivate = function() {
    console.log("Nova md-fixup extension deactivating...");
};

