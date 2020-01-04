var chai = require('chai');
var assert = chai.assert;
var TestData = require('../TestData');

// Setup
var spectralKurtosis = require('../../dist/node/extractors/spectralKurtosis');

describe('spectralKurtosis', function () {
  it('should return correct Spectral Kurtosis value', function (done) {
    var en = spectralKurtosis({
      ampSpectrum:TestData.VALID_AMPLITUDE_SPECTRUM,
    });

    assert.approximately(en, 0.1511072674115075, 1e-15);

    done();
  });

  it('should throw an error when passed an empty object', function (done) {
    try {
      var en = spectralKurtosis({});
    } catch (e) {
      done();
    }
  });

  it('should throw an error when not passed anything', function (done) {
    try {
      var en = spectralKurtosis();
    } catch (e) {
      done();
    }
  });

  it('should throw an error when passed something invalid', function (done) {
    try {
      var en = spectralKurtosis({ signal:'not a signal' });
    } catch (e) {
      done();
    }
  });
});
