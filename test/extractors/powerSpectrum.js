const chai = require('chai');
const assert = chai.assert;
const TestData = require('../TestData');

// Setup
const powerSpectrum = require('../../dist/node/extractors/powerSpectrum');

describe('powerSpectrum', () => {
  it('should return correct Power Spectrum value', (done) => {
    const en = powerSpectrum({
      ampSpectrum: TestData.VALID_AMPLITUDE_SPECTRUM,
    });

    assert.deepEqual(en, TestData.EXPECTED_POWER_SPECTRUM_OUTPUT);

    done();
  });

  it('should throw an error when passed an empty object', (done) => {
    try {
      powerSpectrum({});
    } catch (e) {
      done();
    }
  });

  it('should throw an error when not passed anything', (done) => {
    try {
      powerSpectrum();
    } catch (e) {
      done();
    }
  });

  it('should throw an error when passed something invalid', (done) => {
    try {
      powerSpectrum({ signal: 'not a signal' });
    } catch (e) {
      done();
    }
  });
});
