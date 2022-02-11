import TestData from "../TestData";

// Setup
import rms from "../../dist/node/extractors/rms";

describe("rms", () => {
  test("should return correct rms value given a valid signal", (done) => {
    const en = rms({
      signal: TestData.VALID_SIGNAL,
    });

    expect(en).toEqual(0.08470475751020153);

    done();
  });

  test("should throw an error when passed an empty object", (done) => {
    try {
      const en = rms({});
      en;
    } catch (e) {
      done();
    }
  });

  test("should throw an error when not passed anything", (done) => {
    try {
      const en = rms();
      en;
    } catch (e) {
      done();
    }
  });

  test("should throw an error when passed something invalid", (done) => {
    try {
      const en = rms({ signal: "not a signal" });
      en;
    } catch (e) {
      done();
    }
  });
});
