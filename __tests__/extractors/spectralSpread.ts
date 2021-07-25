import TestData from "../TestData";

// Setup
var spectralSpread = require("../../dist/node/extractors/spectralSpread");

describe("spectralSpread", () => {
  test("should return correct Spectral Spread value", (done) => {
    var en = spectralSpread({
      ampSpectrum: TestData.VALID_AMPLITUDE_SPECTRUM,
    });

    expect(en).toEqual(61.47230858577843);

    done();
  });

  test("should throw an error when passed an empty object", (done) => {
    try {
      var en = spectralSpread({});
    } catch (e) {
      done();
    }
  });

  test("should throw an error when not passed anything", (done) => {
    try {
      var en = spectralSpread();
    } catch (e) {
      done();
    }
  });

  test("should throw an error when passed something invalid", (done) => {
    try {
      var en = spectralSpread({ signal: "not a signal" });
    } catch (e) {
      done();
    }
  });
});
