const chai = require('chai');
const assert = chai.assert;
const TestData = require('../TestData');

// Setup
const percSharp = require('../../dist/node/extractors/perceptualSharpness');

describe('percSharp', () => {
  it('should return percSharp value given a valid signal', (done) => {
    const en = percSharp({
      signal: TestData.VALID_SIGNAL,
      ampSpectrum: TestData.VALID_AMPLITUDE_SPECTRUM,
      barkScale: TestData.VALID_BARK_SCALE,
    });

    assert.equal(en, 0.6469286541680944);

    done();
  });

  it('should throw an error when passed an empty object', (done) => {
    try {
      percSharp({});
    } catch (e) {
      done();
    }
  });

  it('should throw an error when not passed anything', (done) => {
    try {
      percSharp();
    } catch (e) {
      done();
    }
  });

  it('should throw an error when passed something invalid', (done) => {
    try {
      percSharp({ signal: 'not a signal' });
    } catch (e) {
      done();
    }
  });
});
