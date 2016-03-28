var chai = require('chai');
var assert = chai.assert;
var TestData = require('../TestData');

// Setup
var powerSpectrum = require('../../dist/node/extractors/powerSpectrum');

describe('powerSpectrum', function () {
  it('should return correct Power Spectrum value', function (done) {
    var en = powerSpectrum({
      ampSpectrum:TestData.VALID_AMPLITUDE_SPECTRUM,
    });

    assert.deepEqual(en, TestData.EXPECTED_POWER_SPECTRUM_OUTPUT);

    done();
  });

  it('should throw an error when passed an empty object', function (done) {
    try {
      var en = powerSpectrum({});
    } catch (e) {
      done();
    }
  });

  it('should throw an error when not passed anything', function (done) {
    try {
      var en = powerSpectrum();
    } catch (e) {
      done();
    }
  });

  it('should throw an error when passed something invalid', function (done) {
    try {
      var en = powerSpectrum({ signal:'not a signal' });
    } catch (e) {
      done();
    }
  });
});
