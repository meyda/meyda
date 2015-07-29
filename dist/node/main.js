'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _utilities = require('./utilities');

var utilities = _interopRequireWildcard(_utilities);

var _featureExtractors = require('./featureExtractors');

var _featureExtractors2 = _interopRequireDefault(_featureExtractors);

var _jsfft = require('jsfft');

var fft = _interopRequireWildcard(_jsfft);

var _jsfftLibComplex_array = require('jsfft/lib/complex_array');

var complex_array = _interopRequireWildcard(_jsfftLibComplex_array);

var Meyda = (function () {
	function Meyda(options) {
		_classCallCheck(this, Meyda);

		var self = this;
		self.audioContext = options.audioContext;

		//create nodes
		self.spn = self.audioContext.createScriptProcessor(self.bufferSize, 1, 1);
		self.spn.connect(self.audioContext.destination);

		// TODO: validate options
		self.setSource(options.source);
		self.bufferSize = options.bufferSize || 256;
		self.callback = options.callback;
		self.windowingFunction = options.windowingFunction || "hanning";
		self.featureExtractors = _featureExtractors2['default'];

		//callback controllers
		var EXTRACTION_STARTED = false;
		var _featuresToExtract;

		self.barkScale = new Float32Array(self.bufferSize);

		for (var i = 0; i < self.barkScale.length; i++) {
			self.barkScale[i] = i * self.audioContext.sampleRate / self.bufferSize;
			self.barkScale[i] = 13 * Math.atan(self.barkScale[i] / 1315.8) + 3.5 * Math.atan(Math.pow(self.barkScale[i] / 7518, 2));
		}

		self.spn.onaudioprocess = function (e) {
			// self is to obtain the current frame pcm data
			var inputData = e.inputBuffer.getChannelData(0);
			self.signal = inputData;
			var windowedSignal = utilities.applyWindow(inputData, self.windowingFunction);

			// create complexarray to hold the spectrum
			var data = new complex_array.ComplexArray(self.bufferSize);
			// map time domain
			data.map(function (value, i, n) {
				value.real = windowedSignal[i];
			});
			// transform
			var spec = data.FFT();
			// assign to meyda
			self.complexSpectrum = spec;
			self.ampSpectrum = new Float32Array(self.bufferSize / 2);
			for (var i = 0; i < self.bufferSize / 2; i++) {
				self.ampSpectrum[i] = Math.sqrt(Math.pow(spec.real[i], 2) + Math.pow(spec.imag[i], 2));
			}
			// call callback if applicable
			if (typeof callback === "function" && EXTRACTION_STARTED) {
				callback(self.get(_featuresToExtract));
			}
		};
	}

	_createClass(Meyda, [{
		key: 'start',
		value: function start(features) {
			_featuresToExtract = features;
			EXTRACTION_STARTED = true;
		}
	}, {
		key: 'stop',
		value: function stop() {
			EXTRACTION_STARTED = false;
		}
	}, {
		key: 'setSource',
		value: function setSource(source) {
			source.connect(this.spn);
		}
	}, {
		key: 'get',
		value: function get(feature) {
			var self = this;
			if (typeof feature === "object") {
				var results = {};
				for (var x = 0; x < feature.length; x++) {
					results[feature[x]] = _featureExtractors2['default'][feature[x]]({
						ampSpectrum: self.ampSpectrum,
						complexSpectrum: self.complexSpectrum,
						signal: self.signal,
						bufferSize: self.bufferSize,
						sampleRate: self.audioContext.sampleRate,
						barkScale: self.barkScale
					});
				}
				return results;
			} else if (typeof feature === "string") {
				return _featureExtractors2['default'][feature]({
					ampSpectrum: self.ampSpectrum,
					complexSpectrum: self.complexSpectrum,
					signal: self.signal,
					bufferSize: self.bufferSize,
					sampleRate: self.audioContext.sampleRate,
					barkScale: self.barkScale
				});
			} else {
				throw "Invalid Feature Format";
			}
		}
	}]);

	return Meyda;
})();

exports['default'] = Meyda;

if (typeof window !== 'undefined') window.Meyda = Meyda;
module.exports = exports['default'];