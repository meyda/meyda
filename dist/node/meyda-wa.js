'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _utilities = require('./utilities');

var utilities = _interopRequireWildcard(_utilities);

var _featureExtractors = require('./featureExtractors');

var featureExtractors = _interopRequireWildcard(_featureExtractors);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MeydaAnalyzer = function () {
	function MeydaAnalyzer(options, self) {
		_classCallCheck(this, MeydaAnalyzer);

		if (!options.audioContext) throw self._errors.noAC;else if (options.bufferSize && !utilities.isPowerOfTwo(options.bufferSize)) throw self._errors.notPow2;else if (!options.source) throw self._errors.noSource;

		self.audioContext = options.audioContext;

		// TODO: validate options
		self.setSource(options.source);
		self.bufferSize = options.bufferSize || self.bufferSize || 256;
		self.sampleRate = options.sampleRate || self.audioContext.sampleRate || 44100;
		self.callback = options.callback;
		self.windowingFunction = options.windowingFunction || "hanning";
		self.featureExtractors = featureExtractors;
		self.EXTRACTION_STARTED = options.startImmediately || false;

		//create nodes
		self.spn = self.audioContext.createScriptProcessor(self.bufferSize, 1, 1);
		self.spn.connect(self.audioContext.destination);

		self._featuresToExtract = options.featureExtractors || [];

		//always recalculate BS and MFB when a new Meyda analyzer is created.
		self.barkScale = utilities.createBarkScale(self.bufferSize, self.sampleRate, self.bufferSize);
		self.melFilterBank = utilities.createMelFilterBank(self.melBands, self.sampleRate, self.bufferSize);

		self.inputData = null;

		self.spn.onaudioprocess = function (e) {
			// self is to obtain the current frame pcm data
			self.inputData = e.inputBuffer.getChannelData(0);

			var features = self.extract(self._featuresToExtract, self.inputData);

			// call callback if applicable
			if (typeof self.callback === "function" && self.EXTRACTION_STARTED) {
				self.callback(features);
			}
		};
	}

	_createClass(MeydaAnalyzer, [{
		key: 'start',
		value: function start(features) {
			self._featuresToExtract = features;
			self.EXTRACTION_STARTED = true;
		}
	}, {
		key: 'stop',
		value: function stop() {
			self.EXTRACTION_STARTED = false;
		}
	}, {
		key: 'setSource',
		value: function setSource(source) {
			source.connect(this.spn);
		}
	}, {
		key: 'get',
		value: function get(features) {
			if (self.inputData !== null) {
				return self.extract(features || self._featuresToExtract, self.inputData);
			} else {
				return null;
			}
		}
	}]);

	return MeydaAnalyzer;
}();

exports.default = MeydaAnalyzer;
module.exports = exports['default'];