import TestData from "../TestData";

// Setup
var rms = require("../../dist/node/extractors/rms");

describe("rms", () => {
  test("should return correct rms value given a valid signal", (done) => {
    var en = rms({
      signal: TestData.VALID_SIGNAL,
    });

    expect(en).toEqual(0.08470475751020153);

    done();
  });

  test("should throw an error when passed an empty object", (done) => {
    try {
      var en = rms({});
    } catch (e) {
      done();
    }
  });

  test("should throw an error when not passed anything", (done) => {
    try {
      var en = rms();
    } catch (e) {
      done();
    }
  });

  test("should throw an error when passed something invalid", (done) => {
    try {
      var en = rms({ signal: "not a signal" });
    } catch (e) {
      done();
    }
  });
});
