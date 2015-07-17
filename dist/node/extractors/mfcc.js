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

exports["default"] = function () {
	if (typeof arguments[0].signal !== "object") {
		throw new TypeError();
	}
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