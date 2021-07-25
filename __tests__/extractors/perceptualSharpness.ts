import TestData from "../TestData";

// Setup
var percSharp = require("../../dist/node/extractors/perceptualSharpness");

describe("percSharp", () => {
  test("should return percSharp value given a valid signal", (done) => {
    var en = percSharp({
      signal: TestData.VALID_SIGNAL,
      ampSpectrum: TestData.VALID_AMPLITUDE_SPECTRUM,
      barkScale: TestData.VALID_BARK_SCALE,
    });

    expect(en).toEqual(0.6469286541680944);

    done();
  });

  test("should throw an error when passed an empty object", (done) => {
    try {
      var en = percSharp({});
    } catch (e) {
      done();
    }
  });

  test("should throw an error when not passed anything", (done) => {
    try {
      var en = percSharp();
    } catch (e) {
      done();
    }
  });

  test("should throw an error when passed something invalid", (done) => {
    try {
      var en = percSharp({ signal: "not a signal" });
    } catch (e) {
      done();
    }
  });
});
