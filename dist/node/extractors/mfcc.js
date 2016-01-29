'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (args) {
	if (_typeof(args.ampSpectrum) !== "object" || _typeof(args.melFilterBank) !== "object") {
		throw new TypeError();
	}
	//used tutorial from http://practicalcryptography.com/miscellaneous/machine-learning/guide-mel-frequency-cepstral-coefficients-mfccs/
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

		//log each coefficient
		loggedMelBands[i] = Math.log(loggedMelBands[i]);
	}

	//dct
	var k = Math.PI / numFilters;
	var w1 = 1.0 / Math.sqrt(numFilters);
	var w2 = Math.sqrt(2.0 / numFilters);
	var numCoeffs = numFilters;
	var dctMatrix = new Float32Array(numCoeffs * numFilters);

	for (var i = 0; i < numCoeffs; i++) {
		for (var j = 0; j < numFilters; j++) {
			var idx = i + j * numCoeffs;
			if (i === 0) {
				dctMatrix[idx] = w1 * Math.cos(k * (i + 1) * (j + 0.5));
			} else {
				dctMatrix[idx] = w2 * Math.cos(k * (i + 1) * (j + 0.5));
			}
		}
	}

	var mfccs = new Float32Array(numCoeffs);
	for (var _k = 0; _k < numCoeffs; _k++) {
		var v = 0;
		for (var n = 0; n < numFilters; n++) {
			var idx = _k + n * numCoeffs;
			v += dctMatrix[idx] * loggedMelBands[n];
		}
		mfccs[_k] = v / numCoeffs;
	}
	return mfccs;
};

var _powerSpectrum = require('./powerSpectrum');

var _powerSpectrum2 = _interopRequireDefault(_powerSpectrum);

var _utilities = require('./../utilities');

var _utilities2 = _interopRequireDefault(_utilities);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports['default'];