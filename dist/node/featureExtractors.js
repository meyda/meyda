'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _extractorsRms = require('./extractors/rms');

var _extractorsRms2 = _interopRequireDefault(_extractorsRms);

var _extractorsEnergy = require('./extractors/energy');

var _extractorsEnergy2 = _interopRequireDefault(_extractorsEnergy);

var _extractorsSpectralSlope = require('./extractors/spectralSlope');

var _extractorsSpectralSlope2 = _interopRequireDefault(_extractorsSpectralSlope);

var _extractorsSpectralCentroid = require('./extractors/spectralCentroid');

var _extractorsSpectralCentroid2 = _interopRequireDefault(_extractorsSpectralCentroid);

var _extractorsSpectralRolloff = require('./extractors/spectralRolloff');

var _extractorsSpectralRolloff2 = _interopRequireDefault(_extractorsSpectralRolloff);

var _extractorsSpectralFlatness = require('./extractors/spectralFlatness');

var _extractorsSpectralFlatness2 = _interopRequireDefault(_extractorsSpectralFlatness);

var _extractorsSpectralSpread = require('./extractors/spectralSpread');

var _extractorsSpectralSpread2 = _interopRequireDefault(_extractorsSpectralSpread);

var _extractorsSpectralSkewness = require('./extractors/spectralSkewness');

var _extractorsSpectralSkewness2 = _interopRequireDefault(_extractorsSpectralSkewness);

var _extractorsSpectralKurtosis = require('./extractors/spectralKurtosis');

var _extractorsSpectralKurtosis2 = _interopRequireDefault(_extractorsSpectralKurtosis);

var _extractorsZcr = require('./extractors/zcr');

var _extractorsZcr2 = _interopRequireDefault(_extractorsZcr);

var _extractorsLoudness = require('./extractors/loudness');

var _extractorsLoudness2 = _interopRequireDefault(_extractorsLoudness);

var _extractorsPerceptualSpread = require('./extractors/perceptualSpread');

var _extractorsPerceptualSpread2 = _interopRequireDefault(_extractorsPerceptualSpread);

var _extractorsPerceptualSharpness = require('./extractors/perceptualSharpness');

var _extractorsPerceptualSharpness2 = _interopRequireDefault(_extractorsPerceptualSharpness);

var _extractorsMfcc = require('./extractors/mfcc');

var _extractorsMfcc2 = _interopRequireDefault(_extractorsMfcc);

var _extractorsPowerSpectrum = require('./extractors/powerSpectrum');

var _extractorsPowerSpectrum2 = _interopRequireDefault(_extractorsPowerSpectrum);

exports['default'] = {
  "buffer": function buffer(args) {
    return args.signal;
  },
  rms: _extractorsRms2['default'],
  energy: _extractorsEnergy2['default'],
  "complexSpectrum": function complexSpectrum(args) {
    return args.complexSpectrum;
  },
  spectralSlope: _extractorsSpectralSlope2['default'],
  spectralCentroid: _extractorsSpectralCentroid2['default'],
  spectralRolloff: _extractorsSpectralRolloff2['default'],
  spectralFlatness: _extractorsSpectralFlatness2['default'],
  spectralSpread: _extractorsSpectralSpread2['default'],
  spectralSkewness: _extractorsSpectralSkewness2['default'],
  spectralKurtosis: _extractorsSpectralKurtosis2['default'],
  "amplitudeSpectrum": function amplitudeSpectrum(args) {
    return args.ampSpectrum;
  },
  zcr: _extractorsZcr2['default'],
  loudness: _extractorsLoudness2['default'],
  perceptualSpread: _extractorsPerceptualSpread2['default'],
  perceptualSharpness: _extractorsPerceptualSharpness2['default'],
  powerSpectrum: _extractorsPowerSpectrum2['default'],
  mfcc: _extractorsMfcc2['default']
};
module.exports = exports['default'];