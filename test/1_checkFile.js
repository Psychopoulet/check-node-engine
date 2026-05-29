// deps

    // natives
    const { join } = require("node:path");
    const { doesNotReject, rejects } = require("node:assert");

    // locals
    const checkFile = require("../lib/cjs/utils/checkFile.js").default;

// tests

describe("checkFile", () => {

    it("should resolve for an existing file", () => {
        return doesNotReject(checkFile(join(__dirname, "..", "package.json")));
    });

    it("should reject for a missing path", () => {

        return rejects(
            checkFile(join(__dirname, "this-file-does-not-exist.package.json")),
            (err) => {

                return err instanceof Error
                    && err.message.includes("is not a valid file");

            }
        );

    });

});
