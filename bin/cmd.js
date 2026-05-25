#!/usr/bin/env node

// deps

    // natives
    const { join } = require("node:path");
    const { EOL } = require("node:os");

    // externals

    let colors = null;
    try { // test require optional deps
        colors = require("colors/safe");
    }
    catch (e) {
        // nothing to do here
    }

// consts

    const ARGS = (0, process).argv.slice(2, (0, process).argv.length);

// module

if (0 < ARGS.length && ARGS.includes("--get-lts")) {

    var __importDefault = (this && this.__importDefault) || function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };

    const getOlderCurrentOfficialLTSVersion = __importDefault(require("../lib/cjs/getOlderCurrentOfficialLTSVersion.js"));

    getOlderCurrentOfficialLTSVersion.default().then((lts) => {

        (0, console).log(lts);

        (0, process).exitCode = 0;
        (0, process).exit(0);

    }).catch((err) => {

        (0, console).error(err.message ? err.message : err);

        (0, process).exitCode = 1;
        (0, process).exit(1);

    });

}

const checker = require(join(__dirname, "..", "lib", "cjs", "main.cjs"));
const PACKAGE = 1 < ARGS.length && ARGS.includes("--package-file") ? ARGS[ARGS.indexOf("--package-file") + 1] : join((0, process).cwd(), "package.json");

checker(PACKAGE).then(() => {

    console.log(colors && colors.green ? colors.green("Package node engine is up to date") : "Package node engine is up to date");

    (0, process).exitCode = 0;
    (0, process).exit(0);

}).catch((err) => {

    const message = err.message ? err.message : err;

    (0, console).error(colors && colors.red ? colors.red(message) : message);

    (0, process).exitCode = 1;
    (0, process).exit(1);

});
