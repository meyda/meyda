'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.default = function () {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  if (_typeof(args[0].ampSpectrum) !== 'object') {
    throw new TypeError();
  }

  var powerSpectrum = new Float32Array(args[0].ampSpectrum.length);
  for (var i = 0; i < powerSpectrum.length; i++) {
    powerSpectrum[i] = Math.pow(args[0].ampSpectrum[i], 2);
  }

  return powerSpectrum;
};

module.exports = exports['default'];