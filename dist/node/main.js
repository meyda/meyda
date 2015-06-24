'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _util = require('./util');

var utilities = _interopRequireWildcard(_util);

var _featureExtractors = require('./featureExtractors');

var _featureExtractors2 = _interopRequireDefault(_featureExtractors);

var Meyda = (function () {
	function Meyda(audioContext, src, bufSize, callback) {
		_classCallCheck(this, Meyda);

		if (!utilities.isPowerOfTwo(bufferSize) && !audioContext) {
			utilities.error('Invalid Constructor Arguments');
		}

		var bufferSize = bufSize || 256;

		//callback controllers
		var EXTRACTION_STARTED = false;
		var _featuresToExtract;

		//WINDOWING
		//set default
		this.windowingFunction = 'hanning';

		//source setter method
		self.setSource = function (_src) {
			source = _src;
			source.connect(window.spn);
		};

		//create nodes
		window.spn = audioContext.createScriptProcessor(bufferSize, 1, 1);
		spn.connect(audioContext.destination);

		window.spn.onaudioprocess = function (e) {
			//this is to obtain the current amplitude spectrum
			var inputData = e.inputBuffer.getChannelData(0);
			self.signal = inputData;
			var windowedSignal = (self.signal, self.windowingFunction);

			//create complexarray to hold the spectrum
			var data = new complex_array.ComplexArray(bufferSize);
			//map time domain
			data.map(function (value, i, n) {
				value.real = windowedSignal[i];
			});
			//transform
			var spec = data.FFT();
			//assign to meyda
			self.complexSpectrum = spec;
			self.ampSpectrum = new Float32Array(bufferSize / 2);
			//calculate amplitude
			for (var i = 0; i < bufferSize / 2; i++) {
				self.ampSpectrum[i] = Math.sqrt(Math.pow(spec.real[i], 2) + Math.pow(spec.imag[i], 2));
			}
			//call callback if applicable
			if (typeof callback === 'function' && EXTRACTION_STARTED) {
				callback(self.get(_featuresToExtract));
			}
		};

		self.start = function (features) {
			_featuresToExtract = features;
			EXTRACTION_STARTED = true;
		};

		self.stop = function () {
			EXTRACTION_STARTED = false;
		};

		self.audioContext = audioContext;

		source.connect(window.spn, 0, 0);
	}

	_createClass(Meyda, [{
		key: 'get',
		value: function get(feature) {
			if (typeof feature === 'object') {
				var results = {};
				for (var x = 0; x < feature.length; x++) {
					try {
						results[feature[x]] = self.featureExtractors[feature[x]](bufferSize, self);
					} catch (e) {
						console.error(e);
					}
				}
				return results;
			} else if (typeof feature === 'string') {
				return self.featureExtractors[feature](bufferSize, self);
			} else {
				throw 'Invalid Feature Format';
			}
		}
	}]);

	return Meyda;
})();

exports['default'] = Meyda;

window.Meyda = Meyda;
module.exports = exports['default'];