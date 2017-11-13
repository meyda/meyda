var chai = require('chai');
var assert = chai.assert;
var fs = require('fs');

// Setup
var featureExtractors = require('../dist/node/featureExtractors');

describe('featureExtractors', function () {
  it('should provide all of the feature extractors', function () {
    var featureExtractorsProvided = fs.readdirSync('./dist/node/extractors');
    featureExtractorsProvided = featureExtractorsProvided.map(function (value) {
      return value.substr(0, value.lastIndexOf('.')) || value;
    });

    featureExtractorsProvided.push('buffer');
    featureExtractorsProvided.push('complexSpectrum');
    featureExtractorsProvided.push('amplitudeSpectrum');
    featureExtractorsProvided.splice(
      featureExtractorsProvided.indexOf('extractorUtilities'),
      1
    );

    assert.sameMembers(
      Object.keys(featureExtractors),
      featureExtractorsProvided
    );
  });
});
