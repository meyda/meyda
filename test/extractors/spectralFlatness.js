const chai = require('chai');
const assert = chai.assert;
const TestData = require('../TestData');

// Setup
const spectralFlatness = require('../../dist/node/extractors/spectralFlatness');

describe('spectralFlatness', () => {
  it('should return correct Spectral Flatness value', (done) => {
    const en = spectralFlatness({
      ampSpectrum: TestData.VALID_AMPLITUDE_SPECTRUM,
    });

    assert.equal(en, 0.4395908170404335);

    done();
  });

  it('should throw an error when passed an empty object', (done) => {
    try {
      spectralFlatness({});
    } catch (e) {
      done();
    }
  });

  it('should throw an error when not passed anything', (done) => {
    try {
      spectralFlatness();
    } catch (e) {
      done();
    }
  });

  it('should throw an error when passed something invalid', (done) => {
    try {
      spectralFlatness({ signal: 'not a signal' });
    } catch (e) {
      done();
    }
  });
});
