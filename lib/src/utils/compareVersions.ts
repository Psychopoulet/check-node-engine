// deps

    // locals
    import parseVersion from "./parseVersion";

// module

export default function compareVersions (a: string, b: string): number {

    const partsA: number[] = parseVersion(a);
    const partsB: number[] = parseVersion(b);
    const length: number = Math.max(partsA.length, partsB.length);

    for (let i = 0; i < length; i += 1) {

        const diff = (partsA[i] ?? 0) - (partsB[i] ?? 0);

        if (0 !== diff) {
            return diff;
        }

    }

    return 0;

}
