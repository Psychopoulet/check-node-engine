// types & interfaces

    // locals
    import type { tPackageType } from "../checkVersionNode";

// module

export default function getEngineNode (packageData: tPackageType): string {

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

}
