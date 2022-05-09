import TestData from "../TestData";
import * as utilities from "../../dist/node/utilities";

// Setup
import chroma from "../../dist/node/extractors/chroma";

describe("chroma", () => {
  test("should return correct chroma value given a valid signal", (done) => {
    const chromagram = chroma({
      sampleRate: 44100,
      bufferSize: 512,
      ampSpectrum: TestData.VALID_AMPLITUDE_SPECTRUM,
      chromaFilterBank: utilities.createChromaFilterBank(12, 44100, 512),
    });

    for (const i in TestData.EXPECTED_CHROMAGRAM_OUTPUT) {
      expect(
        Math.abs(chromagram[i] - TestData.EXPECTED_CHROMAGRAM_OUTPUT[i])
      ).toBeLessThanOrEqual(1e-5);
    }

    done();
  });

  test("should throw an error when passed an empty object", (done) => {
    try {
      const chromagram = chroma({});
      chromagram;
    } catch (e) {
      done();
    }
  });

  test("should throw an error when not passed anything", (done) => {
    try {
      const chromagram = chroma();
      chromagram;
    } catch (e) {
      done();
    }
  });

  test("should throw an error when passed something invalid", (done) => {
    try {
      const chromagram = chroma({ ampSpectrum: "not a signal" });
      chromagram;
    } catch (e) {
      done();
    }
  });
});
