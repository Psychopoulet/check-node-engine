export type Release = { // Version = "x.y.z"

    // used
    "version": string; // "v"Version
    "date": string; // YYYY-MM-DD
    "lts": boolean;

    // optional
    "files": string[];
    "npm": string; // Version
    "v8": string; // Version
    "uv": string; // Version
    "zlib": string; // Version
    "openssl": string; // Version
    "modules": string; // number
    "security": boolean;

};
