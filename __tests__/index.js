var meyda = require("../dist/node");

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

describe("main", () => {
  test("meyda exports at least currently expected fields", () => {
    expect(Object.keys(meyda)).toEqual(EXPECTED_EXPORTS);
  });
});
