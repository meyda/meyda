import TestData from "../TestData";

// Setup
var spectralFlux = require("../../dist/node/extractors/spectralFlux");

describe("spectralFlux", () => {
  test("should return correct Spectral Flux value", (done) => {
    var en = spectralFlux({
      ampSpectrum: TestData.VALID_AMPLITUDE_SPECTRUM,
      previousAmpSpectrum: TestData.VALID_AMPLITUDE_SPECTRUM.map(
        (e) => e * 0.8
      ),
    });

    expect(en).toEqual(6.8073007097613e-8);

    done();
  });

  test.skip("should throw an error when passed an empty object", (done) => {
    try {
      var en = spectralFlux({});
    } catch (e) {
      done();
    }
  });

  test.skip("should throw an error when not passed anything", (done) => {
    try {
      var en = spectralFlux();
    } catch (e) {
      done();
    }
  });

  test.skip("should throw an error when passed something invalid", (done) => {
    try {
      var en = spectralFlux({ signal: "not a signal" });
    } catch (e) {
      done();
    }
  });
});
