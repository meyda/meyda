const chai = require('chai');
const assert = chai.assert;
const TestData = require('../TestData');

// Setup
const spectralSpread = require('../../dist/node/extractors/spectralSpread');

describe('spectralSpread', () => {
  it('should return correct Spectral Spread value', (done) => {
    const en = spectralSpread({
      ampSpectrum: TestData.VALID_AMPLITUDE_SPECTRUM,
    });

    assert.equal(en, 61.47230858577843);

    done();
  });

  it('should throw an error when passed an empty object', (done) => {
    try {
      spectralSpread({});
    } catch (e) {
      done();
    }
  });

  it('should throw an error when not passed anything', (done) => {
    try {
      spectralSpread();
    } catch (e) {
      done();
    }
  });

  it('should throw an error when passed something invalid', (done) => {
    try {
      spectralSpread({ signal: 'not a signal' });
    } catch (e) {
      done();
    }
  });
});
