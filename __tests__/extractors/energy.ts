import TestData from "../TestData";

// Setup
const energy = require("../../dist/node/extractors/energy");

describe("energy", () => {
  test("should return the correct value given a valid signal", (done) => {
    const en = energy({
      signal: TestData.VALID_SIGNAL,
    });

    expect(en).toEqual(3.6735467237693653);

    done();
  });

  test("should throw an error when passed an empty object", (done) => {
    try {
      const en = energy({});
    } catch (e) {
      done();
    }
  });

  test("should throw an error when not passed anything", (done) => {
    try {
      const en = energy();
    } catch (e) {
      done();
    }
  });

  test("should throw an error when passed something invalid", (done) => {
    try {
      const en = energy({ signal: "not a signal" });
    } catch (e) {
      done();
    }
  });
});
