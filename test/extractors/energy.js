const chai = require('chai');
const assert = chai.assert;
const TestData = require('../TestData');

// Setup
const energy = require('../../dist/node/extractors/energy');

describe('energy', () => {
  it('should return the correct value given a valid signal', (done) => {
    const en = energy({
      signal: TestData.VALID_SIGNAL,
    });

    assert.equal(en, 3.6735467237693653);

    done();
  });

  it('should throw an error when passed an empty object', (done) => {
    try {
      energy({});
    } catch (e) {
      done();
    }
  });

  it('should throw an error when not passed anything', (done) => {
    try {
      energy();
    } catch (e) {
      done();
    }
  });

  it('should throw an error when passed something invalid', (done) => {
    try {
      energy({ signal: 'not a signal' });
    } catch (e) {
      done();
    }
  });
});
