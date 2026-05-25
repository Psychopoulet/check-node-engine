/// <reference path="../../lib/cjs/main.d.cts" />

"use strict";

// deps

    // locals
    import checker from "../../lib/cjs/main.cjs";

// test

checker("./package.json").then((result) => {

  console.log(result.result ? "ok": "old versions detected");

  return checker("./package.json");

}).then((result): void => {

  console.log(result.result ? "ok": "old versions detected");

}).then((): void => {

  process.exitCode = 0;
  process.exit(0);

}).catch((err: Error): void => {

    console.error(err);

    process.exitCode = 1;
    process.exit(1);

});
