var chai = require('chai');
var assert = chai.assert;
var TestData = require('../TestData');

// Setup
var spectralRolloff = require('../../dist/node/extractors/spectralRolloff');

describe('spectralRolloff', function () {
  it('should return correct Spectral Rolloff value', function (done) {
    var en = spectralRolloff({
      ampSpectrum:TestData.VALID_AMPLITUDE_SPECTRUM,
      sampleRate:44100,
    });

    assert.equal(en, 21012.35294117647);

    done();
  });

  it('should throw an error when passed an empty object', function (done) {
    try {
      var en = spectralRolloff({});
    } catch (e) {
      done();
    }
  });

  it('should throw an error when not passed anything', function (done) {
    try {
      var en = spectralRolloff();
    } catch (e) {
      done();
    }
  });

  it('should throw an error when passed something invalid', function (done) {
    try {
      var en = spectralRolloff({ signal:'not a signal' });
    } catch (e) {
      done();
    }
  });
});
