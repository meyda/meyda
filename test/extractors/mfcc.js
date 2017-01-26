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
      3.0764786549843848,
      2.5565860160012903,
      1.864506100880325,
      1.2335562677762721,
      0.4988162523764804,
      0.09087259136810752,
      -0.20585442699270234,
      -0.44269584674462054,
      -0.3253486567336908,
      -0.37584086978198183,
      -0.5572731218776171,
      -0.5245475651926765,
      -0.6215721667512493
    ];
    
    for (var index in expectedValues) {
      assert.approximately(en[index], expectedValues[index], 1e-15);
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
