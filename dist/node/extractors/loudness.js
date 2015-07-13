"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = function (bufferSize, m) {
  var NUM_BARK_BANDS = 24;
  var specific = new Float32Array(NUM_BARK_BANDS);
  var tot = 0;
  var normalisedSpectrum = m.ampSpectrum;
  var bbLimits = new Int32Array(NUM_BARK_BANDS + 1);

  bbLimits[0] = 0;
  var currentBandEnd = m.barkScale[m.ampSpectrum.length - 1] / NUM_BARK_BANDS;
  var currentBand = 1;
  for (var i = 0; i < m.ampSpectrum.length; i++) {
    while (m.barkScale[i] > currentBandEnd) {
      bbLimits[currentBand++] = i;
      currentBandEnd = currentBand * m.barkScale[m.ampSpectrum.length - 1] / NUM_BARK_BANDS;
    }
  }

  bbLimits[NUM_BARK_BANDS] = m.ampSpectrum.length - 1;

  //process

  for (var i = 0; i < NUM_BARK_BANDS; i++) {
    var sum = 0;
    for (var j = bbLimits[i]; j < bbLimits[i + 1]; j++) {

      sum += normalisedSpectrum[j];
    }
    specific[i] = Math.pow(sum, 0.23);
  }

  //get total loudness
  for (var i = 0; i < specific.length; i++) {
    tot += specific[i];
  }
  return {
    "specific": specific,
    "total": tot
  };
};

module.exports = exports["default"];