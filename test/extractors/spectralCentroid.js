const chai = require('chai');
const assert = chai.assert;
const TestData = require('../TestData');

// Setup
const spectralCentroid = require('../../dist/node/extractors/spectralCentroid');

describe('spectralCentroid', () => {
  it('should return correct Spectral Centroid value', (done) => {
    const en = spectralCentroid({
      ampSpectrum: TestData.VALID_AMPLITUDE_SPECTRUM,
    });

    assert.equal(en, 45.12823119078897);

    done();
  });

  it('should throw an error when passed an empty object', (done) => {
    try {
      spectralCentroid({});
    } catch (e) {
      done();
    }
  });

  it('should throw an error when not passed anything', (done) => {
    try {
      spectralCentroid();
    } catch (e) {
      done();
    }
  });

  it('should throw an error when passed something invalid', (done) => {
    try {
      spectralCentroid({ signal: 'not a signal' });
    } catch (e) {
      done();
    }
  });
});
