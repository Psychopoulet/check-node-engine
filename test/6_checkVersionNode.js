// deps

    // natives
    const { join } = require("node:path");
    const { doesNotReject, rejects } = require("node:assert");

    // locals
    const checkVersionNode = require("../lib/cjs/checkVersionNode.js").default;

// tests

describe("checkVersionNode", () => {

    it("should resolve for a package object with a sufficient engines.node", () => {

        return doesNotReject(checkVersionNode({
            "engines": {
                "node": ">=22.23.2"
            }
        }));

    });

    it("should resolve for an existing package.json path", () => {
        return doesNotReject(checkVersionNode(join(__dirname, "..", "package.json")));
    });

    it("should reject when engines.node minimum is below the older LTS", () => {

        return rejects(
            checkVersionNode({
                "engines": {
                    "node": ">=0.10.0"
                }
            }),
            (err) => {

                return err instanceof Error
                    && err.message.includes("engines.node")
                    && err.message.includes("older current official LTS");

            }
        );

    });

    it("should reject for an invalid source type", () => {

        return rejects(
            checkVersionNode(42),
            (err) => {

                return err instanceof Error
                    && err.message.includes("not a string or a package type");

            }
        );

    });

    it("should reject for a missing package file", () => {

        return rejects(
            checkVersionNode(join(__dirname, "this-file-does-not-exist.package.json")),
            (err) => {

                return err instanceof Error
                    && err.message.includes("is not a valid file");

            }
        );

    });

    it("should reject for a package object without engines.node", () => {

        return rejects(
            checkVersionNode({}),
            (err) => {

                return err instanceof Error
                    && err.message.includes("engines");

            }
        );

    });

});
