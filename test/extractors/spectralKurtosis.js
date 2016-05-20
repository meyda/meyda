const chai = require('chai');
const assert = chai.assert;
const TestData = require('../TestData');

// Setup
const spectralKurtosis = require('../../dist/node/extractors/spectralKurtosis');

describe('spectralKurtosis', () => {
  it('should return correct Spectral Kurtosis value', (done) => {
    const en = spectralKurtosis({
      ampSpectrum: TestData.VALID_AMPLITUDE_SPECTRUM,
    });

    assert.equal(en, 0.1511072674115075);

    done();
  });

  it('should throw an error when passed an empty object', (done) => {
    try {
      spectralKurtosis({});
    } catch (e) {
      done();
    }
  });

  it('should throw an error when not passed anything', (done) => {
    try {
      spectralKurtosis();
    } catch (e) {
      done();
    }
  });

  it('should throw an error when passed something invalid', (done) => {
    try {
      spectralKurtosis({ signal: 'not a signal' });
    } catch (e) {
      done();
    }
  });
});
