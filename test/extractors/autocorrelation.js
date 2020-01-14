var chai = require('chai');
var assert = chai.assert;

// Setup
var autocorrelation = require('../../dist/node/extractors/autocorrelation');
var sin128 = require('./autocorrelationTestData/sin128.json');
var sin128AC = require('./autocorrelationTestData/sin128.ac.json');

describe('autocorrelation', function () {
  it('should return correct autocorrelation value within an error rate', function() {
    let errorRate = 0.000002;
    const resultingAC = autocorrelation({signal:sin128});

    resultingAC.forEach((element, index) => {
      assert.approximately(element, sin128AC[index], errorRate);
    });
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
