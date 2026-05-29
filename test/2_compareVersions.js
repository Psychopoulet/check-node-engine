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

    it("should compare mixed version formats", () => {
        strictEqual(compareVersions("v22.14.0", "22.13.0"), 1);
        strictEqual(compareVersions("22", "22.0.0"), 0);
        strictEqual(compareVersions("22.0.0", "v22.0.0"), 0);
    });

    it("should compare patch and minor versions", () => {
        strictEqual(compareVersions("22.0.1", "22.0.0"), 1);
        strictEqual(compareVersions("22.1.0", "22.0.9"), 1);
        strictEqual(compareVersions("22.0.0-beta.1", "22.0.0-beta.1"), 0);
    });

    it("should throw on invalid first version", () => {

        const testedVersion = "not-a-version";

        throws(() => {
            compareVersions(testedVersion, "22.0.0");
        }, (err) => {

            return err instanceof Error
                && err.message.includes("Unable to parse version")
                && err.message.includes(testedVersion);

        });

    });

    it("should throw on invalid second version", () => {

        const testedVersion = "not-a-version";

        throws(() => {
            compareVersions("22.0.0", testedVersion);
        }, (err) => {

            return err instanceof Error
                && err.message.includes("Unable to parse version")
                && err.message.includes(testedVersion);

        });

    });

});
