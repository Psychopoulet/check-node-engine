// deps

    // natives
    const { EventEmitter } = require("node:events");
    const { mkdir, mkdtemp, readdir, readFile, rm, writeFile } = require("node:fs/promises");
    const https = require("node:https");
    const os = require("node:os");
    const { join } = require("node:path");
    const { strictEqual } = require("node:assert");

    // locals
    const getCachedOlderCurrentOfficialLTSVersion = require("../lib/src/utils/getCachedOlderCurrentOfficialLTSVersion.ts").default;

// private

    const _originalHomedir = os.homedir;
    const _originalHttpsGet = https.get;

    let _fakeHome = "";

    function _cacheDir () {
        return join(_fakeHome, "check-node-engine");
    }

    function _mockNodejsDistIndex (body) {

        https.get = (url, callback) => {

            strictEqual(url, "https://nodejs.org/dist/index.json");

            const res = new EventEmitter();
            res.statusCode = 200;
            res.statusMessage = "OK";

            process.nextTick(() => {

                process.nextTick(() => {
                    res.emit("data", JSON.stringify(body));
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

// tests

describe("getCachedOlderCurrentOfficialLTSVersion", () => {

    beforeEach(() => {

        return mkdtemp(join(os.tmpdir(), "check-node-engine-cached-lts-")).then((dir) => {

            _fakeHome = dir;
            os.homedir = () => {
                return _fakeHome;
            };

        });

    });

    afterEach(() => {

        os.homedir = _originalHomedir;
        https.get = _originalHttpsGet;

        return _fakeHome ? rm(_fakeHome, {
            "recursive": true,
            "force": true
        }) : Promise.resolve();

    });

    it("should return a fresh cached version without requesting Node.js releases", () => {

        const dir = _cacheDir();
        const filename = new Date().toISOString().replaceAll(":", "-").replace(".", "-");

        https.get = () => {
            throw new Error("Node.js releases should not be requested");
        };

        return mkdir(dir, {
            "recursive": true
        }).then(() => {
            return writeFile(join(dir, filename), "22.14.0", "utf-8");
        }).then(() => {
            return getCachedOlderCurrentOfficialLTSVersion();
        }).then((version) => {
            strictEqual(version, "22.14.0");
        });

    });

    it("should fetch and store the older LTS when the cache is empty", () => {

        _mockNodejsDistIndex([
            {
                "version": "v24.1.0",
                "date": _recentDate(),
                "lts": "Krypton"
            },
            {
                "version": "v22.14.0",
                "date": _recentDate(),
                "lts": "Jod"
            }
        ]);

        return getCachedOlderCurrentOfficialLTSVersion().then((version) => {

            strictEqual(version, "22.14.0");

            return readdir(_cacheDir());

        }).then((files) => {

            strictEqual(files.length, 1);

            return readFile(join(_cacheDir(), files[0]), "utf-8");

        }).then((content) => {
            strictEqual(content, "22.14.0");
        });

    });

});
