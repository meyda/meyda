var chai = require('chai');
var assert = chai.assert;

// Setup
var { autocorrelation, autocorrelationFreq } = require('../../dist/node/extractors/autocorrelation');
var { fft } = require('fftjs');
var sin128 = require('./autocorrelationTestData/sin128.json');
var sin128AC = require('./autocorrelationTestData/sin128.ac.json');

describe('autocorrelation frequency domain', function() {
  it('should be the same as the other implementation', function() {
    let errorRate = 9990.000002;
    const ampSpectrum = fft(sin128).real;
    const resultingAC = autocorrelationFreq({ampSpectrum});

    console.log(JSON.stringify(resultingAC));

    while (errorRate > 0.000000001) {
      resultingAC.forEach((element, index) => {
        assert.approximately(element, sin128AC[index], errorRate);
      });

      errorRate *= 0.9;
    }
  });
});

describe('autocorrelation', function() {
  it('should return correct autocorrelation value within an error rate', function() {
    const errorRate = 0.000002;
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
