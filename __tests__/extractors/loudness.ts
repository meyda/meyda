import TestData from "../TestData";

// Setup
var loudness = require("../../dist/node/extractors/loudness");

describe("loudness", () => {
  test("should return correct value given a valid signal", (done) => {
    var en = loudness({
      ampSpectrum: TestData.VALID_AMPLITUDE_SPECTRUM,
      barkScale: TestData.VALID_BARK_SCALE,
    });

    expect(en).toEqual({
      specific: new Float32Array([
        0.8241609334945679, 0.971539318561554, 0.7246851921081543,
        0.868057370185852, 0.9084116816520691, 0.5983786582946777,
        0.8250990509986877, 0.8279480338096619, 0.6802764534950256,
        0.6513881683349609, 0.6347343325614929, 0.6553743481636047,
        0.6563374996185303, 0.7111011147499084, 0.694219172000885,
        0.7696076035499573, 0.677422285079956, 0.6804705262184143,
        0.668949544429779, 0.6583544611930847, 0.8762503862380981,
        0.7247303128242493, 0.7742922306060791, 0.8974387645721436,
      ]),
      total: 17.959227442741394,
    });

    done();
  });

  test("should throw an error when passed an empty object", (done) => {
    try {
      var en = loudness({});
    } catch (e) {
      done();
    }
  });

  test("should throw an error when not passed anything", (done) => {
    try {
      var en = loudness();
    } catch (e) {
      done();
    }
  });

  test("should throw an error when passed something invalid", (done) => {
    try {
      var en = loudness({ signal: "not a signal" });
    } catch (e) {
      done();
    }
  });
});
