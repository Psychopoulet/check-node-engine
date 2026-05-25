// deps

    // natives
    const { strictEqual, throws } = require("node:assert");

    // locals
    const compareVersions = require("../lib/cjs/utils/compareVersions.js").default;

// tests

describe("compareVersions", () => {

    it("should compare plain and v-prefixed versions", () => {
        strictEqual(compareVersions("22.14.0", "22.13.0"), 1);
        strictEqual(compareVersions("v22.14.0", "v22.13.0"), 1);
        strictEqual(compareVersions("20.0.0", "22.0.0"), -1);
        strictEqual(compareVersions("22.0.0", "22.0.0"), 0);
    });

    it("should throw on invalid versions", () => {

        throws(() => {
            compareVersions("not-a-version", "22.0.0");
        }, "Unable to parse version");

    });

});
