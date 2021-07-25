import TestData from "../TestData";

// Setup
var spectralRolloff = require("../../dist/node/extractors/spectralRolloff");

describe("spectralRolloff", () => {
  test("should return correct Spectral Rolloff value", (done) => {
    var en = spectralRolloff({
      ampSpectrum: TestData.VALID_AMPLITUDE_SPECTRUM,
      sampleRate: 44100,
    });

    expect(en).toEqual(21012.35294117647);

    done();
  });

  test("should throw an error when passed an empty object", (done) => {
    try {
      var en = spectralRolloff({});
    } catch (e) {
      done();
    }
  });

  test("should throw an error when not passed anything", (done) => {
    try {
      var en = spectralRolloff();
    } catch (e) {
      done();
    }
  });

  test("should throw an error when passed something invalid", (done) => {
    try {
      var en = spectralRolloff({ signal: "not a signal" });
    } catch (e) {
      done();
    }
  });
});
