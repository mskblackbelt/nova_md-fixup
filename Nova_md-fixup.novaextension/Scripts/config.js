class Config {
    static get extensionId() {
        return nova.extension.identifier;
    }

    static executablePath() {
        const userPath = this.getText("executablePath");
        if (userPath !== null) {
            return userPath;
        }

        // Default to md-fixup - will be resolved via /usr/bin/env using PATH
        return "md-fixup";
    }

    static wrapWidth() {
        // Null when not explicitly set, so md-fixup can use its own config/defaults
        return this.getText("wrapWidth");
    }

    static skipRules() {
        return this.getText("skipRules");
    }

    static formatOnSave() {
        return this.getBoolean("formatOnSave");
    }

    static reverseEmphasis() {
        return this.getBoolean("reverseEmphasis");
    }

    static additionalArguments() {
        return this.getText("additionalArguments");
    }

    // Treats an empty string the same as an unset value, so a cleared text
    // field does not read as a meaningful override.
    static isSet(value) {
        if (value === null || value === undefined) {
            return false;
        }
        if (typeof value === "string") {
            return value.trim() !== "";
        }
        return true;
    }

    // Each text setting resolves on its own: a project value replaces the
    // global one for that field alone, and an empty project field inherits the
    // global value rather than clearing it. Returns null when neither level
    // sets the field.
    static getText(key) {
        const fullKey = `${this.extensionId}.${key}`;
        const override = nova.workspace.config.get(fullKey);
        if (this.isSet(override)) {
            return override;
        }
        const value = nova.config.get(fullKey);
        return this.isSet(value) ? value : null;
    }

    // Boolean settings are declared globally as a checkbox but per-project as a
    // three-way enum. A workspace checkbox cannot distinguish "unchecked" from
    // "not set" — both read as unset — so a project could turn a global setting
    // on but never off. The explicit "inherit" value fixes that.
    static getBoolean(key) {
        const fullKey = `${this.extensionId}.${key}`;
        const override = nova.workspace.config.get(fullKey);
        if (override === "on") {
            return true;
        }
        if (override === "off") {
            return false;
        }
        return nova.config.get(fullKey) === true;
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
