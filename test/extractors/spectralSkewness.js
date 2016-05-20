const chai = require('chai');
const assert = chai.assert;
const TestData = require('../TestData');

// Setup
const spectralSkewness = require('../../dist/node/extractors/spectralSkewness');

describe('spectralSkewness', () => {
  it('should return correct Spectral Skewness value', (done) => {
    const en = spectralSkewness({
      ampSpectrum: TestData.VALID_AMPLITUDE_SPECTRUM,
    });

    assert.equal(en, 1.6950674362270297);

    done();
  });

  it('should throw an error when passed an empty object', (done) => {
    try {
      spectralSkewness({});
    } catch (e) {
      done();
    }
  });

  it('should throw an error when not passed anything', (done) => {
    try {
      spectralSkewness();
    } catch (e) {
      done();
    }
  });

  it('should throw an error when passed something invalid', (done) => {
    try {
      spectralSkewness({ signal: 'not a signal' });
    } catch (e) {
      done();
    }
  });
});
