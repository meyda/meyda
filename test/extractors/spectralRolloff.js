const chai = require('chai');
const assert = chai.assert;
const TestData = require('../TestData');

// Setup
const spectralRolloff = require('../../dist/node/extractors/spectralRolloff');

describe('spectralRolloff', () => {
  it('should return correct Spectral Rolloff value', (done) => {
    const en = spectralRolloff({
      ampSpectrum: TestData.VALID_AMPLITUDE_SPECTRUM,
      sampleRate: 44100,
    });

    assert.equal(en, 21012.35294117647);

    done();
  });

  it('should throw an error when passed an empty object', (done) => {
    try {
      spectralRolloff({});
    } catch (e) {
      done();
    }
  });

  it('should throw an error when not passed anything', (done) => {
    try {
      spectralRolloff();
    } catch (e) {
      done();
    }
  });

  it('should throw an error when passed something invalid', (done) => {
    try {
      spectralRolloff({ signal: 'not a signal' });
    } catch (e) {
      done();
    }
  });
});
