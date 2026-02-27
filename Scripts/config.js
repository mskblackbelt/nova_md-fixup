class Config {
    static get extensionId() {
        return nova.extension.identifier;
    }

    static executablePath() {
        const userPath = this.get("executablePath");
        if (userPath && userPath.trim() !== "") {
            return userPath;
        }
        
        // Try common installation locations
        const commonPaths = [
            "/usr/bin/env md-fixup", // Fall back to PATH
            // "/opt/homebrew/bin/md-fixup",
            "/usr/local/bin/md-fixup",
            "/usr/bin/md-fixup"
        ];
        
        for (const path of commonPaths) {
            if (path.startsWith("/")) {
                // Check if file exists
                try {
                    if (nova.fs.access(path, nova.fs.F_OK)) {
                        console.log(`Found md-fixup at: ${path}`);
                        return path;
                    }
                } catch (e) {
                    // Path doesn't exist, try next
                }
            }
        }
        
        // Fall back to just "md-fixup" and hope it's in PATH
        return "md-fixup";
    }

    static wrapWidth() {
        const width = this.get("wrapWidth");
        return width !== null && width !== undefined ? width : 60;
    }

    static skipRules() {
        const rules = this.get("skipRules");
        return rules && rules.trim() !== "" ? rules : null;
    }

    static formatOnSave() {
        return this.get("formatOnSave") || false;
    }

    static reverseEmphasis() {
        return this.get("reverseEmphasis") || false;
    }

    static additionalArguments() {
        const args = this.get("additionalArguments");
        return args && args.trim() !== "" ? args : null;
    }

    static get(key) {
        const fullKey = `${this.extensionId}.${key}`;
        // Check workspace config first, then fall back to global config
        let value = nova.workspace.config.get(fullKey);
        if (value === null || value === undefined) {
            value = nova.config.get(fullKey);
        }
        return value;
    }

    static buildArguments() {
        const args = [];

        // Add wrap width
        const width = this.wrapWidth();
        if (width) {
            args.push("--width", String(width));
        }

        // Add skip rules
        const skipRules = this.skipRules();
        if (skipRules) {
            args.push("--skip", skipRules);
        }

        // Add reverse emphasis
        if (this.reverseEmphasis()) {
            args.push("--reverse-emphasis");
        }

        // Add additional arguments
        const additionalArgs = this.additionalArguments();
        if (additionalArgs) {
            // Split by spaces but respect quoted strings
            const parsed = additionalArgs.match(/(?:[^\s"]+|"[^"]*")+/g) || [];
            args.push(...parsed.map(arg => arg.replace(/^"(.*)"$/, '$1')));
        }

        return args;
    }
}

module.exports = Config;
