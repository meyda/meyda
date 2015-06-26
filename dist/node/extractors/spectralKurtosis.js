'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _extractorUtilities = require('./extractorUtilities');

var _extractorUtilities2 = _interopRequireDefault(_extractorUtilities);

exports['default'] = function (bufferSize, m) {
  var ampspec = m.ampSpectrum;
  var mu1 = (0, _extractorUtilities2['default'])(1, ampspec);
  var mu2 = (0, _extractorUtilities2['default'])(2, ampspec);
  var mu3 = (0, _extractorUtilities2['default'])(3, ampspec);
  var mu4 = (0, _extractorUtilities2['default'])(4, ampspec);
  var numerator = -3 * Math.pow(mu1, 4) + 6 * mu1 * mu2 - 4 * mu1 * mu3 + mu4;
  var denominator = Math.pow(Math.sqrt(mu2 - Math.pow(mu1, 2)), 4);
  return numerator / denominator;
};

module.exports = exports['default'];