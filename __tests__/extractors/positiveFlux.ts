import TestData from "../TestData";

// Setup
var positiveFlux = require("../../dist/node/extractors/positiveFlux");

describe("positiveFlux", () => {
  test("should return correct Positive Flux value", (done) => {
    var en = positiveFlux({
      ampSpectrum: TestData.VALID_AMPLITUDE_SPECTRUM.map((e) => e * 0.8),
      previousAmpSpectrum: TestData.VALID_AMPLITUDE_SPECTRUM,
    });

    expect(en).toEqual(2.8276224855864956e-8);

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
