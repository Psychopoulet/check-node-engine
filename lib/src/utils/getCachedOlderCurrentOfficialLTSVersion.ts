// deps

    // locals
    import LTSCache from "./LTSCache";
    import getOlderCurrentOfficialLTSVersion from "./getOlderCurrentOfficialLTSVersion";

// module

export default function getCachedOlderCurrentOfficialLTSVersion (): Promise<string> {

    return LTSCache.cleanupExpired().then((): Promise<string | null> => {
        return LTSCache.readFresh();
    }).then((cached: string | null): Promise<string> | string => {

        if (null !== cached) {
            return cached;
        }

        return getOlderCurrentOfficialLTSVersion().then((version: string): Promise<string> => {
            return LTSCache.write(version).then((): string => {
                return version;
            });
        });

    });

}
