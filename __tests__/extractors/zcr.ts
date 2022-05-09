import TestData from "../TestData";

// Setup
import zcr from "../../dist/node/extractors/zcr";

describe("zcr", () => {
  test("should return correct zcr value", (done) => {
    const en = zcr({
      signal: TestData.VALID_SIGNAL,
    });

    expect(en).toEqual(35);

    done();
  });

  test("should throw an error when passed an empty object", (done) => {
    try {
      const en = zcr({});
      en;
    } catch (e) {
      done();
    }
  });

  test("should throw an error when not passed anything", (done) => {
    try {
      const en = zcr();
      en;
    } catch (e) {
      done();
    }
  });

  test("should throw an error when passed something invalid", (done) => {
    try {
      const en = zcr({ signal: "not a signal" });
      en;
    } catch (e) {
      done();
    }
  });
});
