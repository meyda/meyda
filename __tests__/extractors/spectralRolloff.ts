import TestData from "../TestData";

// Setup
const spectralRolloff = require("../../dist/node/extractors/spectralRolloff");

describe("spectralRolloff", () => {
  test("should return correct Spectral Rolloff value", (done) => {
    const en = spectralRolloff({
      ampSpectrum: TestData.VALID_AMPLITUDE_SPECTRUM,
      sampleRate: 44100,
    });

    expect(en).toEqual(21012.35294117647);

    done();
  });

  test("should throw an error when passed an empty object", (done) => {
    try {
      const en = spectralRolloff({});
      en;
    } catch (e) {
      done();
    }
  });

  test("should throw an error when not passed anything", (done) => {
    try {
      const en = spectralRolloff();
      en;
    } catch (e) {
      done();
    }
  });

  test("should throw an error when passed something invalid", (done) => {
    try {
      const en = spectralRolloff({ signal: "not a signal" });
      en;
    } catch (e) {
      done();
    }
  });
});
