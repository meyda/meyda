/**
 * @jest-environment jsdom
 */

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
  "_featuresToExtract",
  "windowing",
  "_errors",
  "createMeydaAnalyzer",
  "extract",
];

describe("package exports", () => {
  test("meyda web exports at least currently expected fields", () => {
    expect(window.Meyda).not.toBeDefined();
    var meyda = require("../dist/web/meyda");

    expect(Object.keys(meyda)).toEqual(EXPECTED_EXPORTS);
    expect(Object.keys(window.Meyda)).toEqual(EXPECTED_EXPORTS);
    delete window.Meyda;
  });

  test("meyda web min exports at least currently expected fields", () => {
    expect(global.Meyda).not.toBeDefined();
    var meyda = require("../dist/web/meyda.min");

    expect(Object.keys(meyda)).toEqual(EXPECTED_EXPORTS);
    expect(Object.keys(global.Meyda)).toEqual(EXPECTED_EXPORTS);
    delete global.Meyda;
  });
});

describe("package exports", () => {
  test("meyda node exports at least currently expected fields", () => {
    var meyda = require("../dist/node/main");

    expect(Object.keys(meyda)).toEqual(EXPECTED_EXPORTS);
    expect(Object.keys(global.Meyda)).toEqual(EXPECTED_EXPORTS);
  });
});
