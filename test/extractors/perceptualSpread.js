var chai = require('chai');
var assert = chai.assert;
var TestData = require('../TestData');

// Setup
var perceptualSpread = require('../../dist/node/extractors/perceptualSpread');

describe('perceptualSpread', function () {
  it('should return correct Spread value given valid signal', function (done) {
    var en = perceptualSpread({
      signal:TestData.VALID_SIGNAL,
      ampSpectrum:TestData.VALID_AMPLITUDE_SPECTRUM,
      barkScale:TestData.VALID_BARK_SCALE,
    });

    assert.equal(en, 0.8947325916336791);

    done();
  });

  it('should throw an error when passed an empty object', function (done) {
    try {
      var en = perceptualSpread({});
    } catch (e) {
      done();
    }
  });

  it('should throw an error when not passed anything', function (done) {
    try {
      var en = perceptualSpread();
    } catch (e) {
      done();
    }
  });

  it('should throw an error when passed something invalid', function (done) {
    try {
      var en = perceptualSpread({ signal:'not a signal' });
    } catch (e) {
      done();
    }
  });
});
