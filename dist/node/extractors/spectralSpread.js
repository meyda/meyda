'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _extractorUtilities = require('./extractorUtilities');

var _extractorUtilities2 = _interopRequireDefault(_extractorUtilities);

exports['default'] = function (bufferSize, m) {
  var ampspec = m.ampSpectrum;
  return Math.sqrt((0, _extractorUtilities2['default'])(2, ampspec) - Math.pow((0, _extractorUtilities2['default'])(1, ampspec), 2));
};

module.exports = exports['default'];