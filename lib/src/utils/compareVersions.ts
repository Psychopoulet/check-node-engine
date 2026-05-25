// deps

    // externals
    import semver from "semver";

// private

    function _coerceVersion (version: string): semver.SemVer {

        const coerced: semver.SemVer | null = semver.coerce(version);

        if (null === coerced) {
            throw new Error("Unable to parse version: \"" + version + "\"");
        }

        return coerced;

    }

// module

export default function compareVersions (a: string, b: string): number {

    return semver.compare(_coerceVersion(a), _coerceVersion(b));

}
