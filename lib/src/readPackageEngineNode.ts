// deps

    // natives
    import { access, readFile } from "node:fs/promises";

// module

export default function readPackageEngineNode (packageJsonPath: string): Promise<string> {

    return access(packageJsonPath).catch((): void => {
        throw new Error("package.json not found at \"" + packageJsonPath + "\"");
    }).then((): Promise<string> => {
        return readFile(packageJsonPath, "utf8");
    }).then((content: string): string => {

        let packageData: { "engines": { "node": string } } | null = null;

        try {
            packageData = JSON.parse(content) as { "engines": { "node": string } };
        }
        catch (e: unknown) {
            throw new Error("package.json is not valid JSON : " + (e instanceof Error ? e.message : String(e)));
        }

        if ("object" !== typeof packageData || !("engines" in packageData)) {
            throw new Error("package.json must contain an \"engines\" field");
        }

        const { engines } = packageData;

        if ("object" !== typeof engines || !("node" in engines)) {
            throw new Error("package.json \"engines\" must contain a \"node\" field");
        }

        const { "node": engineNode } = engines;

        if ("string" !== typeof engineNode || "" === engineNode.trim()) {
            throw new Error("package.json \"engines.node\" must be a non-empty string");
        }

        return engineNode;

    });

}
