import TestData from "../TestData";
var utilities = require("../../dist/node/utilities");

// Setup
var chroma = require("../../dist/node/extractors/chroma");

describe("chroma", () => {
  test("should return correct chroma value given a valid signal", (done) => {
    var chromagram = chroma({
      sampleRate: 44100,
      bufferSize: 512,
      ampSpectrum: TestData.VALID_AMPLITUDE_SPECTRUM,
      chromaFilterBank: utilities.createChromaFilterBank(12, 44100, 512),
    });

    for (var i in TestData.EXPECTED_CHROMAGRAM_OUTPUT) {
      expect(
        Math.abs(chromagram[i] - TestData.EXPECTED_CHROMAGRAM_OUTPUT[i])
      ).toBeLessThanOrEqual(1e-5);
    }

    done();
  });

  test("should throw an error when passed an empty object", (done) => {
    try {
      var chromagram = chroma({});
    } catch (e) {
      done();
    }
  });

  test("should throw an error when not passed anything", (done) => {
    try {
      var chromagram = chroma();
    } catch (e) {
      done();
    }
  });

  test("should throw an error when passed something invalid", (done) => {
    try {
      var chromagram = chroma({ ampSpectrum: "not a signal" });
    } catch (e) {
      done();
    }
  });
});
