# check-node-engine
Compare the required node engine to the last older LTS node version.

[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=Psychopoulet_check-node-engine&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=Psychopoulet_check-node-engine)
[![Issues](https://img.shields.io/github/issues/Psychopoulet/check-node-engine.svg)](https://github.com/Psychopoulet/check-node-engine/issues)
[![Pull requests](https://img.shields.io/github/issues-pr/Psychopoulet/check-node-engine.svg)](https://github.com/Psychopoulet/check-node-engine/pulls)

[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=Psychopoulet_check-node-engine&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=Psychopoulet_check-node-engine)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=Psychopoulet_check-node-engine&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=Psychopoulet_check-node-engine)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=Psychopoulet_check-node-engine&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=Psychopoulet_check-node-engine)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=Psychopoulet_check-node-engine&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=Psychopoulet_check-node-engine)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=Psychopoulet_check-node-engine&metric=bugs)](https://sonarcloud.io/summary/new_code?id=Psychopoulet_check-node-engine)

[![Known Vulnerabilities](https://snyk.io/test/github/Psychopoulet/check-node-engine/badge.svg)](https://snyk.io/test/github/Psychopoulet/check-node-engine)

## Features

  * Get the older NodeJS current LTS
  * Compare this version to the current minimal engine node

## Doc

### Methods

  * ``` (packageJsonPath?: string) => Promise<void> ``` compare node versions

### Command line options

  * ``` --get-lts ``` => only get current minimal engine node
  * ``` --package-file <package path> ``` => specify an optional package path

## Examples

### Command line

```bash
$ cd ./myProject/ && npx check-node-engine
$ cd ./myProject/ && npx check-node-engine --get-lts
$ cd ./myProject/ && npx check-node-engine --package-file "./package.json"
```

### Native

```javascript
const checker = require("check-node-engine");

checker().then(() => {
  console.log("ok");
}).catch((err) => {
  console.error(err);
});

checker("./package.json").then(() => {
  console.log("ok");
}).catch((err) => {
  console.error(err);
});
```

### Typescript

```typescript
import checker = require("check-node-engine");

checker().then(() => {
  console.log("ok");
}).catch((err) => {
  console.error(err);
});

checker("./package.json").then(() => {
  console.log("ok");
}).catch((err) => {
  console.error(err);
});
```

## Tests

```bash
$ npm run tests
```

## License

  [ISC](LICENSE)
