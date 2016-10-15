'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.default = function (args) {
  if (_typeof(args.ampSpectrum) !== 'object' || _typeof(args.melFilterBank) !== 'object') {
    throw new TypeError();
  }

  // Tutorial from:
  // http://practicalcryptography.com/miscellaneous/machine-learning
  // /guide-mel-frequency-cepstral-coefficients-mfccs/
  var powSpec = (0, _powerSpectrum2.default)(args);
  var numFilters = args.melFilterBank.length;
  var filtered = Array(numFilters);

  var loggedMelBands = new Float32Array(numFilters);

  for (var i = 0; i < loggedMelBands.length; i++) {
    filtered[i] = new Float32Array(args.bufferSize / 2);
    loggedMelBands[i] = 0;
    for (var j = 0; j < args.bufferSize / 2; j++) {
      //point-wise multiplication between power spectrum and filterbanks.
      filtered[i][j] = args.melFilterBank[i][j] * powSpec[j];

      //summing up all of the coefficients into one array
      loggedMelBands[i] += filtered[i][j];
    }

    //log each coefficient.
    loggedMelBands[i] = Math.log(loggedMelBands[i] + 1);
  }

  //dct
  var loggedMelBandsArray = Array.prototype.slice.call(loggedMelBands);
  var mfccs = dct(loggedMelBandsArray).slice(0, 13);

  return mfccs;
};

var _powerSpectrum = require('./powerSpectrum');

var _powerSpectrum2 = _interopRequireDefault(_powerSpectrum);

var _utilities = require('./../utilities');

var _utilities2 = _interopRequireDefault(_utilities);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dct = require('dct');

module.exports = exports['default'];