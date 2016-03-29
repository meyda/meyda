"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.blackman = blackman;
exports.sine = sine;
exports.hanning = hanning;
exports.hamming = hamming;
function blackman(size) {
  var blackmanBuffer = new Float32Array(size);
  var coeff1 = 2 * Math.PI / (size - 1);
  var coeff2 = 2 * coeff1;

  //According to http://uk.mathworks.com/help/signal/ref/blackman.html
  //first half of the window
  for (var i = 0; i < size / 2; i++) {
    blackmanBuffer[i] = 0.42 - 0.5 * Math.cos(i * coeff1) + 0.08 * Math.cos(i * coeff2);
  }

  //second half of the window
  for (var _i = size / 2; _i > 0; _i--) {
    blackmanBuffer[size - _i] = blackmanBuffer[_i - 1];
  }

  return blackmanBuffer;
}

function sine(size) {
  var coeff = Math.PI / (size - 1);
  var sineBuffer = new Float32Array(size);

  for (var i = 0; i < size; i++) {
    sineBuffer[i] = Math.sin(coeff * i);
  }

  return sineBuffer;
}

function hanning(size) {
  var hanningBuffer = new Float32Array(size);
  for (var i = 0; i < size; i++) {
    // According to the R documentation
    // http://ugrad.stat.ubc.ca/R/library/e1071/html/hanning.window.html
    hanningBuffer[i] = 0.5 - 0.5 * Math.cos(2 * Math.PI * i / (size - 1));
  }

  return hanningBuffer;
}

function hamming(size) {
  var hammingBuffer = new Float32Array(size);
  for (var i = 0; i < size; i++) {
    //According to http://uk.mathworks.com/help/signal/ref/hamming.html
    hammingBuffer[i] = 0.54 - 0.46 * Math.cos(2 * Math.PI * (i / size - 1));
  }

  return hammingBuffer;
}