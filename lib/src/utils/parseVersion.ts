// module

export default function parseVersion (version: string): number[] {

    return version.replace(/^v/, "").split(".").map((part: string): number => {

        const n: number = Number.parseInt(part, 10);

        return Number.isNaN(n) ? 0 : n;

    });

}
