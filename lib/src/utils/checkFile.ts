// deps

    // locals
    import isFile from "./isFile";

// module

export default function checkFile (file: string): Promise<void> {

    return isFile(file).then((isItAFile: boolean): void => {

        if (!isItAFile) {

            throw new Error(
                "\"file\" parameter (" + file + ") is not a valid file"
            );

        }

    });

}
