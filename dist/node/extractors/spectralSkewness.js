'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.default = function (args) {
  if (_typeof(args.ampSpectrum) !== 'object') {
    throw new TypeError();
  }

  var mu1 = (0, _extractorUtilities.mu)(1, args.ampSpectrum);
  var mu2 = (0, _extractorUtilities.mu)(2, args.ampSpectrum);
  var mu3 = (0, _extractorUtilities.mu)(3, args.ampSpectrum);
  var numerator = 2 * Math.pow(mu1, 3) - 3 * mu1 * mu2 + mu3;
  var denominator = Math.pow(Math.sqrt(mu2 - Math.pow(mu1, 2)), 3);
  return numerator / denominator;
};

var _extractorUtilities = require('./extractorUtilities');

module.exports = exports['default'];