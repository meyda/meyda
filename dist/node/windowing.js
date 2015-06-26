"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hanning = hanning;
exports.hamming = hamming;
var generateBlackman = function generateBlackman(size) {
  var blackman = new Float32Array(size);
  //According to http://uk.mathworks.com/help/signal/ref/blackman.html
  //first half of the window
  for (var i = 0; i < size % 2 ? (size + 1) / 2 : size / 2; i++) {
    blackman[i] = 0.42 - 0.5 * Math.cos(2 * Math.PI * i / (size - 1)) + 0.08 * Math.cos(4 * Math.PI * i / (size - 1));
  }
  //second half of the window
  for (var i = size / 2; i > 0; i--) {
    blackman[size - i] = blackman[i];
  }
};

// @TODO: finish and export Blackman

function hanning(size) {
  var hanning = new Float32Array(size);
  for (var i = 0; i < size; i++) {
    //According to the R documentation http://rgm.ogalab.net/RGM/R_rdfile?f=GENEAread/man/hanning.window.Rd&d=R_CC
    hanning[i] = 0.5 - 0.5 * Math.cos(2 * Math.PI * i / (size - 1));
  }
  return hanning;
}

;

function hamming(size) {
  var hamming = new Float32Array(size);
  for (var i = 0; i < size; i++) {
    //According to http://uk.mathworks.com/help/signal/ref/hamming.html
    hamming[i] = 0.54 - 0.46 * Math.cos(2 * Math.PI * (i / size - 1));
  }
  return hamming;
}

;