var chai = require('chai');
var assert = chai.assert;
var TestData = require('../TestData');

// Setup
var energy = require('../../dist/node/extractors/energy');

describe('energy', function () {
  it('should return the correct value given a valid signal', function (done) {
    var en = energy({
      signal:TestData.VALID_SIGNAL,
    });

    assert.equal(en, 3.6735467237693653);

    done();
  });

  it('should throw an error when passed an empty object', function (done) {
    try {
      var en = energy({});
    } catch (e) {
      done();
    }

  });

  it('should throw an error when not passed anything', function (done) {
    try {
      var en = energy();
    } catch (e) {
      done();
    }
  });

  it('should throw an error when passed something invalid', function (done) {
    try {
      var en = energy({ signal:'not a signal' });
    } catch (e) {
      done();
    }
  });
});
