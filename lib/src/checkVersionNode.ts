// deps

    // locals
    import readPackageEngineNode from "./readPackageEngineNode";
    import getOlderCurrentOfficialLTSVersion from "./getOlderCurrentOfficialLTSVersion";
    import compareVersions from "./utils/compareVersions";
    import minimumVersionFromEngine from "./utils/minimumVersionFromEngine";

// module

export default function checkVersionNode (): Promise<void> {

    return readPackageEngineNode().then((engineNode: string): Promise<void> => {

        return getOlderCurrentOfficialLTSVersion().then((olderCurrentOfficialLTS: string): void => {

            const engineMinimum: string = minimumVersionFromEngine(engineNode);

            if (0 > compareVersions(engineMinimum, olderCurrentOfficialLTS)) {

                throw new Error(
                    "engines.node \"" + engineNode + "\" (minimum " + engineMinimum + ") is lower than the older current official LTS Node.js (\"" + olderCurrentOfficialLTS + "\")"
                );

            }

        });

    });

}
