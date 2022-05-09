import TestData from "../TestData";

// Setup
import spectralCentroid from "../../dist/node/extractors/spectralCentroid";

describe("spectralCentroid", () => {
  test("should return correct Spectral Centroid value", (done) => {
    const en = spectralCentroid({
      ampSpectrum: TestData.VALID_AMPLITUDE_SPECTRUM,
    });

    expect(en).toEqual(45.12823119078897);

    done();
  });

  test("should throw an error when passed an empty object", (done) => {
    try {
      const en = spectralCentroid({});
      en;
    } catch (e) {
      done();
    }
  });

  test("should throw an error when not passed anything", (done) => {
    try {
      const en = spectralCentroid();
      en;
    } catch (e) {
      done();
    }
  });

  test("should throw an error when passed something invalid", (done) => {
    try {
      const en = spectralCentroid({ signal: "not a signal" });
      en;
    } catch (e) {
      done();
    }
  });
});
