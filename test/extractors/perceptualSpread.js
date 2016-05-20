const chai = require('chai');
const assert = chai.assert;
const TestData = require('../TestData');

// Setup
const perceptualSpread = require('../../dist/node/extractors/perceptualSpread');

describe('perceptualSpread', () => {
  it('should return correct Spread value given valid signal', (done) => {
    const en = perceptualSpread({
      signal: TestData.VALID_SIGNAL,
      ampSpectrum: TestData.VALID_AMPLITUDE_SPECTRUM,
      barkScale: TestData.VALID_BARK_SCALE,
    });

    assert.equal(en, 0.8947325916336791);

    done();
  });

  it('should throw an error when passed an empty object', (done) => {
    try {
      perceptualSpread({});
    } catch (e) {
      done();
    }
  });

  it('should throw an error when not passed anything', (done) => {
    try {
      perceptualSpread();
    } catch (e) {
      done();
    }
  });

  it('should throw an error when passed something invalid', (done) => {
    try {
      perceptualSpread({ signal: 'not a signal' });
    } catch (e) {
      done();
    }
  });
});
