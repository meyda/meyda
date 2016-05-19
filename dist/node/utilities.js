'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isPowerOfTwo = isPowerOfTwo;
exports.error = error;
exports.pointwiseBufferMult = pointwiseBufferMult;
exports.applyWindow = applyWindow;
exports.createBarkScale = createBarkScale;
exports.typedToArray = typedToArray;
exports.arrayToTyped = arrayToTyped;
exports.normalize = normalize;
exports.normalizeToOne = normalizeToOne;
exports.mean = mean;
exports.melToFreq = melToFreq;
exports.freqToMel = freqToMel;
exports.createMelFilterBank = createMelFilterBank;

var _windowing = require('./windowing');

var windowing = _interopRequireWildcard(_windowing);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var windows = {};

function isPowerOfTwo(_num) {
  var num = _num;
  while (num % 2 === 0 && num > 1) {
    num /= 2;
  }

  return num === 1;
}

function error(message) {
  throw new Error('Meyda:  ' + message);
}

function pointwiseBufferMult(a, b) {
  var c = [];
  for (var i = 0; i < Math.min(a.length, b.length); i++) {
    c[i] = a[i] * b[i];
  }

  return c;
}

function applyWindow(_signal, _windowname) {
  var windowname = _windowname;
  var signal = _signal;
  if (windowname !== 'rect') {
    if (windowname === '' || !windowname) windowname = 'hanning';
    if (!windows[windowname]) windows[windowname] = {};

    if (!windows[windowname][signal.length]) {
      try {
        windows[windowname][signal.length] = windowing[windowname](signal.length);
      } catch (e) {
        throw new Error('Invalid windowing function');
      }
    }

    signal = pointwiseBufferMult(signal, windows[windowname][signal.length]);
  }

  return signal;
}

function createBarkScale(length, sampleRate, bufferSize) {
  var barkScale = new Float32Array(length);

  for (var i = 0; i < barkScale.length; i++) {
    barkScale[i] = i * sampleRate / bufferSize;
    barkScale[i] = 13 * Math.atan(barkScale[i] / 1315.8) + 3.5 * Math.atan(Math.pow(barkScale[i] / 7518, 2));
  }

  return barkScale;
}

function typedToArray(t) {
  // utility to convert typed arrays to normal arrays
  return Array.prototype.slice.call(t);
}

function arrayToTyped(t) {
  // utility to convert arrays to typed F32 arrays
  return Float32Array.from(t);
}

function normalize(a, range) {
  return a.map(function (n) {
    return n / range;
  });
}

function normalizeToOne(a) {
  var max = Math.max.apply(null, a);

  return normalize(a, max);
}

function mean(a) {
  return a.reduce(function (prev, cur) {
    return prev + cur;
  }) / a.length;
}

function melToFreq(melValue) {
  return 700 * (Math.exp(melValue / 1125) - 1);
}

function freqToMel(freqValue) {
  return 1125 * Math.log(1 + freqValue / 700);
}

function createMelFilterBank(numFilters, sampleRate, bufferSize) {
  // the +2 is the upper and lower limits
  var melValues = new Float32Array(numFilters + 2);
  var melValuesInFreq = new Float32Array(numFilters + 2);

  // Generate limits in Hz - from 0 to the nyquist.
  var lowerLimitFreq = 0;
  var upperLimitFreq = sampleRate / 2;

  // Convert the limits to Mel
  var lowerLimitMel = freqToMel(lowerLimitFreq);
  var upperLimitMel = freqToMel(upperLimitFreq);

  // Find the range
  var range = upperLimitMel - lowerLimitMel;

  // Find the range as part of the linear interpolation
  var valueToAdd = range / (numFilters + 1);

  var fftBinsOfFreq = Array(numFilters + 2);

  for (var i = 0; i < melValues.length; i++) {
    // Initialising the mel frequencies
    // They're a linear interpolation between the lower and upper limits.
    melValues[i] = i * valueToAdd;

    // Convert back to Hz
    melValuesInFreq[i] = melToFreq(melValues[i]);

    // Find the corresponding bins
    fftBinsOfFreq[i] = Math.floor((bufferSize + 1) * melValuesInFreq[i] / sampleRate);
  }

  var filterBank = Array(numFilters);
  for (var j = 0; j < filterBank.length; j++) {
    // Create a two dimensional array of size numFilters * (buffersize/2)+1
    // pre-populating the arrays with 0s.
    filterBank[j] = Array.apply(null, new Array(bufferSize / 2 + 1)).map(Number.prototype.valueOf, 0);

    // creating the lower and upper slopes for each bin
    for (var _i = fftBinsOfFreq[j]; _i < fftBinsOfFreq[j + 1]; _i++) {
      filterBank[j][_i] = (_i - fftBinsOfFreq[j]) / (fftBinsOfFreq[j + 1] - fftBinsOfFreq[j]);
    }

    for (var _i2 = fftBinsOfFreq[j + 1]; _i2 < fftBinsOfFreq[j + 2]; _i2++) {
      filterBank[j][_i2] = (fftBinsOfFreq[j + 2] - _i2) / (fftBinsOfFreq[j + 2] - fftBinsOfFreq[j + 1]);
    }
  }

  return filterBank;
}