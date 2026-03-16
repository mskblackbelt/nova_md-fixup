class Config {
    static get extensionId() {
        return nova.extension.identifier;
    }

    static executablePath() {
        const userPath = this.get("executablePath");
        if (userPath && userPath.trim() !== "") {
            return userPath;
        }
        
        // Default to md-fixup - will be resolved via /usr/bin/env using PATH
        return "md-fixup";
    }

    static wrapWidth() {
        const width = this.get("wrapWidth");
        // Return null if not explicitly set so md-fixup can use its own config/defaults
        return width !== null && width !== undefined ? width : null;
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

        // Add wrap width only if explicitly set by user
        // Otherwise let md-fixup use its own config file/defaults
        const width = this.wrapWidth();
        if (width !== null && width !== undefined) {
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
