// deps

    // natives
    const { strictEqual, throws } = require("node:assert");

    // locals
    const minimumVersionFromEngine = require("../lib/cjs/utils/minimumVersionFromEngine.js").default;

// tests

describe("minimumVersionFromEngine", () => {

    it("should return exact versions", () => {
        strictEqual(minimumVersionFromEngine("22.22.3"), "22.22.3");
        strictEqual(minimumVersionFromEngine("v22.22.3"), "22.22.3");
        strictEqual(minimumVersionFromEngine("22"), "22.0.0");
    });

    it("should return minimum for comparator ranges", () => {
        strictEqual(minimumVersionFromEngine(">=22.22.3"), "22.22.3");
        strictEqual(minimumVersionFromEngine(">=18"), "18.0.0");
        strictEqual(minimumVersionFromEngine(">20.0.0"), "20.0.1");
        strictEqual(minimumVersionFromEngine(">=18 <19"), "18.0.0");
    });

    it("should return minimum for caret and tilde ranges", () => {
        strictEqual(minimumVersionFromEngine("^20.0.0"), "20.0.0");
        strictEqual(minimumVersionFromEngine("~1.2.3"), "1.2.3");
    });

    it("should return minimum for OR ranges", () => {
        strictEqual(minimumVersionFromEngine(">=14 || >=16"), "14.0.0");
    });

    it("should throw on invalid ranges", () => {

        throws(() => {
            minimumVersionFromEngine("not-a-version");
        }, "Unable to parse engines.node");

    });

});
