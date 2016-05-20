const chai = require('chai');
const assert = chai.assert;
const TestData = require('../TestData');

// Setup
const zcr = require('../../dist/node/extractors/zcr');

describe('zcr', () => {
  it('should return correct zcr value', (done) => {
    const en = zcr({
      signal: TestData.VALID_SIGNAL,
    });

    assert.equal(en, 35);

    done();
  });

  it('should throw an error when passed an empty object', (done) => {
    try {
      zcr({});
    } catch (e) {
      done();
    }
  });

  it('should throw an error when not passed anything', (done) => {
    try {
      zcr();
    } catch (e) {
      done();
    }
  });

  it('should throw an error when passed something invalid', (done) => {
    try {
      zcr({ signal: 'not a signal' });
    } catch (e) {
      done();
    }
  });
});
