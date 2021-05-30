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
  "listAvailableFeatureExtractors",
  "extract",
];

describe("package exports", () => {
  test("meyda node exports at least currently expected fields", () => {
    var meyda = require("../dist/node/main");

    expect(Object.keys(meyda)).toEqual(EXPECTED_EXPORTS);
  });
});
