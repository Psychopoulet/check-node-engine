// deps

    // natives
    const os = require("node:os");
    const { join } = require("node:path");
    const { mkdir, mkdtemp, readdir, readFile, rm, writeFile } = require("node:fs/promises");
    const { deepStrictEqual, doesNotReject, strictEqual } = require("node:assert");

    // locals
    const LTSCache = require("../lib/cjs/utils/LTSCache.js").default;

// private

    const _originalHomedir = os.homedir;
    const CACHE_FILENAME_PATTERN = /^(\d{4}-\d{2}-\d{2}T)(\d{2})-(\d{2})-(\d{2})-(\d{3})Z$/;

    let _fakeHome = "";

    function _cacheDir () {
        return join(_fakeHome, "check-node-engine");
    }

    function _formatCacheFilename (date) {
        return date.toISOString().replaceAll(":", "-").replace(".", "-");
    }

    function _expiredDate () {
        return new Date(Date.now() - (16 * 60 * 1000));
    }

    function _freshDate (offsetMs = 5 * 60 * 1000) {
        return new Date(Date.now() - offsetMs);
    }

    function _writeCacheFile (date, content) {

        const dir = _cacheDir();

        return mkdir(dir, {
            "recursive": true
        }).then(() => {
            return writeFile(join(dir, _formatCacheFilename(date)), content, "utf-8");
        });

    }

// tests

describe("LTSCache", () => {

    beforeEach(() => {

        return mkdtemp(join(os.tmpdir(), "check-node-engine-cache-")).then((dir) => {

            _fakeHome = dir;
            os.homedir = () => {
                return _fakeHome;
            };

        });

    });

    afterEach(() => {

        os.homedir = _originalHomedir;

        return _fakeHome ? rm(_fakeHome, {
            "recursive": true,
            "force": true
        }) : Promise.resolve();

    });

    describe("cleanupExpired", () => {

        it("should resolve and create nothing when the cache directory is missing", () => {

            return doesNotReject(LTSCache.cleanupExpired()).then(() => {
                return readdir(_fakeHome);
            }).then((files) => {
                deepStrictEqual(files, []);
            });

        });

        it("should delete files whose datetime is older than 15 minutes", () => {

            return _writeCacheFile(_expiredDate(), "22.14.0").then(() => {
                return LTSCache.cleanupExpired();
            }).then(() => {
                return readdir(_cacheDir());
            }).then((files) => {
                deepStrictEqual(files, []);
            });

        });

        it("should keep files whose datetime is fresher than 15 minutes", () => {

            const freshDate = _freshDate();
            const freshName = _formatCacheFilename(freshDate);

            return _writeCacheFile(freshDate, "22.14.0").then(() => {
                return LTSCache.cleanupExpired();
            }).then(() => {
                return readdir(_cacheDir());
            }).then((files) => {
                deepStrictEqual(files, [ freshName ]);
            });

        });

        it("should ignore files whose name is not a datetime", () => {

            const dir = _cacheDir();

            return mkdir(dir, {
                "recursive": true
            }).then(() => {
                return writeFile(join(dir, "readme.txt"), "22.14.0", "utf-8");
            }).then(() => {
                return LTSCache.cleanupExpired();
            }).then(() => {
                return readdir(dir);
            }).then((files) => {
                deepStrictEqual(files, [ "readme.txt" ]);
            });

        });

    });

    describe("readFresh", () => {

        it("should return null when the cache directory is missing", () => {

            return LTSCache.readFresh().then((version) => {
                strictEqual(version, null);
            });

        });

        it("should return the trimmed content of a fresh cache file", () => {

            return _writeCacheFile(_freshDate(), "  22.14.0  \n").then(() => {
                return LTSCache.readFresh();
            }).then((version) => {
                strictEqual(version, "22.14.0");
            });

        });

        it("should return the most recent fresh file when several exist", () => {

            return _writeCacheFile(_freshDate(10 * 60 * 1000), "22.13.0").then(() => {
                return _writeCacheFile(_freshDate(2 * 60 * 1000), "22.14.0");
            }).then(() => {
                return LTSCache.readFresh();
            }).then((version) => {
                strictEqual(version, "22.14.0");
            });

        });

        it("should return null for an empty cache file", () => {

            return _writeCacheFile(_freshDate(), "   \n").then(() => {
                return LTSCache.readFresh();
            }).then((version) => {
                strictEqual(version, null);
            });

        });

        it("should return null when only expired or invalid files exist", () => {

            const dir = _cacheDir();

            return _writeCacheFile(_expiredDate(), "22.14.0").then(() => {
                return writeFile(join(dir, "readme.txt"), "22.14.0", "utf-8");
            }).then(() => {
                return LTSCache.readFresh();
            }).then((version) => {
                strictEqual(version, null);
            });

        });

    });

    describe("write", () => {

        it("should create the cache directory and a datetime-named file", () => {

            return LTSCache.write("22.14.0").then(() => {
                return readdir(_cacheDir());
            }).then((files) => {

                strictEqual(files.length, 1);
                strictEqual(CACHE_FILENAME_PATTERN.test(files[0]), true);

                return readFile(join(_cacheDir(), files[0]), "utf-8");

            }).then((content) => {
                strictEqual(content, "22.14.0");
            });

        });

        it("should be readable as a fresh cache hit", () => {

            return LTSCache.write("22.14.0").then(() => {
                return LTSCache.readFresh();
            }).then((version) => {
                strictEqual(version, "22.14.0");
            });

        });

    });

});
