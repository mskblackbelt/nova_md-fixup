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
                const fullRange = new Range(0, document.length);
                await editor.edit((edit) => {
                    edit.replace(fullRange, formatted);
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

    runMdFixup(content) {
        return new Promise((resolve, reject) => {
            const executable = Config.executablePath();
            const args = Config.buildArguments();

            // Create temp file for input
            const tmpDir = nova.path.join(nova.extension.workspaceStoragePath || '/tmp', 'md-fixup');
            const tmpFile = nova.path.join(tmpDir, `temp-${Date.now()}.md`);
            
            try {
                // Ensure temp directory exists
                if (!nova.fs.access(tmpDir, nova.fs.F_OK)) {
                    nova.fs.mkdir(tmpDir);
                }
                
                // Write content to temp file
                const file = nova.fs.open(tmpFile, 'w');
                file.write(content);
                file.close();
                
                // Set up environment with PATH from Nova's configuration
                const env = {
                    PATH: nova.environment.PATH || [
                        '/opt/homebrew/bin',
                        '/usr/local/bin',
                        '/usr/bin',
                        '/bin'
                    ].join(':')
                };
                
                // Run md-fixup with the temp file
                const mdFixupProcess = new Process("/usr/bin/env", {
                    args: [executable, ...args, tmpFile],
                    env: env
                });

                let stdout = "";
                let stderr = "";

                mdFixupProcess.onStdout((data) => {
                    stdout += data;
                });

                mdFixupProcess.onStderr((data) => {
                    stderr += data;
                });

                mdFixupProcess.onDidExit((status) => {
                    // Clean up temp file
                    try {
                        nova.fs.remove(tmpFile);
                    } catch (e) {
                        console.warn("Failed to remove temp file:", e);
                    }
                    
                    if (status === 0) {
                        resolve(stdout);
                    } else {
                        const errorMsg = stderr || `Process exited with status ${status}`;
                        reject(new Error(errorMsg));
                    }
                });

                mdFixupProcess.start();
            } catch (error) {
                console.error("Error in runMdFixup:", error);
                // Clean up on error
                try {
                    if (nova.fs.access(tmpFile, nova.fs.F_OK)) {
                        nova.fs.remove(tmpFile);
                    }
                } catch (e) {
                    // Ignore cleanup errors
                }
                reject(error);
            }
        });
    }
}

module.exports = Formatter;
