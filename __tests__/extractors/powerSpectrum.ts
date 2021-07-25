import TestData from "../TestData";

// Setup
var powerSpectrum = require("../../dist/node/extractors/powerSpectrum");

describe("powerSpectrum", () => {
  test("should return correct Power Spectrum value", (done) => {
    var en = powerSpectrum({
      ampSpectrum: TestData.VALID_AMPLITUDE_SPECTRUM,
    });

    expect(en).toEqual(TestData.EXPECTED_POWER_SPECTRUM_OUTPUT);

    done();
  });

  test("should throw an error when passed an empty object", (done) => {
    try {
      var en = powerSpectrum({});
    } catch (e) {
      done();
    }
  });

  test("should throw an error when not passed anything", (done) => {
    try {
      var en = powerSpectrum();
    } catch (e) {
      done();
    }
  });

  test("should throw an error when passed something invalid", (done) => {
    try {
      var en = powerSpectrum({ signal: "not a signal" });
    } catch (e) {
      done();
    }
  });
});
