var chai = require('chai');
var assert = chai.assert;
var TestData = require('../TestData');

// Setup
var spectralSkewness = require('../../dist/node/extractors/spectralSkewness');

describe('spectralSkewness', function () {
  it('should return correct Spectral Skewness value', function (done) {
    var en = spectralSkewness({
      ampSpectrum:TestData.VALID_AMPLITUDE_SPECTRUM,
    });

    assert.equal(en, 1.6950674362270297);

    done();
  });

  it('should throw an error when passed an empty object', function (done) {
    try {
      var en = spectralSkewness({});
    } catch (e) {
      done();
    }
  });

  it('should throw an error when not passed anything', function (done) {
    try {
      var en = spectralSkewness();
    } catch (e) {
      done();
    }
  });

  it('should throw an error when passed something invalid', function (done) {
    try {
      var en = spectralSkewness({ signal:'not a signal' });
    } catch (e) {
      done();
    }
  });
});
