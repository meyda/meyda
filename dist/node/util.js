"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isPowerOfTwo = isPowerOfTwo;
exports.error = error;
exports.pointwiseBufferMult = pointwiseBufferMult;

function isPowerOfTwo(num) {
  while (num % 2 == 0 && num > 1) {
    num /= 2;
  }
  return num == 1;
}

function error(message) {
  throw new Error("Meyda: " + message);
}

function pointwiseBufferMult(a, b) {
  var c = [];
  for (var i = 0; i < Math.min(a.length, b.length); i++) {
    c[i] = a[i] * b[i];
  }
}