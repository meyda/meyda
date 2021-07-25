import TestData from "../TestData";

// Setup
var zcr = require("../../dist/node/extractors/zcr");

describe("zcr", () => {
  test("should return correct zcr value", (done) => {
    var en = zcr({
      signal: TestData.VALID_SIGNAL,
    });

    expect(en).toEqual(35);

    done();
  });

  test("should throw an error when passed an empty object", (done) => {
    try {
      var en = zcr({});
    } catch (e) {
      done();
    }
  });

  test("should throw an error when not passed anything", (done) => {
    try {
      var en = zcr();
    } catch (e) {
      done();
    }
  });

  test("should throw an error when passed something invalid", (done) => {
    try {
      var en = zcr({ signal: "not a signal" });
    } catch (e) {
      done();
    }
  });
});
