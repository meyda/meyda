import TestData from "../TestData";

// Setup
import perceptualSpread from "../../dist/node/extractors/perceptualSpread";

describe("perceptualSpread", () => {
  test("should return correct Spread value given valid signal", (done) => {
    const en = perceptualSpread({
      signal: TestData.VALID_SIGNAL,
      ampSpectrum: TestData.VALID_AMPLITUDE_SPECTRUM,
      barkScale: TestData.VALID_BARK_SCALE,
    });

    expect(en).toEqual(0.8947325916336791);

    done();
  });

  test("should throw an error when passed an empty object", (done) => {
    try {
      const en = perceptualSpread({});
      en;
    } catch (e) {
      done();
    }
  });

  test("should throw an error when not passed anything", (done) => {
    try {
      const en = perceptualSpread();
      en;
    } catch (e) {
      done();
    }
  });

  test("should throw an error when passed something invalid", (done) => {
    try {
      const en = perceptualSpread({ signal: "not a signal" });
      en;
    } catch (e) {
      done();
    }
  });
});
