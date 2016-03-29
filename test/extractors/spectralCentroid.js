var chai = require('chai');
var assert = chai.assert;
var TestData = require('../TestData');

// Setup
var spectralCentroid = require('../../dist/node/extractors/spectralCentroid');

describe('spectralCentroid', function () {
  it('should return correct Spectral Centroid value', function (done) {
    var en = spectralCentroid({
      ampSpectrum:TestData.VALID_AMPLITUDE_SPECTRUM,
    });

    assert.equal(en, 45.12823119078897);

    done();
  });

  it('should throw an error when passed an empty object', function (done) {
    try {
      var en = spectralCentroid({});
    } catch (e) {
      done();
    }
  });

  it('should throw an error when not passed anything', function (done) {
    try {
      var en = spectralCentroid();
    } catch (e) {
      done();
    }
  });

  it('should throw an error when passed something invalid', function (done) {
    try {
      var en = spectralCentroid({ signal:'not a signal' });
    } catch (e) {
      done();
    }
  });
});
