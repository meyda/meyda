/**
 * @jest-environment jsdom
 */

/**
 * This is required to trick typescript into thinking this file is a module
 * rather than a script. If this file is a script, it won't get its own scope
 * and EXPECTED_EXPORTS will be in the global scope, where it conflicts with
 * a variable of the same name in `exports-node.ts`.
 */
export {};

const EXPECTED_EXPORTS = [
  "audioContext",
  "spn",
  "bufferSize",
  "sampleRate",
  "melBands",
  "chromaBands",
  "callback",
  "windowingFunction",
  "featureExtractors",
  "EXTRACTION_STARTED",
  "numberOfMFCCCoefficients",
  "numberOfBarkBands",
  "_featuresToExtract",
  "windowing",
  "_errors",
  "createMeydaAnalyzer",
  "listAvailableFeatureExtractors",
  "extract",
];

describe("package exports", () => {
  test("meyda web exports at least currently expected fields", () => {
    expect(window["Meyda"]).not.toBeDefined();
    var meyda = require("../dist/web/meyda");

    expect(Object.keys(meyda)).toEqual(EXPECTED_EXPORTS);
    expect(Object.keys(window["Meyda"])).toEqual(EXPECTED_EXPORTS);
    // @ts-ignore
    delete window["Meyda"];
  });

  test("meyda web min exports at least currently expected fields", () => {
    expect(global["Meyda"]).not.toBeDefined();
    var meyda = require("../dist/web/meyda.min");

    expect(Object.keys(meyda)).toEqual(EXPECTED_EXPORTS);
    expect(Object.keys(global["Meyda"])).toEqual(EXPECTED_EXPORTS);
    // @ts-ignore
    delete global["Meyda"];
  });
});

describe("package exports", () => {
  test("meyda node exports at least currently expected fields", () => {
    var meyda = require("../dist/node/main");

    expect(Object.keys(meyda)).toEqual(EXPECTED_EXPORTS);
    expect(Object.keys(global["Meyda"])).toEqual(EXPECTED_EXPORTS);
  });
});
