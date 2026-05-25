// deps

    // natives
    import { lstat } from "node:fs";

// types & interfaces

    // natives
    import type { Stats } from "node:fs";

// module

export default function isFile (file: string): Promise<boolean> {

    return new Promise((resolve: (value: boolean) => void): void => {

        lstat(file, (err: Error | null, stats: Stats): void => {
            return resolve(!err && stats.isFile());
        });

    });

}
