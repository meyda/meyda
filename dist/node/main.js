'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _utilities = require('./utilities');

var utilities = _interopRequireWildcard(_utilities);

var _featureExtractors = require('./featureExtractors');

var extractors = _interopRequireWildcard(_featureExtractors);

var _jsfft = require('jsfft');

var fft = _interopRequireWildcard(_jsfft);

var _complex_array = require('jsfft/lib/complex_array');

var complex_array = _interopRequireWildcard(_complex_array);

var _meydaWa = require('./meyda-wa');

var MeydaWA = _interopRequireWildcard(_meydaWa);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

var Meyda = {
	audioContext: null,
	spn: null,
	bufferSize: 256,
	callback: null,
	windowingFunction: "hanning",
	featureExtractors: extractors,
	EXTRACTION_STARTED: false,
	_featuresToExtract: [],

	createMeydaAnalyzer: function createMeydaAnalyzer(options) {
		return new MeydaWA(options, undefined);
	},

	extract: function extract(feature, signal) {
		if (typeof undefined.barkScale == "undefined") {
			undefined.barkScale = utilities.createBarkScale(undefined.bufferSize);
		}

		undefined.signal = signal;
		var windowedSignal = utilities.applyWindow(data, undefined.windowingFunction);

		// create complexarray to hold the spectrum
		var data = new complex_array.ComplexArray(undefined.bufferSize);
		// map time domain
		data.map(function (value, i, n) {
			value.real = windowedSignal[i];
		});
		// transform
		var spec = data.FFT();
		// assign to meyda
		undefined.complexSpectrum = spec;
		undefined.ampSpectrum = new Float32Array(undefined.bufferSize / 2);
		for (var i = 0; i < undefined.bufferSize / 2; i++) {
			undefined.ampSpectrum[i] = Math.sqrt(Math.pow(spec.real[i], 2) + Math.pow(spec.imag[i], 2));
		}

		if ((typeof feature === 'undefined' ? 'undefined' : _typeof(feature)) === "object") {
			var results = {};
			for (var x = 0; x < feature.length; x++) {
				results[feature[x]] = undefined.featureExtractors[feature[x]]({
					ampSpectrum: undefined.ampSpectrum,
					complexSpectrum: undefined.complexSpectrum,
					signal: undefined.signal,
					bufferSize: undefined.bufferSize,
					sampleRate: undefined.audioContext.sampleRate,
					barkScale: undefined.barkScale
				});
			}
			return results;
		} else if (typeof feature === "string") {
			return undefined.featureExtractors[feature]({
				ampSpectrum: undefined.ampSpectrum,
				complexSpectrum: undefined.complexSpectrum,
				signal: undefined.signal,
				bufferSize: undefined.bufferSize,
				sampleRate: undefined.audioContext.sampleRate,
				barkScale: undefined.barkScale
			});
		} else {
			throw "Invalid Feature Format";
		}
	}
};

exports.default = Meyda;

if (typeof window !== "undefined") window.Meyda = Meyda;
module.exports = exports['default'];