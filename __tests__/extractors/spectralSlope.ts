import TestData from "../TestData";

// Setup
import spectralSlope from "../../dist/node/extractors/spectralSlope";

describe("spectralSlope", () => {
  test("should return correct Spectral Slope value", (done) => {
    const en = spectralSlope({
      ampSpectrum: TestData.VALID_AMPLITUDE_SPECTRUM,
      sampleRate: 44100,
      bufferSize: 512,
    });

    expect(en < 0.0000003).toEqual(true);

    done();
  });

  test("should throw an error when passed an empty object", (done) => {
    try {
      const en = spectralSlope({});
      en;
    } catch (e) {
      done();
    }
  });

  test("should throw an error when not passed anything", (done) => {
    try {
      const en = spectralSlope();
      en;
    } catch (e) {
      done();
    }
  });

  test("should throw an error when passed something invalid", (done) => {
    try {
      const en = spectralSlope({ signal: "not a signal" });
      en;
    } catch (e) {
      done();
    }
  });
});
