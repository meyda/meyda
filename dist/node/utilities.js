"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isPowerOfTwo = isPowerOfTwo;
exports.error = error;
exports.pointwiseBufferMult = pointwiseBufferMult;
exports.applyWindow = applyWindow;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

var _windowing = require('./windowing');

var windowing = _interopRequireWildcard(_windowing);

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
  if (!windows[windowname]) windows[windowname] = {};
  if (!windows[windowname][signal.length]) windows[windowname][signal.length] = windowing.hanning(signal.length);

  return pointwiseBufferMult(signal, windows[windowname][signal.length]);
}