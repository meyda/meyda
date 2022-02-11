import TestData from "../TestData";

// Setup
const spectralKurtosis = require("../../dist/node/extractors/spectralKurtosis");

describe("spectralKurtosis", () => {
  test("should return correct Spectral Kurtosis value", (done) => {
    const en = spectralKurtosis({
      ampSpectrum: TestData.VALID_AMPLITUDE_SPECTRUM,
    });

    expect(Math.abs(en - 0.1511072674115075)).toBeLessThanOrEqual(1e-15);

    done();
  });

  test("should throw an error when passed an empty object", (done) => {
    try {
      const en = spectralKurtosis({});
    } catch (e) {
      done();
    }
  });

  test("should throw an error when not passed anything", (done) => {
    try {
      const en = spectralKurtosis();
    } catch (e) {
      done();
    }
  });

  test("should throw an error when passed something invalid", (done) => {
    try {
      const en = spectralKurtosis({ signal: "not a signal" });
    } catch (e) {
      done();
    }
  });
});
