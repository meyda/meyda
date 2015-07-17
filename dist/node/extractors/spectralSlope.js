"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = function () {
  if (typeof arguments[0].ampSpectrum !== "object") {
    throw new TypeError();
  }

  //linear regression
  var ampSum = 0;
  var freqSum = 0;
  var freqs = new Float32Array(arguments[0].ampSpectrum.length);
  var powFreqSum = 0;
  var ampFreqSum = 0;

  for (var i = 0; i < arguments[0].ampSpectrum.length; i++) {
    ampSum += arguments[0].ampSpectrum[i];
    var curFreq = i * arguments[0].sampleRate / bufferSize;
    freqs[i] = curFreq;
    powFreqSum += curFreq * curFreq;
    freqSum += curFreq;
    ampFreqSum += curFreq * arguments[0].ampSpectrum[i];
  }
  return (arguments[0].ampSpectrum.length * ampFreqSum - freqSum * ampSum) / (ampSum * (powFreqSum - Math.pow(freqSum, 2)));
};

module.exports = exports["default"];