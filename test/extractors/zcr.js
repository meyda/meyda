var chai = require('chai');
var assert = chai.assert;
var TestData = require('../TestData');

// Setup
var zcr = require('../../dist/node/extractors/zcr');

describe('zcr', function () {
  it('should return correct zcr value', function (done) {
    var en = zcr({
      signal:TestData.VALID_SIGNAL,
    });

    assert.equal(en, 35);

    done();
  });

  it('should throw an error when passed an empty object', function (done) {
    try {
      var en = zcr({});
    } catch (e) {
      done();
    }
  });

  it('should throw an error when not passed anything', function (done) {
    try {
      var en = zcr();
    } catch (e) {
      done();
    }
  });

  it('should throw an error when passed something invalid', function (done) {
    try {
      var en = zcr({ signal:'not a signal' });
    } catch (e) {
      done();
    }
  });
});
