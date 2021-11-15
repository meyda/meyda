import TestData from "../TestData";
import { fft } from "fftjs";

// Setup
var positiveFlux = require("../../dist/node/extractors/positiveFlux");

var COMPLEX_SPECTRUM = fft(TestData.VALID_SIGNAL);

describe("positiveFlux", () => {
  test("should return correct Positive Flux value", (done) => {
    var en = positiveFlux({
      complexSpectrum: COMPLEX_SPECTRUM,
      previousComplexSpectrum: {
        real: COMPLEX_SPECTRUM.real.map((e) => e * 0.8),
        imag: COMPLEX_SPECTRUM.real.map((e) => e * 0.8),
      },
      bufferSize: TestData.VALID_SIGNAL.length,
    });

    expect(en).toEqual(0.5028486117726443);

    done();
  });

  test.skip("should throw an error when passed an empty object", (done) => {
    try {
      var en = positiveFlux({});
    } catch (e) {
      done();
    }
  });

  test.skip("should throw an error when not passed anything", (done) => {
    try {
      var en = positiveFlux();
    } catch (e) {
      done();
    }
  });

  test.skip("should throw an error when passed something invalid", (done) => {
    try {
      var en = positiveFlux({ signal: "not a signal" });
    } catch (e) {
      done();
    }
  });
});
