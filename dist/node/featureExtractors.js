'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _rms = require('./extractors/rms');

var _rms2 = _interopRequireDefault(_rms);

var _energy = require('./extractors/energy');

var _energy2 = _interopRequireDefault(_energy);

var _spectralSlope = require('./extractors/spectralSlope');

var _spectralSlope2 = _interopRequireDefault(_spectralSlope);

var _spectralCentroid = require('./extractors/spectralCentroid');

var _spectralCentroid2 = _interopRequireDefault(_spectralCentroid);

var _spectralRolloff = require('./extractors/spectralRolloff');

var _spectralRolloff2 = _interopRequireDefault(_spectralRolloff);

var _spectralFlatness = require('./extractors/spectralFlatness');

var _spectralFlatness2 = _interopRequireDefault(_spectralFlatness);

var _spectralSpread = require('./extractors/spectralSpread');

var _spectralSpread2 = _interopRequireDefault(_spectralSpread);

var _spectralSkewness = require('./extractors/spectralSkewness');

var _spectralSkewness2 = _interopRequireDefault(_spectralSkewness);

var _spectralKurtosis = require('./extractors/spectralKurtosis');

var _spectralKurtosis2 = _interopRequireDefault(_spectralKurtosis);

var _zcr = require('./extractors/zcr');

var _zcr2 = _interopRequireDefault(_zcr);

var _loudness = require('./extractors/loudness');

var _loudness2 = _interopRequireDefault(_loudness);

var _perceptualSpread = require('./extractors/perceptualSpread');

var _perceptualSpread2 = _interopRequireDefault(_perceptualSpread);

var _perceptualSharpness = require('./extractors/perceptualSharpness');

var _perceptualSharpness2 = _interopRequireDefault(_perceptualSharpness);

var _mfcc = require('./extractors/mfcc');

var _mfcc2 = _interopRequireDefault(_mfcc);

var _powerSpectrum = require('./extractors/powerSpectrum');

var _powerSpectrum2 = _interopRequireDefault(_powerSpectrum);

var _spectralFlux = require('./extractors/spectralFlux');

var _spectralFlux2 = _interopRequireDefault(_spectralFlux);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  buffer: function buffer(args) {
    return args.signal;
  },

  rms: _rms2.default,
  energy: _energy2.default,
  complexSpectrum: function complexSpectrum(args) {
    return args.complexSpectrum;
  },

  spectralSlope: _spectralSlope2.default,
  spectralCentroid: _spectralCentroid2.default,
  spectralRolloff: _spectralRolloff2.default,
  spectralFlatness: _spectralFlatness2.default,
  spectralSpread: _spectralSpread2.default,
  spectralSkewness: _spectralSkewness2.default,
  spectralKurtosis: _spectralKurtosis2.default,
  amplitudeSpectrum: function amplitudeSpectrum(args) {
    return args.ampSpectrum;
  },

  zcr: _zcr2.default,
  loudness: _loudness2.default,
  perceptualSpread: _perceptualSpread2.default,
  perceptualSharpness: _perceptualSharpness2.default,
  powerSpectrum: _powerSpectrum2.default,
  mfcc: _mfcc2.default,
  spectralFlux: _spectralFlux2.default
};
module.exports = exports['default'];