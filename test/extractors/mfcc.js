var chai = require('chai');
var assert = chai.assert;
var TestData = require('../TestData');
var utilities = require('../../dist/node/utilities');

// Setup
var mfcc = require('../../dist/node/extractors/mfcc');

describe('mfcc', function () {
  it('should return correct mfcc value given a valid signal', function (done) {
    var en = mfcc({
      sampleRate:44100,
      bufferSize:512,
      ampSpectrum:TestData.VALID_AMPLITUDE_SPECTRUM,
      melFilterBank:utilities.createMelFilterBank(26, 44100, 512),
    });

    const expectedValues = [
      -230.54681396484375,
      61.48476791381836,
      13.521626472473145,
      11.729072570800781,
      -6.710836887359619,
      -0.8134725093841553,
      -3.924482583999634,
      -14.846750259399414,
      5.131158351898193,
      2.84036922454834,
      -9.423062324523926,
      -0.7812660932540894,
      -4.733273029327393,
      -5.841785430908203,
      1.3796908855438232,
      -6.749012470245361,
      -2.7889416217803955,
      2.546294689178467,
      -7.882645130157471,
      -4.771088123321533,
      -1.6537472009658813,
      -6.836357593536377,
      -2.425736904144287,
      -2.6888346672058105,
      -2.661608934402466,
      4.682251453399658
    ];
    
    for (let index in expectedValues) {
      assert.approximately(en[index], expectedValues[index], 0.0000000000000001
    }

    done();
  });

  it('should throw an error when passed an empty object', function (done) {
    try {
      var en = mfcc({});
    } catch (e) {
      done();
    }
  });

  it('should throw an error when not passed anything', function (done) {
    try {
      var en = mfcc();
    } catch (e) {
      done();
    }
  });

  it('should throw an error when passed something invalid', function (done) {
    try {
      var en = mfcc({ signal:'not a signal' });
    } catch (e) {
      done();
    }
  });
});
