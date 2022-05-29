import TestData from "../TestData";
var utilities = require("../../dist/node/utilities");

// Setup
var melBands = require("../../dist/node/extractors/melBands");

describe("melBands", () => {
  test("should return correct melBands value given a valid signal", (done) => {
    var en = melBands({
      sampleRate: 44100,
      bufferSize: 512,
      ampSpectrum: TestData.VALID_AMPLITUDE_SPECTRUM,
      melFilterBank: utilities.createMelFilterBank(26, 44100, 512),
    });

    const expectedValues = [
      0.05362230911850929, 0.5754691362380981, 0.18804392218589783,
      0.25777846574783325, 0.14160922169685364, 0.09012959152460098,
      0.08216794580221176, 0.020733006298542023, 0.01394730806350708,
      0.008802562952041626, 0.01255915779620409, 0.011275732889771461,
      0.01811823807656765, 0.00460180826485157, 0.0031142467632889748,
      0.00262887473218143, 0.0025565065443515778, 0.0038858000189065933,
      0.03446952626109123, 0.004388371482491493, 0.00174950051587075,
      0.0015815229853615165, 0.0013017841847613454, 0.0012407194590196013,
      0.0012172914575785398, 0.001246776431798935,
    ];

    expect(expectedValues).toEqual(en);
    expect(expectedValues.length).toEqual(en.length);
    done();
  });

  test("should return only 3 correct melBands values given a valid signal", (done) => {
    var en = melBands({
      sampleRate: 44100,
      bufferSize: 512,
      ampSpectrum: TestData.VALID_AMPLITUDE_SPECTRUM,
      melFilterBank: utilities.createMelFilterBank(3, 44100, 512),
    });

    expect(3).toEqual(en.length);
    done();
  });

  test("should return only 40 correct melBands values given a valid signal", (done) => {
    var en = melBands({
      sampleRate: 44100,
      bufferSize: 512,
      ampSpectrum: TestData.VALID_AMPLITUDE_SPECTRUM,
      melFilterBank: utilities.createMelFilterBank(40, 44100, 512),
    });

    expect(40).toEqual(en.length);
    done();
  });

  test("should throw an error when passed an empty object", (done) => {
    try {
      var en = melBands({});
    } catch (e) {
      done();
    }
  });

  test("should throw an error when not passed anything", (done) => {
    try {
      var en = melBands();
    } catch (e) {
      done();
    }
  });

  test("should throw an error when passed something invalid", (done) => {
    try {
      var en = melBands({ signal: "not a signal" });
    } catch (e) {
      done();
    }
  });
});
