import TestData from "../TestData";

// Setup
const spectralSkewness = require("../../dist/node/extractors/spectralSkewness");

describe("spectralSkewness", () => {
  test("should return correct Spectral Skewness value", (done) => {
    const en = spectralSkewness({
      ampSpectrum: TestData.VALID_AMPLITUDE_SPECTRUM,
    });

    expect(en).toEqual(1.6950674362270297);

    done();
  });

  test("should throw an error when passed an empty object", (done) => {
    try {
      const en = spectralSkewness({});
    } catch (e) {
      done();
    }
  });

  test("should throw an error when not passed anything", (done) => {
    try {
      const en = spectralSkewness();
    } catch (e) {
      done();
    }
  });

  test("should throw an error when passed something invalid", (done) => {
    try {
      const en = spectralSkewness({ signal: "not a signal" });
    } catch (e) {
      done();
    }
  });
});
