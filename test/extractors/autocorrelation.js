var chai = require('chai');
var assert = chai.assert;
var TestData = require('../TestData');

// Setup
var autocorrelation = require('../../dist/node/extractors/autocorrelation');

describe('autocorrelation', function () {
  it('should return correct autocorrelation value', function (done) {
    var en = autocorrelation({
      signal:TestData.VALID_SIGNAL,
    });

    assert.deepEqual(en, TestData.VALID_AUTOCORRELATION);

    done();
  });

  it('should throw an error when passed an empty object', function (done) {
    try {
      var en = autocorrelation({});
    } catch (e) {
      done();
    }
  });

  it('should throw an error when not passed anything', function (done) {
    try {
      var en = autocorrelation();
    } catch (e) {
      done();
    }
  });

  it('should throw an error when passed something invalid', function (done) {
    try {
      var en = autocorrelation({ signal:'not a signal' });
    } catch (e) {
      done();
    }
  });
});
