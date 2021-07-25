import TestData from "../TestData";
var utilities = require("../../dist/node/utilities");

// Setup
var mfcc = require("../../dist/node/extractors/mfcc");

describe("mfcc", () => {
  test("should return correct mfcc value given a valid signal", (done) => {
    var en = mfcc({
      sampleRate: 44100,
      bufferSize: 512,
      ampSpectrum: TestData.VALID_AMPLITUDE_SPECTRUM,
      melFilterBank: utilities.createMelFilterBank(26, 44100, 512),
    });

    const expectedValues = [
      3.0764786549843848, 2.5565860160012903, 1.864506100880325,
      1.2335562677762721, 0.4988162523764804, 0.09087259136810752,
      -0.20585442699270234, -0.44269584674462054, -0.3253486567336908,
      -0.37584086978198183, -0.5572731218776171, -0.5245475651926765,
      -0.6215721667512493,
    ];

    expect(expectedValues.length).toEqual(en.length);

    for (var index in en) {
      expect(Math.abs(en[index] - expectedValues[index])).toBeLessThanOrEqual(
        1e-15
      );
    }

    done();
  });

  test("should return only 3 correct mfcc values given a valid signal", (done) => {
    var en = mfcc({
      sampleRate: 44100,
      bufferSize: 512,
      ampSpectrum: TestData.VALID_AMPLITUDE_SPECTRUM,
      melFilterBank: utilities.createMelFilterBank(26, 44100, 512),
      numberOfMFCCCoefficients: 3,
    });

    const expectedValues = [
      3.0764786549843848, 2.5565860160012903, 1.864506100880325,
    ];

    expect(expectedValues.length).toEqual(en.length);

    for (var index in en) {
      expect(Math.abs(en[index] - expectedValues[index])).toBeLessThanOrEqual(
        1e-15
      );
    }

    done();
  });

  test("should return only 40 correct mfcc values given a valid signal", (done) => {
    var en = mfcc({
      sampleRate: 44100,
      bufferSize: 512,
      ampSpectrum: TestData.VALID_AMPLITUDE_SPECTRUM,
      melFilterBank: utilities.createMelFilterBank(40, 44100, 512),
      numberOfMFCCCoefficients: 40,
    });

    const expectedValues = [
      3.162861616932787, 2.631774226264287, 1.9119808162845584,
      1.2514199153407288, 0.486397957822833, 0.05257906181539599,
      -0.2520045416286077, -0.49585735294546857, -0.38466316958263563,
      -0.44818175405724836, -0.6672513607241057, -0.6686735919108686,
      -0.789241040586372, -0.855968554812388, -0.7559012649440329,
      -0.8343554237381223, -0.799337605151172, -0.7238357489234062,
      -0.8688463927736684, -0.8087429188034788, -0.6673245235771227,
      -0.6080509624742819, -0.3249701900706408, -0.08770548307506015,
      0.06286020820571536, 0.29333780777697666, 0.2784715992409729,
      0.23014381333962616, 0.3500576154282103, 0.33428294279172033,
      0.40985070990105343, 0.6339035754249981, 0.7927495440032222,
      1.1026760276121124, 1.364591123252153, 1.4136099189401947,
      1.5027304491725944, 1.3659130982845602, 0.9699232061961626,
      0.5762094772418701,
    ];

    expect(expectedValues.length).toEqual(en.length);

    for (var index in en) {
      expect(Math.abs(en[index] - expectedValues[index])).toBeLessThanOrEqual(
        1e-15
      );
    }

    done();
  });

  test("should throw an error when passed an empty object", (done) => {
    try {
      var en = mfcc({});
    } catch (e) {
      done();
    }
  });

  test("should throw an error when not passed anything", (done) => {
    try {
      var en = mfcc();
    } catch (e) {
      done();
    }
  });

  test("should throw an error when passed something invalid", (done) => {
    try {
      var en = mfcc({ signal: "not a signal" });
    } catch (e) {
      done();
    }
  });
});
