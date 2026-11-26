// deps

    // natives
    const { EventEmitter } = require("node:events");
    const https = require("node:https");
    const semver = require("semver");
    const { rejects, strictEqual } = require("node:assert");

    // locals
    const getOlderCurrentOfficialLTSVersion = require("../lib/src/utils/getOlderCurrentOfficialLTSVersion.ts").default;

    require("../lib/src/types/node.ts");

// private

    const _originalHttpsGet = https.get;

    function _restoreHttpsGet () {
        https.get = _originalHttpsGet;
    }

    function _mockNodejsDistIndex (body, options = {}) {

        https.get = (url, callback) => {

            strictEqual(url, "https://nodejs.org/dist/index.json");

            const res = new EventEmitter();
            res.statusCode = options.statusCode ?? 200;
            res.statusMessage = options.statusMessage ?? "OK";

            process.nextTick(() => {

                process.nextTick(() => {

                    if (options.streamError) {
                        res.emit("error", options.streamError);
                        return;
                    }

                    res.emit("data", "string" === typeof body ? body : JSON.stringify(body));
                    res.emit("end");

                });

                return callback(res);

            });

        };

    }

    function _recentDate () {

        const date = new Date();
        date.setMonth(date.getMonth() - 1);

        return date.toISOString().slice(0, 10);

    }

    function _oldDate () {

        const date = new Date();
        date.setMonth(date.getMonth() - 24);

        return date.toISOString().slice(0, 10);

    }

    function _release (version, lts, date = _recentDate()) {

        return {
            "version": version,
            "date": date,
            "lts": lts
        };

    }

    function _restoreCoerceAfterSecondParse (version) {

        const originalCoerce = semver.coerce;
        let seen = false;

        semver.coerce = (value, options) => {

            const key = String(value);
            const fromCompare = String(new Error().stack).includes("compareVersions");

            if (version === key && false === fromCompare && seen) {
                return null;
            }

            if (version === key && false === fromCompare) {
                seen = true;
            }

            return originalCoerce(value, options);

        };

        return () => {
            semver.coerce = originalCoerce;
        };

    }

// tests

describe("getOlderCurrentOfficialLTSVersion", () => {

    afterEach(_restoreHttpsGet);

    describe("success cases", () => {

        it("should return the second newest active official LTS version", () => {

            _mockNodejsDistIndex([
                _release("v24.1.0", "Krypton"),
                _release("v24.0.0", "Krypton"),
                _release("v22.14.0", "Jod"),
                _release("v22.13.0", "Jod"),
                _release("v20.18.0", "Iron", _oldDate()),
                _release("v18.20.0", false)
            ]);

            return getOlderCurrentOfficialLTSVersion().then((version) => {
                strictEqual(version, "22.14.0");
            });

        });

        it("should ignore releases without an LTS codename", () => {

            _mockNodejsDistIndex([
                _release("v24.1.0", "Krypton"),
                _release("v23.0.0", false),
                _release("v22.14.0", "Jod")
            ]);

            return getOlderCurrentOfficialLTSVersion().then((version) => {
                strictEqual(version, "22.14.0");
            });

        });

        it("should ignore LTS releases with unparseable versions", () => {

            _mockNodejsDistIndex([
                _release("v24.1.0", "Krypton"),
                _release("not-a-version", "Broken"),
                _release("v22.14.0", "Jod")
            ]);

            return getOlderCurrentOfficialLTSVersion().then((version) => {
                strictEqual(version, "22.14.0");
            });

        });

    });

    describe("error cases", () => {

        it("should reject when the Node.js releases request fails", () => {

            _mockNodejsDistIndex([], {
                "statusCode": 503,
                "statusMessage": "Service Unavailable"
            });

            return rejects(
                getOlderCurrentOfficialLTSVersion(),
                (err) => {

                    return err instanceof Error
                        && err.message.includes("Failed to fetch Node.js releases")
                        && err.message.includes("503")
                        && err.message.includes("Service Unavailable");

                }
            );

        });

        it("should reject when the response stream errors", () => {

            const streamError = new Error("network failure");

            _mockNodejsDistIndex([], {
                "streamError": streamError
            });

            return rejects(
                getOlderCurrentOfficialLTSVersion(),
                streamError
            );

        });

        it("should reject when there are not enough active LTS lines", () => {

            _mockNodejsDistIndex([
                _release("v24.1.0", "Krypton"),
                _release("v22.14.0", "Jod", _oldDate())
            ]);

            return rejects(
                getOlderCurrentOfficialLTSVersion(),
                (err) => {

                    return err instanceof Error
                        && err.message.includes("Not enough active LTS lines");

                }
            );

        });

        it("should reject when the older LTS version cannot be parsed", () => {

            const restoreCoerce = _restoreCoerceAfterSecondParse("v22.14.0");

            _mockNodejsDistIndex([
                _release("v24.1.0", "Krypton"),
                _release("v22.14.0", "Jod")
            ]);

            return rejects(
                getOlderCurrentOfficialLTSVersion(),
                (err) => {

                    return err instanceof Error
                        && err.message.includes("Unable to parse older current official LTS");

                }
            ).finally(restoreCoerce);

        });

    });

});
