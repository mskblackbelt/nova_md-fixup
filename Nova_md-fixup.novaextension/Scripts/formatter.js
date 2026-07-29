const Config = require("./config");

// nova.fs.mkdir() is not recursive, and Nova creates the extension storage
// directories lazily, so the parent may not exist on a fresh install.
function ensureDirectory(path) {
    if (nova.fs.access(path, nova.fs.F_OK)) {
        return;
    }
    const parent = nova.path.dirname(path);
    if (parent && parent !== path) {
        ensureDirectory(parent);
    }
    nova.fs.mkdir(path);
}

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

            if (formatted !== content) {
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

            // Create temp file for input. Both storage paths are private to this
            // extension; a shared location like /tmp would let any local user
            // pre-create or symlink the path we are about to write to.
            const storageRoot = nova.extension.workspaceStoragePath
                || nova.extension.globalStoragePath;
            const tmpDir = nova.path.join(storageRoot, 'md-fixup');
            const tmpFile = nova.path.join(tmpDir, `temp-${Date.now()}.md`);

            try {
                ensureDirectory(tmpDir);

                // Write content to temp file
                const file = nova.fs.open(tmpFile, 'w');
                file.write(content);
                file.close();
                
                // Search Nova's inherited PATH first, then the common install
                // locations. Nova launched from Finder inherits the launchd PATH,
                // which omits both Homebrew prefixes, so these must be appended
                // rather than used only as a fallback.
                const searchPaths = (nova.environment.PATH || "").split(":");
                for (const dir of ['/opt/homebrew/bin', '/usr/local/bin', '/usr/bin', '/bin']) {
                    if (!searchPaths.includes(dir)) {
                        searchPaths.push(dir);
                    }
                }
                const env = {
                    PATH: searchPaths.filter((dir) => dir !== "").join(":")
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
                        // A run that exits cleanly but emits nothing means md-fixup
                        // never wrote the document to stdout (e.g. an in-place flag
                        // in Additional Arguments). Treat it as a failure rather
                        // than replacing the document with an empty string.
                        if (stdout === "" && content !== "") {
                            reject(new Error(
                                "md-fixup produced no output. Check Additional Arguments — " +
                                "md-fixup must write the formatted document to stdout."
                            ));
                            return;
                        }
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
