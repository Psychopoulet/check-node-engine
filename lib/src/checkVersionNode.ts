// deps

    // natives
    import { join } from "node:path";

    // locals
    import isFile from "./utils/isFile";
    import readPackageEngineNode from "./readPackageEngineNode";
    import getOlderCurrentOfficialLTSVersion from "./getOlderCurrentOfficialLTSVersion";
    import compareVersions from "./utils/compareVersions";
    import minimumVersionFromEngine from "./utils/minimumVersionFromEngine";

// module

export default function checkVersionNode (packageJsonPath: string = join(process.cwd(), "package.json")): Promise<void> {

    return isFile(packageJsonPath).then((isPackageAFile: boolean): void => {

        if (!isPackageAFile) {
            throw new Error("this data is not a file: \"" + packageJsonPath + "\"");
        }

    }).then((): Promise<void> => {

        return readPackageEngineNode(packageJsonPath).then((engineNode: string): Promise<void> => {

            return getOlderCurrentOfficialLTSVersion().then((olderCurrentOfficialLTS: string): void => {

                const engineMinimum: string = minimumVersionFromEngine(engineNode);

                if (0 > compareVersions(engineMinimum, olderCurrentOfficialLTS)) {

                    throw new Error(
                        "engines.node \"" + engineNode + "\" (minimum " + engineMinimum + ") is lower than the older current official LTS Node.js (\"" + olderCurrentOfficialLTS + "\")"
                    );

                }

            });

        });

    });

}
