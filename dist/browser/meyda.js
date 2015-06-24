(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = function (bufferSize, m) {
  var energy = 0;
  for (var i = 0; i < m.signal.length; i++) {
    energy += Math.pow(Math.abs(m.signal[i]), 2);
  }
  return energy;
};

module.exports = exports["default"];

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mu = mu;

function mu(i, amplitudeSpect) {
  var numerator = 0;
  var denominator = 0;
  for (var k = 0; k < amplitudeSpect.length; k++) {
    numerator += Math.pow(k, i) * Math.abs(amplitudeSpect[k]);
    denominator += amplitudeSpect[k];
  }
  return numerator / denominator;
}

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = function (bufferSize, m) {
  var barkScale = new Float32Array(m.ampSpectrum.length);
  var NUM_BARK_BANDS = 24;
  var specific = new Float32Array(NUM_BARK_BANDS);
  var tot = 0;
  var normalisedSpectrum = m.ampSpectrum;
  var bbLimits = new Int32Array(NUM_BARK_BANDS + 1);

  for (var i = 0; i < barkScale.length; i++) {
    barkScale[i] = i * m.audioContext.sampleRate / bufferSize;
    barkScale[i] = 13 * Math.atan(barkScale[i] / 1315.8) + 3.5 * Math.atan(Math.pow(barkScale[i] / 7518, 2));
  }

  bbLimits[0] = 0;
  var currentBandEnd = barkScale[m.ampSpectrum.length - 1] / NUM_BARK_BANDS;
  var currentBand = 1;
  for (var i = 0; i < m.ampSpectrum.length; i++) {
    while (barkScale[i] > currentBandEnd) {
      bbLimits[currentBand++] = i;
      currentBandEnd = currentBand * barkScale[m.ampSpectrum.length - 1] / NUM_BARK_BANDS;
    }
  }

  bbLimits[NUM_BARK_BANDS] = m.ampSpectrum.length - 1;

  //process

  for (var i = 0; i < NUM_BARK_BANDS; i++) {
    var sum = 0;
    for (var j = bbLimits[i]; j < bbLimits[i + 1]; j++) {

      sum += normalisedSpectrum[j];
    }
    specific[i] = Math.pow(sum, 0.23);
  }

  //get total loudness
  for (var i = 0; i < specific.length; i++) {
    tot += specific[i];
  }
  return {
    "specific": specific,
    "total": tot
  };
};

module.exports = exports["default"];

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var melToFreq = function melToFreq(melValue) {
  var freqValue = 700 * (Math.exp(melValue / 1125) - 1);
  return freqValue;
};

var freqToMel = function freqToMel(freqValue) {
  var melValue = 1125 * Math.log(1 + freqValue / 700);
  return melValue;
};

exports["default"] = function (bufferSize, m) {
  //used tutorial from http://practicalcryptography.com/miscellaneous/machine-learning/guide-mel-frequency-cepstral-coefficients-mfccs/
  var powSpec = m.featureExtractors["powerSpectrum"](bufferSize, m);
  var numFilters = 26; //26 filters is standard
  var melValues = new Float32Array(numFilters + 2); //the +2 is the upper and lower limits
  var melValuesInFreq = new Float32Array(numFilters + 2);
  //Generate limits in Hz - from 0 to the nyquist.
  var lowerLimitFreq = 0;
  var upperLimitFreq = audioContext.sampleRate / 2;
  //Convert the limits to Mel
  var lowerLimitMel = freqToMel(lowerLimitFreq);
  var upperLimitMel = freqToMel(upperLimitFreq);
  //Find the range
  var range = upperLimitMel - lowerLimitMel;
  //Find the range as part of the linear interpolation
  var valueToAdd = range / (numFilters + 1);

  var fftBinsOfFreq = Array(numFilters + 2);

  for (var i = 0; i < melValues.length; i++) {
    //Initialising the mel frequencies - they are just a linear interpolation between the lower and upper limits.
    melValues[i] = i * valueToAdd;
    //Convert back to Hz
    melValuesInFreq[i] = melToFreq(melValues[i]);
    //Find the corresponding bins
    fftBinsOfFreq[i] = Math.floor((bufferSize + 1) * melValuesInFreq[i] / audioContext.sampleRate);
  };

  var filterBank = Array(numFilters);
  for (var j = 0; j < filterBank.length; j++) {
    //creating a two dimensional array of size numFiltes * (buffersize/2)+1 and pre-populating the arrays with 0s.
    filterBank[j] = Array.apply(null, new Array(bufferSize / 2 + 1)).map(Number.prototype.valueOf, 0);
    //creating the lower and upper slopes for each bin
    for (var i = fftBinsOfFreq[j]; i < fftBinsOfFreq[j + 1]; i++) {
      filterBank[j][i] = (i - fftBinsOfFreq[j]) / (fftBinsOfFreq[j + 1] - fftBinsOfFreq[j]);
    }
    for (var i = fftBinsOfFreq[j + 1]; i < fftBinsOfFreq[j + 2]; i++) {
      filterBank[j][i] = (fftBinsOfFreq[j + 2] - i) / (fftBinsOfFreq[j + 2] - fftBinsOfFreq[j + 1]);
    }
  }

  var loggedMelBands = new Float32Array(numFilters);
  for (var i = 0; i < loggedMelBands.length; i++) {
    loggedMelBands[i] = 0;
    for (var j = 0; j < bufferSize / 2; j++) {
      //point multiplication between power spectrum and filterbanks.
      filterBank[i][j] = filterBank[i][j] * powSpec[j];

      //summing up all of the coefficients into one array
      loggedMelBands[i] += filterBank[i][j];
    }
    //log each coefficient
    loggedMelBands[i] = Math.log(loggedMelBands[i]);
  }

  //dct
  var k = Math.PI / numFilters;
  var w1 = 1.0 / Math.sqrt(numFilters);
  var w2 = Math.sqrt(2.0 / numFilters);
  var numCoeffs = 13;
  var dctMatrix = new Float32Array(numCoeffs * numFilters);

  for (var i = 0; i < numCoeffs; i++) {
    for (var j = 0; j < numFilters; j++) {
      var idx = i + j * numCoeffs;
      if (i == 0) {
        dctMatrix[idx] = w1 * Math.cos(k * (i + 1) * (j + 0.5));
      } else {
        dctMatrix[idx] = w2 * Math.cos(k * (i + 1) * (j + 0.5));
      }
    }
  }

  var mfccs = new Float32Array(numCoeffs);
  for (var k = 0; k < numCoeffs; k++) {
    var v = 0;
    for (var n = 0; n < numFilters; n++) {
      var idx = k + n * numCoeffs;
      v += dctMatrix[idx] * loggedMelBands[n];
    }
    mfccs[k] = v / numCoeffs;
  }
  return mfccs;
};

module.exports = exports["default"];

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = function (bufferSize, m) {
  var loudness = m.featureExtractors["loudness"](bufferSize, m);
  var spec = loudness.specific;
  var output = 0;

  for (var i = 0; i < spec.length; i++) {
    if (i < 15) {
      output += (i + 1) * spec[i + 1];
    } else {
      output += 0.066 * Math.exp(0.171 * (i + 1));
    }
  };
  output *= 0.11 / loudness.total;

  return output;
};

module.exports = exports["default"];

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = function (bufferSize, m) {
  var loudness = m.featureExtractors["loudness"](bufferSize, m);

  var max = 0;
  for (var i = 0; i < loudness.specific.length; i++) {
    if (loudness.specific[i] > max) {
      max = loudness.specific[i];
    }
  }

  var spread = Math.pow((loudness.total - max) / loudness.total, 2);

  return spread;
};

module.exports = exports["default"];

},{}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = function (bufferSize, m) {

  var rms = 0;
  for (var i = 0; i < m.signal.length; i++) {
    rms += Math.pow(m.signal[i], 2);
  }
  rms = rms / m.signal.length;
  rms = Math.sqrt(rms);

  return rms;
};

module.exports = exports["default"];

},{}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _extractorUtilities = require('./extractorUtilities');

var _extractorUtilities2 = _interopRequireDefault(_extractorUtilities);

exports['default'] = function (bufferSize, m) {
  return (0, _extractorUtilities2['default'])(1, m.ampSpectrum);
};

module.exports = exports['default'];

},{"./extractorUtilities":2}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = function (bufferSize, m) {
  var ampspec = m.ampSpectrum;
  var numerator = 0;
  var denominator = 0;
  for (var i = 0; i < ampspec.length; i++) {
    numerator += Math.log(ampspec[i]);
    denominator += ampspec[i];
  }
  return Math.exp(numerator / ampspec.length) * ampspec.length / denominator;
};

module.exports = exports["default"];

},{}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _extractorUtilities = require('./extractorUtilities');

var _extractorUtilities2 = _interopRequireDefault(_extractorUtilities);

exports['default'] = function (bufferSize, m) {
  var ampspec = m.ampSpectrum;
  var mu1 = (0, _extractorUtilities2['default'])(1, ampspec);
  var mu2 = (0, _extractorUtilities2['default'])(2, ampspec);
  var mu3 = (0, _extractorUtilities2['default'])(3, ampspec);
  var mu4 = (0, _extractorUtilities2['default'])(4, ampspec);
  var numerator = -3 * Math.pow(mu1, 4) + 6 * mu1 * mu2 - 4 * mu1 * mu3 + mu4;
  var denominator = Math.pow(Math.sqrt(mu2 - Math.pow(mu1, 2)), 4);
  return numerator / denominator;
};

module.exports = exports['default'];

},{"./extractorUtilities":2}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = function (bufferSize, m) {
  var ampspec = m.ampSpectrum;
  //calculate nyquist bin
  var nyqBin = m.audioContext.sampleRate / (2 * (ampspec.length - 1));
  var ec = 0;
  for (var i = 0; i < ampspec.length; i++) {
    ec += ampspec[i];
  }
  var threshold = 0.99 * ec;
  var n = ampspec.length - 1;
  while (ec > threshold && n >= 0) {
    ec -= ampspec[n];
    --n;
  }
  return (n + 1) * nyqBin;
};

module.exports = exports["default"];

},{}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _extractorUtilities = require('./extractorUtilities');

var _extractorUtilities2 = _interopRequireDefault(_extractorUtilities);

exports['default'] = function (bufferSize, m, spectrum) {
  var ampspec = m.ampSpectrum;
  var mu1 = (0, _extractorUtilities2['default'])(1, ampspec);
  var mu2 = (0, _extractorUtilities2['default'])(2, ampspec);
  var mu3 = (0, _extractorUtilities2['default'])(3, ampspec);
  var numerator = 2 * Math.pow(mu1, 3) - 3 * mu1 * mu2 + mu3;
  var denominator = Math.pow(Math.sqrt(mu2 - Math.pow(mu1, 2)), 3);
  return numerator / denominator;
};

module.exports = exports['default'];

},{"./extractorUtilities":2}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = function (bufferSize, m) {
  //linear regression
  var ampSum = 0;
  var freqSum = 0;
  var freqs = new Float32Array(m.ampSpectrum.length);
  var powFreqSum = 0;
  var ampFreqSum = 0;

  for (var i = 0; i < m.ampSpectrum.length; i++) {
    ampSum += m.ampSpectrum[i];
    var curFreq = i * m.audioContext.sampleRate / bufferSize;
    freqs[i] = curFreq;
    powFreqSum += curFreq * curFreq;
    freqSum += curFreq;
    ampFreqSum += curFreq * m.ampSpectrum[i];
  }
  return (m.ampSpectrum.length * ampFreqSum - freqSum * ampSum) / (ampSum * (powFreqSum - Math.pow(freqSum, 2)));
};

module.exports = exports["default"];

},{}],14:[function(require,module,exports){
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

},{"./extractorUtilities":2}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = function (bufferSize, m) {
  var zcr = 0;
  for (var i = 0; i < m.signal.length; i++) {
    if (m.signal[i] >= 0 && m.signal[i + 1] < 0 || m.signal[i] < 0 && m.signal[i + 1] >= 0) {
      zcr++;
    }
  }
  return zcr;
};

module.exports = exports["default"];

},{}],16:[function(require,module,exports){
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

exports['default'] = {
  'buffer': function buffer(bufferSize, m) {
    return m.signal;
  },
  'rms': _extractorsRms2['default'],
  'energy': _extractorsEnergy2['default'],
  'complexSpectrum': function complexSpectrum(bufferSize, m) {
    return m.complexSpectrum;
  },
  'spectralSlope': _extractorsSpectralSlope2['default'],
  'spectralCentroid': _extractorsSpectralCentroid2['default'],
  'spectralRolloff': _extractorsSpectralRolloff2['default'],
  'spectralFlatness': _extractorsSpectralFlatness2['default'],
  'spectralSpread': _extractorsSpectralSpread2['default'],
  'spectralSkewness': _extractorsSpectralSkewness2['default'],
  'spectralKurtosis': _extractorsSpectralKurtosis2['default'],
  'amplitudeSpectrum': function amplitudeSpectrum(bufferSize, m) {
    return m.ampSpectrum;
  },
  'zcr': _extractorsZcr2['default'],
  'loudness': _extractorsLoudness2['default'],
  'perceptualSpread': _extractorsPerceptualSpread2['default'],
  'perceptualSharpness': _extractorsPerceptualSharpness2['default'],
  'mfcc': _extractorsMfcc2['default']
};
module.exports = exports['default'];

},{"./extractors/energy":1,"./extractors/loudness":3,"./extractors/mfcc":4,"./extractors/perceptualSharpness":5,"./extractors/perceptualSpread":6,"./extractors/rms":7,"./extractors/spectralCentroid":8,"./extractors/spectralFlatness":9,"./extractors/spectralKurtosis":10,"./extractors/spectralRolloff":11,"./extractors/spectralSkewness":12,"./extractors/spectralSlope":13,"./extractors/spectralSpread":14,"./extractors/zcr":15}],17:[function(require,module,exports){
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

},{"./featureExtractors":16,"./util":18}],18:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isPowerOfTwo = isPowerOfTwo;
exports.error = error;
exports.pointwiseBufferMult = pointwiseBufferMult;

function isPowerOfTwo(num) {
  while (num % 2 == 0 && num > 1) {
    num /= 2;
  }
  return num == 1;
}

function error(message) {
  throw new Error("Meyda: " + message);
}

function pointwiseBufferMult(a, b) {
  var c = [];
  for (var i = 0; i < Math.min(a.length, b.length); i++) {
    c[i] = a[i] * b[i];
  }
}

},{}]},{},[17]);
