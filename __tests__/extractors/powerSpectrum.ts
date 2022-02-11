import TestData from "../TestData";

// Setup
import powerSpectrum from "../../dist/node/extractors/powerSpectrum";

describe("powerSpectrum", () => {
  test("should return correct Power Spectrum value", (done) => {
    const en = powerSpectrum({
      ampSpectrum: TestData.VALID_AMPLITUDE_SPECTRUM,
    });

    expect(en).toEqual(TestData.EXPECTED_POWER_SPECTRUM_OUTPUT);

    done();
  });

  test("should throw an error when passed an empty object", (done) => {
    try {
      const en = powerSpectrum({});
      en;
    } catch (e) {
      done();
    }
  });

  test("should throw an error when not passed anything", (done) => {
    try {
      const en = powerSpectrum();
      en;
    } catch (e) {
      done();
    }
  });

  test("should throw an error when passed something invalid", (done) => {
    try {
      const en = powerSpectrum({ signal: "not a signal" });
      en;
    } catch (e) {
      done();
    }
  });
});
