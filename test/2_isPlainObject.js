// deps

    // natives
    const { ok, strictEqual } = require("node:assert");

    // locals
    const isPlainObject = require("../lib/cjs/utils/isPlainObject.js").default;

// tests

describe("isPlainObject", () => {

    it("should return true for plain objects", () => {

        ok(isPlainObject({}));

        ok(isPlainObject({
            "engines": {
                "node": ">=22.23.2"
            }
        }));

    });

    it("should return false for non-plain values", () => {

        strictEqual(isPlainObject(null), false);
        strictEqual(isPlainObject(), false);
        strictEqual(isPlainObject("package.json"), false);
        strictEqual(isPlainObject(42), false);
        strictEqual(isPlainObject([]), false);
        strictEqual(isPlainObject(new Date()), false);
        strictEqual(isPlainObject(Object.create({ "engines": {} })), false);

    });

});
