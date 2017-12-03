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

    for (var i in TestData.EXPECTED_CHROMAGRAM_OUTPUT) {
      assert.approximately(chromagram[i], TestData.EXPECTED_CHROMAGRAM_OUTPUT[i], 1e-5);
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
