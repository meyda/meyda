const chai = require('chai');
const assert = chai.assert;
const fs = require('fs');

// Setup
const featureExtractors = require('../dist/node/featureExtractors');

describe('featureExtractors', () => {
  it('should provide all of the feature extractors', (done) => {
    let featureExtractorsProvided = fs.readdirSync('./dist/node/extractors');
    featureExtractorsProvided = featureExtractorsProvided.map((value) =>
      value.substr(0, value.lastIndexOf('.')) || value
    );

    featureExtractorsProvided.push('buffer');
    featureExtractorsProvided.push('complexSpectrum');
    featureExtractorsProvided.push('amplitudeSpectrum');
    featureExtractorsProvided.splice(
  featureExtractorsProvided.indexOf('extractorUtilities'), 1);

    assert.sameMembers(
  Object.keys(featureExtractors), featureExtractorsProvided);
    done();
  });
});
