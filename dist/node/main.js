'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _utilities = require('./utilities');

var utilities = _interopRequireWildcard(_utilities);

var _featureExtractors = require('./featureExtractors');

var extractors = _interopRequireWildcard(_featureExtractors);

var _complex_array = require('jsfft/lib/complex_array');

var complexArray = _interopRequireWildcard(_complex_array);

var _meydaWa = require('./meyda-wa');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// jsfft is required by complex_array, but doesn't export anything
require('jsfft');


var prepareSignalWithSpectrum = function prepareSignalWithSpectrum(signal, windowingFunction, bufferSize) {
  var preparedSignal = {};

  if (typeof signal.buffer === 'undefined') {
    // signal is a normal array, convert to F32A
    preparedSignal.signal = utilities.arrayToTyped(signal);
  } else {
    preparedSignal.signal = signal;
  }

  preparedSignal.windowedSignal = utilities.applyWindow(preparedSignal.signal, windowingFunction);

  // create complexarray to hold the spectrum
  var data = new complexArray.ComplexArray(bufferSize);

  // map time domain
  data.map(function (value, i) {
    var v = value;
    v.real = preparedSignal.windowedSignal[i];
    return v;
  });

  // Functions shouldn't start with upper case chars, this trips our linter
  data.fft = data.FFT;
  preparedSignal.complexSpectrum = data.fft();
  preparedSignal.ampSpectrum = new Float32Array(bufferSize / 2);
  for (var i = 0; i < bufferSize / 2; i++) {
    preparedSignal.ampSpectrum[i] = Math.sqrt(Math.pow(preparedSignal.complexSpectrum.real[i], 2) + Math.pow(preparedSignal.complexSpectrum.imag[i], 2));
  }

  return preparedSignal;
};

var Meyda = {
  audioContext: null,
  spn: null,
  bufferSize: 512,
  sampleRate: 44100,
  melBands: 26,
  callback: null,
  windowingFunction: 'hanning',
  featureExtractors: extractors,
  EXTRACTION_STARTED: false,
  _featuresToExtract: [],
  windowing: utilities.applyWindow,
  // TODO: We're using this a dependency, we should use an import
  errors: {
    notPow2: new Error('Meyda: Buffer size must be a power of 2, e.g. 64 or 512'),
    featureUndef: new Error('Meyda: No features defined.'),
    invalidFeatureFmt: new Error('Meyda: Invalid feature format'),
    invalidInput: new Error('Meyda: Invalid input.'),
    noAC: new Error('Meyda: No AudioContext specified.'),
    noSource: new Error('Meyda: No source node specified.')
  },

  createMeydaAnalyzer: function createMeydaAnalyzer(options) {
    return new _meydaWa.MeydaAnalyzer(options, Meyda);
  },

  extract: function extract(feature, signal, previousSignal) {
    if (!signal) {
      throw undefined.errors.invalidInput;
    } else if ((typeof signal === 'undefined' ? 'undefined' : _typeof(signal)) !== 'object') {
      throw undefined.errors.invalidInput;
    } else if (!feature) {
      throw undefined.errors.featureUndef;
    } else if (!utilities.isPowerOfTwo(signal.length)) {
      throw undefined.errors.notPow2;
    }

    if (typeof undefined.barkScale === 'undefined' || undefined.barkScale.length !== undefined.bufferSize) {
      undefined.barkScale = utilities.createBarkScale(undefined.bufferSize, undefined.sampleRate, undefined.bufferSize);
    }

    // Recalcuate mel bank if buffer length changed
    if (typeof undefined.melFilterBank === 'undefined' || undefined.barkScale.length !== undefined.bufferSize || undefined.melFilterBank.length !== undefined.melBands) {
      undefined.melFilterBank = utilities.createMelFilterBank(undefined.melBands, undefined.sampleRate, undefined.bufferSize);
    }

    if (typeof signal.buffer === 'undefined') {
      // signal is a normal array, convert to F32A
      undefined.signal = utilities.arrayToTyped(signal);
    } else {
      undefined.signal = signal;
    }

    var preparedSignal = prepareSignalWithSpectrum(signal, undefined.windowingFunction, undefined.bufferSize);

    undefined.signal = preparedSignal.windowedSignal;
    undefined.complexSpectrum = preparedSignal.complexSpectrum;
    undefined.ampSpectrum = preparedSignal.ampSpectrum;

    if (previousSignal) {
      preparedSignal = prepareSignalWithSpectrum(previousSignal, undefined.windowingFunction, undefined.bufferSize);

      undefined.previousSignal = preparedSignal.windowedSignal;
      undefined.previousComplexSpectrum = preparedSignal.complexSpectrum;
      undefined.previousAmpSpectrum = preparedSignal.ampSpectrum;
    }

    if ((typeof feature === 'undefined' ? 'undefined' : _typeof(feature)) === 'object') {
      var results = {};
      for (var x = 0; x < feature.length; x++) {
        results[feature[x]] = undefined.featureExtractors[feature[x]]({
          ampSpectrum: undefined.ampSpectrum,
          complexSpectrum: undefined.complexSpectrum,
          signal: undefined.signal,
          bufferSize: undefined.bufferSize,
          sampleRate: undefined.sampleRate,
          barkScale: undefined.barkScale,
          melFilterBank: undefined.melFilterBank,
          previousSignal: undefined.previousSignal,
          previousAmpSpectrum: undefined.previousAmpSpectrum,
          previousComplexSpectrum: undefined.previousComplexSpectrum
        });
      }

      return results;
    } else if (typeof feature === 'string') {
      return undefined.featureExtractors[feature]({
        ampSpectrum: undefined.ampSpectrum,
        complexSpectrum: undefined.complexSpectrum,
        signal: undefined.signal,
        bufferSize: undefined.bufferSize,
        sampleRate: undefined.sampleRate,
        barkScale: undefined.barkScale,
        melFilterBank: undefined.melFilterBank,
        previousSignal: undefined.previousSignal,
        previousAmpSpectrum: undefined.previousAmpSpectrum,
        previousComplexSpectrum: undefined.previousComplexSpectrum
      });
    }
    throw undefined.errors.invalidFeatureFmt;
  }
};

exports.default = Meyda;


if (typeof window !== 'undefined') window.Meyda = Meyda;
module.exports = exports['default'];