import TestData from "../TestData";

// Setup
var spectralCentroid = require("../../dist/node/extractors/spectralCentroid");

describe("spectralCentroid", () => {
  test("should return correct Spectral Centroid value", (done) => {
    var en = spectralCentroid({
      ampSpectrum: TestData.VALID_AMPLITUDE_SPECTRUM,
    });

    expect(en).toEqual(45.12823119078897);

    done();
  });

  test("should throw an error when passed an empty object", (done) => {
    try {
      var en = spectralCentroid({});
    } catch (e) {
      done();
    }
  });

  test("should throw an error when not passed anything", (done) => {
    try {
      var en = spectralCentroid();
    } catch (e) {
      done();
    }
  });

  test("should throw an error when passed something invalid", (done) => {
    try {
      var en = spectralCentroid({ signal: "not a signal" });
    } catch (e) {
      done();
    }
  });
});
