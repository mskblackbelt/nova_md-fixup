const Config = require("./config");
const Formatter = require("./formatter");

exports.activate = function() {
    const formatter = new Formatter();

    console.info(`md-fixup executable: ${Config.executablePath()}`);
    console.info(`Wrap width: ${Config.wrapWidth()}`);
    console.info(`Format on save: ${Config.formatOnSave()}`);

    // Register format document command
    nova.commands.register("nova-md-fixup.formatDocument", (editor) => {
        formatter.format(editor);
    });

    // Register format workspace command
    nova.commands.register("nova-md-fixup.formatWorkspace", () => {
        formatter.formatWorkspace();
    });

    // Set up format-on-save if enabled
    nova.workspace.onDidAddTextEditor((editor) => {
        if (editor.document.syntax !== "markdown" || !Config.formatOnSave()) {
            return;
        }
        editor.onWillSave(() => formatter.provideFormat(editor));
    });

    // Watch for config changes to format-on-save
    for (const config of [nova.config, nova.workspace.config]) {
        config.observe(`${nova.extension.identifier}.formatOnSave`, () => {
            console.info(`Format on save changed to: ${Config.formatOnSave()}`);
        });
    }
};

exports.deactivate = function() {
    // Clean up if needed
};

