// deps

    // natives
    const { strictEqual, throws } = require("node:assert");

    // locals
    const minimumVersionFromEngine = require("../lib/cjs/utils/minimumVersionFromEngine.js").default;

// private

    function _assertParseError (range) {

        throws(() => {
            minimumVersionFromEngine(range);
        }, (err) => {

            return err instanceof Error
                && err.message.includes("Unable to parse engines.node value")
                && err.message.includes(range);

        });

    }

// tests

describe("minimumVersionFromEngine", () => {

    it("should return exact versions", () => {
        strictEqual(minimumVersionFromEngine("22.22.3"), "22.22.3");
        strictEqual(minimumVersionFromEngine("v22.22.3"), "22.22.3");
        strictEqual(minimumVersionFromEngine("22"), "22.0.0");
    });

    it("should trim surrounding whitespace", () => {
        strictEqual(minimumVersionFromEngine("  >=22.22.3  "), "22.22.3");
        strictEqual(minimumVersionFromEngine("\tv22.22.3\n"), "22.22.3");
    });

    it("should return minimum for comparator ranges", () => {
        strictEqual(minimumVersionFromEngine(">=22.22.3"), "22.22.3");
        strictEqual(minimumVersionFromEngine(">=18"), "18.0.0");
        strictEqual(minimumVersionFromEngine(">20.0.0"), "20.0.1");
        strictEqual(minimumVersionFromEngine(">=18 <19"), "18.0.0");
        strictEqual(minimumVersionFromEngine("<=22.22.3"), "0.0.0");
    });

    it("should return minimum for caret, tilde and hyphen ranges", () => {
        strictEqual(minimumVersionFromEngine("^20.0.0"), "20.0.0");
        strictEqual(minimumVersionFromEngine("~1.2.3"), "1.2.3");
        strictEqual(minimumVersionFromEngine("1.0.0 - 2.0.0"), "1.0.0");
    });

    it("should return minimum for OR and wildcard ranges", () => {
        strictEqual(minimumVersionFromEngine(">=14 || >=16"), "14.0.0");
        strictEqual(minimumVersionFromEngine("*"), "0.0.0");
    });

    it("should throw on invalid ranges", () => {

        _assertParseError("not-a-version");
        _assertParseError(">=not-a-version");
        _assertParseError(">=");

    });

});
