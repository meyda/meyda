var chai = require('chai');
var assert = chai.assert;
var TestData = require('../TestData');

// Setup
var autocorrelation = require('../../dist/node/extractors/autocorrelation');
var sin128 = require('./autocorrelationTestData/sin128.json');
var sin128AC = require('./autocorrelationTestData/sin128.ac.json');

describe('autocorrelation', function () {
  it.only('should return correct autocorrelation value within an error rate', function() {
    let errorRate = 0.00001;
    const resultingAC = autocorrelation({signal:sin128});
    while (errorRate > 0.000000000001) {
      try {

        resultingAC.forEach((element, index) => {
          assert.approximately(element, sin128AC[index], errorRate);
        });
        errorRate *= 0.9;
      } catch (e) {
        throw Error(`Failed approximate check with error rate ${errorRate}`);
      }
    }
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
