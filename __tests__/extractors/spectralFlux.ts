import TestData from "../TestData";
import { fft } from "fftjs";

// Setup
var spectralFlux = require("../../dist/node/extractors/spectralFlux");

var COMPLEX_SPECTRUM = fft(TestData.VALID_SIGNAL);

describe("spectralFlux", () => {
  test("should return correct Spectral Flux value", (done) => {
    var en = spectralFlux({
      complexSpectrum: COMPLEX_SPECTRUM,
      previousComplexSpectrum: {
        real: COMPLEX_SPECTRUM.real.map((e) => e * 0.8),
        imag: COMPLEX_SPECTRUM.real.map((e) => e * 0.8),
      },
      bufferSize: TestData.VALID_SIGNAL.length,
    });

    expect(en).toEqual(0.9351257452798406);

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
