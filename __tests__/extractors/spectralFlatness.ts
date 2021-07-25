import TestData from "../TestData";

// Setup
var spectralFlatness = require("../../dist/node/extractors/spectralFlatness");

describe("spectralFlatness", () => {
  test("should return correct Spectral Flatness value", (done) => {
    var en = spectralFlatness({
      ampSpectrum: TestData.VALID_AMPLITUDE_SPECTRUM,
    });

    // Node 7 adds precision to Math.exp, we use Chai's approximate assertion
    // to account for the extra precision.
    expect(Math.abs(en - 0.4395908170404335)).toBeLessThanOrEqual(1e-16);

    done();
  });

  test("should throw an error when passed an empty object", (done) => {
    try {
      var en = spectralFlatness({});
    } catch (e) {
      done();
    }
  });

  test("should throw an error when not passed anything", (done) => {
    try {
      var en = spectralFlatness();
    } catch (e) {
      done();
    }
  });

  test("should throw an error when passed something invalid", (done) => {
    try {
      var en = spectralFlatness({ signal: "not a signal" });
    } catch (e) {
      done();
    }
  });
});
