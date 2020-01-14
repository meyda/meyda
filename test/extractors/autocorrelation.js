var chai = require('chai');
var assert = chai.assert;
var TestData = require('../TestData');

// Setup
var autocorrelation = require('../../dist/node/extractors/autocorrelation');
var sin128 = require('./autocorrelationTestData/sin128.json');
var sin128AC = require('./autocorrelationTestData/sin128.ac.json');

describe('autocorrelation', function () {
  it.only('should blah', function(done) {
    // assert.deepEqual(autocorrelation({signal: sin128}), new Float32Array(sin128AC));
    autocorrelation({signal:sin128}).forEach((element, index) => {
      try {
        assert.approximately(element, sin128AC[index], 5);
      } catch (e) {
        throw Error(`index: ${index}: ${element}, ${sin128AC[index]} \n${e.message}`);
      }
    });
  });

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
