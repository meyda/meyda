var chai = require('chai');
var assert = chai.assert;
var TestData = require('../TestData');

// Setup
var rms = require('../../dist/node/extractors/rms');

describe('rms', function () {
  it('should return correct rms value given a valid signal', function (done) {
    var en = rms({
      signal:TestData.VALID_SIGNAL,
    });

    assert.equal(en, 0.08470475751020153);

    done();
  });

  it('should throw an error when passed an empty object', function (done) {
    try {
      var en = rms({});
    } catch (e) {
      done();
    }
  });

  it('should throw an error when not passed anything', function (done) {
    try {
      var en = rms();
    } catch (e) {
      done();
    }
  });

  it('should throw an error when passed something invalid', function (done) {
    try {
      var en = rms({ signal:'not a signal' });
    } catch (e) {
      done();
    }
  });
});
