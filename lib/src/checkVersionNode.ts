// deps

    // natives
    import { join } from "node:path";
    import { readFile } from "node:fs/promises";

    // locals
    import checkFile from "./utils/checkFile";
    import isPlainObject from "./utils/isPlainObject";
    import getEngineNode from "./utils/getEngineNode";
    import getCachedOlderCurrentOfficialLTSVersion from "./utils/getCachedOlderCurrentOfficialLTSVersion";
    import minimumVersionFromEngine from "./utils/minimumVersionFromEngine";
    import compareVersions from "./utils/compareVersions";

// types & interfaces

    // locals
    export type tPackageType = Record<string, object | string | number | boolean>;

// module

export default function checkVersionNode (source: string | tPackageType = join(process.cwd(), "package.json")): Promise<void> {

    return Promise.resolve().then((): Promise<tPackageType> | tPackageType => {

        if ("string" === typeof source) {

            return checkFile(source).then(() => {
                return readFile(source, "utf-8");
            }).then((content: string): tPackageType => {
                return JSON.parse(content) as tPackageType;
            });

        }
        else if (isPlainObject(source)) {

            return source;

        }
        else {

            throw new TypeError("\"source\" parameter is not a string or a package type");

        }

    }).then((packageData: tPackageType): Promise<void> => {

        const engineNode: string = getEngineNode(packageData);

        return getCachedOlderCurrentOfficialLTSVersion().then((olderCurrentOfficialLTS: string): void => {

            const engineMinimum: string = minimumVersionFromEngine(engineNode);

            if (0 > compareVersions(engineMinimum, olderCurrentOfficialLTS)) {

                throw new Error(
                    "engines.node \"" + engineNode + "\" (minimum " + engineMinimum + ") is lower than the older current official LTS Node.js (\"" + olderCurrentOfficialLTS + "\")"
                );

            }

        });

    });

}
