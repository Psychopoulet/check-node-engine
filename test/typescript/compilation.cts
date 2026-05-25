/// <reference path="../../lib/cjs/main.d.cts" />

"use strict";

// deps

    // locals
    import checker from "../../lib/cjs/main.cjs";

// test

checker().then(() => {

  console.log("ok");

  return checker("./package.json");

}).then((): void => {

  console.log("ok");

}).then((): void => {

  process.exitCode = 0;
  process.exit(0);

}).catch((err: Error): void => {

    console.error(err);

    process.exitCode = 1;
    process.exit(1);

});
