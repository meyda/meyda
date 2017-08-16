var chai = require('chai');
var assert = chai.assert;
var TestData = require('../TestData');
var utilities = require('../../dist/node/utilities');

// Setup
var chroma = require('../../dist/node/extractors/chroma');

describe('chroma', function () {
  it('should return correct chroma value given a valid signal', function (done) {
    var chromagram = chroma({
      sampleRate: 44100,
      bufferSize: 512,
      ampSpectrum: TestData.VALID_AMPLITUDE_SPECTRUM,
      chromaFilterBank:utilities.createChromaFilterBank(12, 44100, 512),
    });

    const expectedValues = [
      0.889173501932042,
      0.8377149437424725,
      0.7983608438722133,
      0.8340835109903056,
      0.9257658376982487,
      0.9697310997078421,
      1,
      0.8781674865696717,
      0.7889747445705728,
      0.7880426774703064,
      0.9250473589362254,
      0.8824577772499042,
    ];

    for (var index in expectedValues) {
      assert.approximately(chromagram[index], expectedValues[index], 1e-15);
    }

    done();
  });

  it('should throw an error when passed an empty object', function (done) {
    try {
      var chromagram = chroma({});
    } catch (e) {
      done();
    }
  });

  it('should throw an error when not passed anything', function (done) {
    try {
      var chromagram = chroma();
    } catch (e) {
      done();
    }
  });

  it('should throw an error when passed something invalid', function (done) {
    try {
      var chromagram = chroma({ ampSpectrum: 'not a signal' });
    } catch (e) {
      done();
    }
  });
});
