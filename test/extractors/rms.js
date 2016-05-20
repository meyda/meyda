const chai = require('chai');
const assert = chai.assert;
const TestData = require('../TestData');

// Setup
const rms = require('../../dist/node/extractors/rms');

describe('rms', () => {
  it('should return correct rms value given a valid signal', (done) => {
    const en = rms({
      signal: TestData.VALID_SIGNAL,
    });

    assert.equal(en, 0.08470475751020153);

    done();
  });

  it('should throw an error when passed an empty object', (done) => {
    try {
      rms({});
    } catch (e) {
      done();
    }
  });

  it('should throw an error when not passed anything', (done) => {
    try {
      rms();
    } catch (e) {
      done();
    }
  });

  it('should throw an error when passed something invalid', (done) => {
    try {
      rms({ signal: 'not a signal' });
    } catch (e) {
      done();
    }
  });
});
