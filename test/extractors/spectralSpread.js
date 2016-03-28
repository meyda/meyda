var chai = require('chai');
var assert = chai.assert;
var TestData = require('../TestData');

// Setup
var spectralSpread = require('../../dist/node/extractors/spectralSpread');

describe('spectralSpread', function () {
  it('should return correct Spectral Spread value', function (done) {
    var en = spectralSpread({
      ampSpectrum:TestData.VALID_AMPLITUDE_SPECTRUM,
    });

    assert.equal(en, 61.47230858577843);

    done();
  });

  it('should throw an error when passed an empty object', function (done) {
    try {
      var en = spectralSpread({});
    } catch (e) {
      done();
    }
  });

  it('should throw an error when not passed anything', function (done) {
    try {
      var en = spectralSpread();
    } catch (e) {
      done();
    }
  });

  it('should throw an error when passed something invalid', function (done) {
    try {
      var en = spectralSpread({ signal:'not a signal' });
    } catch (e) {
      done();
    }
  });
});
