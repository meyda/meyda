const chai = require('chai');
const assert = chai.assert;
const TestData = require('../TestData');

// Setup
const spectralSlope = require('../../dist/node/extractors/spectralSlope');

describe('spectralSlope', () => {
  it('should return correct Spectral Slope value', (done) => {
    const en = spectralSlope({
      ampSpectrum: TestData.VALID_AMPLITUDE_SPECTRUM,
      sampleRate: 44100,
      bufferSize: 512,
    });

    assert.equal(en < 0.0000003, true);

    done();
  });

  it('should throw an error when passed an empty object', (done) => {
    try {
      spectralSlope({});
    } catch (e) {
      done();
    }
  });

  it('should throw an error when not passed anything', (done) => {
    try {
      spectralSlope();
    } catch (e) {
      done();
    }
  });

  it('should throw an error when passed something invalid', (done) => {
    try {
      spectralSlope({ signal: 'not a signal' });
    } catch (e) {
      done();
    }
  });
});
