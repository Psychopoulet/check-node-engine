// deps

    // natives
    import { get } from "node:https";

    // locals
    import compareVersions from "./utils/compareVersions";

// types & interfaces

    // natives
    import type { IncomingMessage } from "node:http";

    // locals
    type Release = {
        "version": string;
        "date": string;
        "lts": string;
    };

// consts

    const NODEJS_DIST_INDEX_URL = "https://nodejs.org/dist/index.json";
    const LTS_LINE_MAX_AGE_MONTHS = 18;

// module

export default function getOlderCurrentOfficialLTSVersion (): Promise<string> {

    return new Promise((resolve: (value: Release[]) => void, reject: (reason?: Error) => void): void => {

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

        });

    }).then((releases: Release[]): string => {

        const cutoff = new Date();
        cutoff.setMonth(cutoff.getMonth() - LTS_LINE_MAX_AGE_MONTHS);

        const latestByMajor: Map<string, Release> = new Map();

        releases.forEach((release: Release): void => {

            if ("string" !== typeof release.lts) {
                return;
            }

            const majorMatch: RegExpExecArray | null = /^v(\d+)/u.exec(release.version);

            if (!majorMatch) {
                return;
            }

            const [ , major ] = majorMatch;
            const current = latestByMajor.get(major);

            if (!current || 0 < compareVersions(release.version, current.version)) {

                latestByMajor.set(major, {
                    "date": release.date,
                    "lts": release.lts,
                    "version": release.version
                });

            }

        });

        const activeLTSLines: Release[] = [ ...latestByMajor.values() ]
            .filter((release: Release): boolean => {
                return cutoff <= new Date(release.date);
            })
            .sort((a: Release, b: Release): number => {
                return compareVersions(b.version, a.version);
            });

        if (2 > activeLTSLines.length) {
            throw new Error("Not enough active LTS lines to determine the older current official LTS Node.js version");
        }

        return activeLTSLines[1].version.replace(/^v/, "");

    });

}
