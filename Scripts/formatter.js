const Config = require("./config");

class Formatter {
    constructor() {
        this.formatting = new Set();
    }

    async format(editor) {
        if (!editor || editor.document.syntax !== "markdown") {
            return;
        }

        const document = editor.document;
        const documentPath = document.path;

        // Prevent concurrent formatting of the same document
        if (this.formatting.has(documentPath)) {
            return;
        }

        this.formatting.add(documentPath);

        try {
            const content = document.getTextInRange(new Range(0, document.length));
            const formatted = await this.runMdFixup(content);

            if (formatted !== null && formatted !== content) {
                await editor.edit((textEditor) => {
                    const fullRange = new Range(0, textEditor.document.length);
                    textEditor.replace(fullRange, formatted);
                });
            }
        } catch (error) {
            nova.workspace.showErrorMessage(`md-fixup error: ${error.message}`);
            console.error("md-fixup formatting error:", error);
        } finally {
            this.formatting.delete(documentPath);
        }
    }

    async formatWorkspace() {
        const editors = nova.workspace.textEditors.filter(
            (editor) => editor.document.syntax === "markdown"
        );

        if (editors.length === 0) {
            nova.workspace.showInformativeMessage("No Markdown files open");
            return;
        }

        for (const editor of editors) {
            await this.format(editor);
        }

        nova.workspace.showInformativeMessage(
            `Formatted ${editors.length} Markdown file${editors.length > 1 ? 's' : ''}`
        );
    }

    async provideFormat(editor) {
        await this.format(editor);
    }

    runMdFixup(content) {
        return new Promise((resolve, reject) => {
            const executable = Config.executablePath();
            const args = Config.buildArguments();

            const process = new Process(executable, {
                args: args,
                stdio: "pipe"
            });

            let stdout = "";
            let stderr = "";

            process.onStdout((data) => {
                stdout += data;
            });

            process.onStderr((data) => {
                stderr += data;
            });

            process.onDidExit((status) => {
                if (status === 0) {
                    resolve(stdout);
                } else {
                    const errorMsg = stderr || `Process exited with status ${status}`;
                    reject(new Error(errorMsg));
                }
            });

            try {
                process.start();
                
                // Write content to stdin
                const writer = process.stdin.getWriter();
                writer.ready.then(() => {
                    writer.write(content);
                    writer.close();
                });
            } catch (error) {
                reject(error);
            }
        });
    }
}

module.exports = Formatter;
