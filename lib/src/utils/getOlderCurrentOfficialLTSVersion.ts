// deps

    // natives
    import { get } from "node:https";

    // externals
    import semver from "semver";

    // locals
    import compareVersions from "./compareVersions";

// types & interfaces

    // natives
    import type { IncomingMessage } from "node:http";

    // locals
    import type { Release } from "../types/node";

// consts

    const NODEJS_DIST_INDEX_URL = "https://nodejs.org/dist/index.json";
    const LTS_LINE_MAX_AGE_MONTHS = 18;

// module

export default function getOlderCurrentOfficialLTSVersion (): Promise<string> {

    return new Promise((resolve: (value: Release[]) => void, reject: (err: Error) => void): void => {

        get(NODEJS_DIST_INDEX_URL, (res: IncomingMessage): void => {

            if (200 !== res.statusCode) {
                reject(new Error("Failed to fetch Node.js releases (" + res.statusCode + " " + res.statusMessage + ")"));
            }

            let data: string = "";

            res.on("data", (chunk: string): void => {
                data += chunk;
            });

            res.on("end", (): void => {
                resolve(JSON.parse(data) as Release[]);
            });

            res.on("error", (err: Error): void => {
                reject(err);
            });

        });

    }).then((releases: Release[]): string => {

        const cutoff: Date = new Date();
        cutoff.setMonth(cutoff.getMonth() - LTS_LINE_MAX_AGE_MONTHS);

        const latestByMajor: Map<string, Release> = new Map();

        releases.forEach((release: Release): void => {

            if ("string" !== typeof release.lts) {
                return;
            }

            const coerced: semver.SemVer | null = semver.coerce(release.version);

            if (null === coerced) {
                return;
            }

            const major: string = String(coerced.major);
            const current: Release | undefined = latestByMajor.get(major);

            if (!current || 0 < compareVersions(release.version, current.version)) {

                latestByMajor.set(major, { ...release });

            }

        });

        const activeLTSLines: Release[] = [ ...latestByMajor.values() ].filter((release: Release): boolean => {
            return cutoff <= new Date(release.date);
        }).sort((a: Release, b: Release): number => {
            return compareVersions(b.version, a.version);
        });

        if (2 > activeLTSLines.length) {
            throw new Error("Not enough active LTS lines to determine the older current official LTS Node.js version");
        }

        const olderLTS: semver.SemVer | null = semver.coerce(activeLTSLines[1].version);

        if (null === olderLTS) {
            throw new Error("Unable to parse older current official LTS Node.js version: \"" + activeLTSLines[1].version + "\"");
        }

        return olderLTS.format();


    });

}
