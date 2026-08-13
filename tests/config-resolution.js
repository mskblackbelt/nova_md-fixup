// Checks how Config resolves settings between the global and project levels.
// Stubs Nova's config API, so it runs anywhere Node is available:
//
//     node tests/config-resolution.js
//
// Exits non-zero if any check fails.

const path = require("path");

const ID = "design.berrybrook.nova-md-fixup";
let globalCfg = {};
let wsCfg = {};

global.nova = {
    extension: { identifier: ID },
    config: { get: (k) => (k in globalCfg ? globalCfg[k] : null) },
    workspace: { config: { get: (k) => (k in wsCfg ? wsCfg[k] : null) } }
};

const Config = require(
    path.join(__dirname, "..", "Nova_md-fixup.novaextension", "Scripts", "config.js")
);
const k = (s) => `${ID}.${s}`;

let failed = 0;
function check(label, actual, expected) {
    const a = JSON.stringify(actual);
    const e = JSON.stringify(expected);
    const ok = a === e;
    if (!ok) {
        failed++;
    }
    console.log(`${ok ? "PASS" : "FAIL"}  ${label}`);
    if (!ok) {
        console.log(`        got ${a}, want ${e}`);
    }
}

// Text settings: each field resolves on its own, and a project value replaces
// the global one for that field rather than adding to it.
globalCfg = {
    [k("skipRules")]: "typography,wrap",
    [k("wrapWidth")]: 80,
    [k("executablePath")]: "/opt/homebrew/bin/md-fixup",
    [k("additionalArguments")]: "--replacements"
};
wsCfg = { [k("skipRules")]: "hr-stars" };
check("project skipRules replaces, does not append",
    Config.buildArguments(), ["--width", "80", "--skip", "hr-stars", "--replacements"]);
check("other fields keep their global values",
    Config.executablePath(), "/opt/homebrew/bin/md-fixup");

wsCfg = { [k("wrapWidth")]: 40 };
check("project width overrides only width",
    Config.buildArguments(), ["--width", "40", "--skip", "typography,wrap", "--replacements"]);

wsCfg = {};
check("empty project inherits every global",
    Config.buildArguments(), ["--width", "80", "--skip", "typography,wrap", "--replacements"]);

// A field typed into and then cleared stores "", which must read as unset so
// that inheritance resumes instead of the empty value shadowing the global.
wsCfg = { [k("skipRules")]: "   " };
check("whitespace-only project field inherits global",
    Config.buildArguments(), ["--width", "80", "--skip", "typography,wrap", "--replacements"]);
wsCfg = { [k("executablePath")]: "" };
check("cleared project path inherits global path",
    Config.executablePath(), "/opt/homebrew/bin/md-fixup");

globalCfg = {};
wsCfg = {};
check("unset everywhere emits no arguments", Config.buildArguments(), []);
check("unset path falls back to PATH lookup", Config.executablePath(), "md-fixup");

wsCfg = { [k("wrapWidth")]: 0 };
check("wrapWidth 0 is honored", Config.buildArguments(), ["--width", "0"]);

// Booleans are three-way at the project level, because an unchecked box cannot
// be told apart from an unset one and so could never turn a global setting off.
globalCfg = { [k("formatOnSave")]: true, [k("reverseEmphasis")]: true };
wsCfg = { [k("formatOnSave")]: "off", [k("skipRules")]: "hr-stars" };
check("project 'off' beats global true", Config.formatOnSave(), false);
check("text override leaves booleans alone", Config.reverseEmphasis(), true);

wsCfg = { [k("formatOnSave")]: "inherit" };
check("project 'inherit' falls through to global", Config.formatOnSave(), true);

globalCfg = { [k("formatOnSave")]: false };
wsCfg = { [k("formatOnSave")]: "on" };
check("project 'on' beats global false", Config.formatOnSave(), true);

if (failed > 0) {
    console.log(`\n${failed} check(s) failed.`);
    process.exit(1);
}
console.log("\nAll checks passed.");
