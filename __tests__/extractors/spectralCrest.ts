import TestData from "../TestData";

// Setup
var spectralCrest = require("../../dist/node/extractors/spectralCrest");

describe("spectralCrest", () => {
  test("should return correct spectrla crest value", (done) => {
    var en = spectralCrest({
      ampSpectrum: TestData.VALID_AMPLITUDE_SPECTRUM,
    });

    expect(en).toEqual(10.35858484810692);

    done();
  });

  test("should throw an error when passed an empty object", (done) => {
    try {
      var en = spectralCrest({});
    } catch (e) {
      done();
    }
  });

  test("should throw an error when not passed anything", (done) => {
    try {
      var en = spectralCrest();
    } catch (e) {
      done();
    }
  });

  test("should throw an error when passed something invalid", (done) => {
    try {
      var en = spectralCrest({ signal: "not a signal" });
    } catch (e) {
      done();
    }
  });
});
