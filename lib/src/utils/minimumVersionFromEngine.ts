// module

export default function minimumVersionFromEngine (range: string): string {

    const trimmed: string = range.trim().replace(/^v/, "");
    const match: RegExpExecArray | null = /(\d+\.\d+\.\d+|\d+\.\d+|\d+)/.exec(trimmed);

    if (!match) {
        throw new Error("Unable to parse engines.node value: \"" + range + "\"");
    }

    const parts: string[] = match[1].split(".");

    while (3 > parts.length) {
        parts.push("0");
    }

    return parts.join(".");

}
