// deps

    // natives
    const { strictEqual, throws } = require("node:assert");

    // locals
    const getEngineNode = require("../lib/cjs/utils/getEngineNode.js").default;

// tests

describe("getEngineNode", () => {

    it("should return engines.node from a valid package", () => {

        strictEqual(getEngineNode({
            "engines": {
                "node": ">=22.23.2"
            }
        }), ">=22.23.2");

    });

    it("should throw when engines is missing", () => {

        throws(() => {
            getEngineNode({});
        }, (err) => {

            return err instanceof Error
                && err.message.includes("engines");

        });

    });

    it("should throw when engines is not an object", () => {

        throws(() => {

            getEngineNode({
                "engines": "nodejs"
            });

        }, (err) => {

            return err instanceof Error
                && err.message.includes("engines")
                && err.message.includes("node");

        });

    });

    it("should throw when engines.node is missing", () => {

        throws(() => {

            getEngineNode({
                "engines": {}
            });

        }, (err) => {

            return err instanceof Error
                && err.message.includes("node");

        });

    });

    it("should throw when engines.node is empty or not a string", () => {

        throws(() => {

            getEngineNode({
                "engines": {
                    "node": ""
                }
            });

        }, (err) => {

            return err instanceof Error
                && err.message.includes("non-empty string");

        });

        throws(() => {

            getEngineNode({
                "engines": {
                    "node": "   "
                }
            });

        }, (err) => {

            return err instanceof Error
                && err.message.includes("non-empty string");

        });

        throws(() => {

            getEngineNode({
                "engines": {
                    "node": 22
                }
            });

        }, (err) => {

            return err instanceof Error
                && err.message.includes("non-empty string");

        });

    });

});
