'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MeydaAnalyzer = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utilities = require('./utilities');

var utilities = _interopRequireWildcard(_utilities);

var _featureExtractors = require('./featureExtractors');

var featureExtractors = _interopRequireWildcard(_featureExtractors);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MeydaAnalyzer = exports.MeydaAnalyzer = function () {
  function MeydaAnalyzer(options, _this) {
    var _this2 = this;

    _classCallCheck(this, MeydaAnalyzer);

    this.meyda = _this;
    if (!options.audioContext) {
      throw this.meyda.errors.noAC;
    } else if (options.bufferSize && !utilities.isPowerOfTwo(options.bufferSize)) {
      throw this.meyda.errors.notPow2;
    } else if (!options.source) {
      throw this.meyda.errors.noSource;
    }

    this.meyda.audioContext = options.audioContext;

    // TODO: validate options
    this.meyda.bufferSize = options.bufferSize || this.meyda.bufferSize || 256;
    this.meyda.sampleRate = options.sampleRate || this.meyda.audioContext.sampleRate || 44100;
    this.meyda.callback = options.callback;
    this.meyda.windowingFunction = options.windowingFunction || 'hanning';
    this.meyda.featureExtractors = featureExtractors;
    this.meyda.EXTRACTION_STARTED = options.startImmediately || false;

    // Create nodes
    this.meyda.spn = this.meyda.audioContext.createScriptProcessor(this.meyda.bufferSize, 1, 1);
    this.meyda.spn.connect(this.meyda.audioContext.destination);

    this.meyda.featuresToExtract = options.featureExtractors || [];

    // Always recalculate BS and MFB when a new Meyda analyzer is created.
    this.meyda.barkScale = utilities.createBarkScale(this.meyda.bufferSize, this.meyda.sampleRate, this.meyda.bufferSize);
    this.meyda.melFilterBank = utilities.createMelFilterBank(this.meyda.melBands, this.meyda.sampleRate, this.meyda.bufferSize);

    this.meyda.inputData = null;
    this.meyda.previousInputData = null;

    this.setSource(options.source);

    this.meyda.spn.onaudioprocess = function (e) {
      if (_this2.meyda.inputData !== null) {
        _this2.meyda.previousInputData = _this2.meyda.inputData;
      }

      _this2.meyda.inputData = e.inputBuffer.getChannelData(0);

      var features = _this2.meyda.extract(_this2.meyda.featuresToExtract, _this2.meyda.inputData, _this2.meyda.previousInputData);

      // Call callback if applicable
      if (typeof _this2.meyda.callback === 'function' && _this2.meyda.EXTRACTION_STARTED) {
        _this2.meyda.callback(features);
      }
    };
  }

  _createClass(MeydaAnalyzer, [{
    key: 'start',
    value: function start(features) {
      this.meyda.featuresToExtract = features || this.meyda.featuresToExtract;
      this.meyda.EXTRACTION_STARTED = true;
    }
  }, {
    key: 'stop',
    value: function stop() {
      this.meyda.EXTRACTION_STARTED = false;
    }
  }, {
    key: 'setSource',
    value: function setSource(source) {
      source.connect(this.meyda.spn);
    }
  }, {
    key: 'get',
    value: function get(features) {
      if (this.meyda.inputData) {
        return this.meyda.extract(features || this.meyda.featuresToExtract, this.meyda.inputData, this.meyda.previousInputData);
      }
      return null;
    }
  }]);

  return MeydaAnalyzer;
}();