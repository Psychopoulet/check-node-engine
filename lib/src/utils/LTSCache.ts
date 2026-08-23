// deps

    // natives
    import { join } from "node:path";
    import { homedir } from "node:os";
    import { mkdir, readdir, readFile, unlink, writeFile } from "node:fs/promises";

// types & interfaces

    // natives
    import type { Dirent } from "node:fs";

    interface iFreshCacheFile {
        "name": string;
        "date": Date;
    }

// consts

    const CACHE_DIR_NAME = "check-node-engine";
    const CACHE_TTL_MS = 15 * 60 * 1000;
    const CACHE_FILENAME_PATTERN = /^(\d{4}-\d{2}-\d{2}T)(\d{2})-(\d{2})-(\d{2})-(\d{3})Z$/;

// module

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export default class LTSCache {

    private constructor () {
        throw new Error("LTSCache is a static class");
    }

    public static cleanupExpired (): Promise<void> {

        return LTSCache._listCacheFiles().then((files: string[]): Promise<void> => {

            const now: Date = new Date();
            const dir: string = LTSCache._getCacheDir();

            return Promise.all(files.map((file: string): Promise<void> => {

                const date: Date | null = LTSCache._parseFilename(file);

                if (null === date || !LTSCache._isExpired(date, now)) {
                    return Promise.resolve();
                }

                return unlink(join(dir, file)).then((): void => {
                    // nothing to do here
                }).catch((): void => {
                    // nothing to do here
                });

            })).then((): void => {
                // nothing to do here
            });

        }).catch((): void => {
            // nothing to do here
        });

    }

    public static readFresh (): Promise<string | null> {

        return LTSCache._listCacheFiles().then((files: string[]): Promise<string | null> => {

            const now: Date = new Date();
            const fresh: iFreshCacheFile[] = [];

            files.forEach((file: string): void => {

                const date: Date | null = LTSCache._parseFilename(file);

                if (null === date || LTSCache._isExpired(date, now)) {
                    return;
                }

                fresh.push({
                    "name": file,
                    "date": date
                });

            });

            fresh.sort((a: iFreshCacheFile, b: iFreshCacheFile): number => {
                return b.date.getTime() - a.date.getTime();
            });

            if (0 === fresh.length) {
                return Promise.resolve(null);
            }

            return readFile(join(LTSCache._getCacheDir(), fresh[0].name), "utf-8").then((content: string): string | null => {

                const trimmed: string = content.trim();

                return "" === trimmed ? null : trimmed;

            }).catch((): null => {
                return null;
            });

        }).catch((): null => {
            return null;
        });

    }

    public static write (version: string): Promise<void> {

        const dir: string = LTSCache._getCacheDir();
        const file: string = join(dir, LTSCache._formatFilename(new Date()));

        return mkdir(dir, {
            "recursive": true
        }).then((): Promise<void> => {
            return writeFile(file, version, "utf-8");
        }).catch((): void => {
            // nothing to do here
        });

    }

    private static _getCacheDir (): string {
        return join(homedir(), CACHE_DIR_NAME);
    }

    private static _formatFilename (date: Date): string {
        return date.toISOString().replaceAll(":", "-").replace(".", "-");
    }

    private static _parseFilename (name: string): Date | null {

        const match: RegExpExecArray | null = CACHE_FILENAME_PATTERN.exec(name);

        if (null === match) {
            return null;
        }

        const parsed: Date = new Date(match[1] + match[2] + ":" + match[3] + ":" + match[4] + "." + match[5] + "Z");

        if (Number.isNaN(parsed.getTime())) {
            return null;
        }

        return parsed;

    }

    private static _isExpired (date: Date, now: Date): boolean {
        return CACHE_TTL_MS < now.getTime() - date.getTime();
    }

    private static _listCacheFiles (): Promise<string[]> {

        return readdir(LTSCache._getCacheDir(), {
            "withFileTypes": true
        }).then((entries: Dirent[]): string[] => {

            return entries.filter((entry: Dirent): boolean => {
                return entry.isFile();
            }).map((entry: Dirent): string => {
                return entry.name;
            });

        });

    }

}
