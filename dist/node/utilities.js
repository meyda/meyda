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
exports.normalize_a = normalize_a;
exports.normalize_a_to_1 = normalize_a_to_1;
exports.mean = mean;
exports.melToFreq = melToFreq;
exports.freqToMel = freqToMel;
exports.createMelFilterBank = createMelFilterBank;

var _windowing = require('./windowing');

var windowing = _interopRequireWildcard(_windowing);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var windows = {};

function isPowerOfTwo(num) {
  while (num % 2 === 0 && num > 1) {
    num /= 2;
  }
  return num === 1;
}

function error(message) {
  throw new Error("Meyda: " + message);
}

function pointwiseBufferMult(a, b) {
  var c = [];
  for (var i = 0; i < Math.min(a.length, b.length); i++) {
    c[i] = a[i] * b[i];
  }
  return c;
}

function applyWindow(signal, windowname) {
  if (windowname !== 'rect') {
    if (windowname === "" || !windowname) windowname = "hanning";
    if (!windows[windowname]) windows[windowname] = {};

    if (!windows[windowname][signal.length]) {
      try {
        windows[windowname][signal.length] = windowing[windowname](signal.length);
      } catch (e) {
        throw new Error("Invalid windowing function");
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

function normalize(num, range) {
  return num / range;
}

function normalize_a(a, range) {
  return a.map(function (n) {
    return n / range;
  });
}

function normalize_a_to_1(a) {
  var max = 0;
  a.forEach(function (v, i, _a) {
    if (v > max) max = v;
  });
  return a.map(function (n) {
    return n / max;
  });
}

function mean(a) {
  return a.reduce(function (prev, cur) {
    return prev + cur;
  }) / a.length;
}

function _melToFreq(melValue) {
  var freqValue = 700 * (Math.exp(melValue / 1125) - 1);
  return freqValue;
}

function _freqToMel(freqValue) {
  var melValue = 1125 * Math.log(1 + freqValue / 700);
  return melValue;
}

function melToFreq(mV) {
  return _melToFreq(mV);
}
function freqToMel(fV) {
  return _freqToMel(fV);
}

function createMelFilterBank(numFilters, sampleRate, bufferSize) {
  var melValues = new Float32Array(numFilters + 2); //the +2 is the upper and lower limits
  var melValuesInFreq = new Float32Array(numFilters + 2);
  //Generate limits in Hz - from 0 to the nyquist.
  var lowerLimitFreq = 0;
  var upperLimitFreq = sampleRate / 2;
  //Convert the limits to Mel
  var lowerLimitMel = _freqToMel(lowerLimitFreq);
  var upperLimitMel = _freqToMel(upperLimitFreq);
  //Find the range
  var range = upperLimitMel - lowerLimitMel;
  //Find the range as part of the linear interpolation
  var valueToAdd = range / (numFilters + 1);

  var fftBinsOfFreq = Array(numFilters + 2);

  for (var i = 0; i < melValues.length; i++) {
    //Initialising the mel frequencies - they are just a linear interpolation between the lower and upper limits.
    melValues[i] = i * valueToAdd;
    //Convert back to Hz
    melValuesInFreq[i] = _melToFreq(melValues[i]);
    //Find the corresponding bins
    fftBinsOfFreq[i] = Math.floor((bufferSize + 1) * melValuesInFreq[i] / sampleRate);
  }

  var filterBank = Array(numFilters);
  for (var j = 0; j < filterBank.length; j++) {
    //creating a two dimensional array of size numFilters * (buffersize/2)+1 and pre-populating the arrays with 0s.
    filterBank[j] = Array.apply(null, new Array(bufferSize / 2 + 1)).map(Number.prototype.valueOf, 0);
    //creating the lower and upper slopes for each bin
    for (var _i = fftBinsOfFreq[j]; _i < fftBinsOfFreq[j + 1]; _i++) {
      filterBank[j][_i] = (_i - fftBinsOfFreq[j]) / (fftBinsOfFreq[j + 1] - fftBinsOfFreq[j]);
    }
    for (var _i2 = fftBinsOfFreq[j + 1]; _i2 < fftBinsOfFreq[j + 2]; _i2++) {
      filterBank[j][_i2] = (fftBinsOfFreq[j + 2] - _i2) / (fftBinsOfFreq[j + 2] - fftBinsOfFreq[j + 1]);
    }
  }

  return filterBank;
}