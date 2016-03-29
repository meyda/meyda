var chai = require('chai');
var assert = chai.assert;
var TestData = require('../TestData');

// Setup
var spectralSlope = require('../../dist/node/extractors/spectralSlope');

describe('spectralSlope', function () {
  it('should return correct Spectral Slope value', function (done) {
    var en = spectralSlope({
      ampSpectrum:TestData.VALID_AMPLITUDE_SPECTRUM,
      sampleRate:44100,
      bufferSize:512,
    });

    assert.equal(en < 0.0000003, true);

    done();
  });

  it('should throw an error when passed an empty object', function (done) {
    try {
      var en = spectralSlope({});
    } catch (e) {
      done();
    }
  });

  it('should throw an error when not passed anything', function (done) {
    try {
      var en = spectralSlope();
    } catch (e) {
      done();
    }
  });

  it('should throw an error when passed something invalid', function (done) {
    try {
      var en = spectralSlope({ signal:'not a signal' });
    } catch (e) {
      done();
    }
  });
});
