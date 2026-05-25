// deps

    // externals
    import semver from "semver";

// module

export default function minimumVersionFromEngine (range: string): string {

    const trimmed: string = range.trim();
    const validRange: string | null = semver.validRange(trimmed, {
        "includePrerelease": false,
        "loose": true
    });

    if (null === validRange) {
        throw new Error("Unable to parse engines.node value: \"" + range + "\"");
    }

    const min: semver.SemVer | null = semver.minVersion(validRange);

    if (null === min) {
        throw new Error("Unable to parse engines.node value: \"" + range + "\"");
    }

    return min.format();

}
