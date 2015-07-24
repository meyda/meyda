import powerSpectrum from './powerSpectrum';

let melToFreq = function(melValue){
	let freqValue = 700*(Math.exp(melValue/1125)-1);
	return freqValue;
};

let freqToMel = function(freqValue){
	let melValue = 1125*Math.log(1+(freqValue/700));
	return melValue;
};

export default function(args){
	if(typeof args.ampSpectrum !== "object"){
		throw new TypeError();
	}
	//used tutorial from http://practicalcryptography.com/miscellaneous/machine-learning/guide-mel-frequency-cepstral-coefficients-mfccs/
	let powSpec = powerSpectrum(args);
	let numFilters = 26; //26 filters is standard
	let melValues = new Float32Array(numFilters+2); //the +2 is the upper and lower limits
	let melValuesInFreq = new Float32Array(numFilters+2);
	//Generate limits in Hz - from 0 to the nyquist.
	let lowerLimitFreq = 0;
	let upperLimitFreq = args.sampleRate/2;
	//Convert the limits to Mel
	let lowerLimitMel = freqToMel(lowerLimitFreq);
	let upperLimitMel = freqToMel(upperLimitFreq);
	//Find the range
	let range = upperLimitMel-lowerLimitMel;
	//Find the range as part of the linear interpolation
	let valueToAdd = range/(numFilters+1);

	let fftBinsOfFreq = Array(numFilters+2);

	for (let i = 0; i < melValues.length; i++) {
		//Initialising the mel frequencies - they are just a linear interpolation between the lower and upper limits.
		melValues[i] = i*valueToAdd;
		//Convert back to Hz
		melValuesInFreq[i] = melToFreq(melValues[i]);
		//Find the corresponding bins
		fftBinsOfFreq[i] = Math.floor((args.bufferSize+1)*melValuesInFreq[i]/args.sampleRate);
	}

	let filterBank = Array(numFilters);
	for (let j = 0; j < filterBank.length; j++) {
		//creating a two dimensional array of size numFiltes * (args.buffersize/2)+1 and pre-populating the arrays with 0s.
		filterBank[j] = Array.apply(null, new Array((args.bufferSize/2)+1)).map(Number.prototype.valueOf,0);
		//creating the lower and upper slopes for each bin
		for (let i = fftBinsOfFreq[j]; i < fftBinsOfFreq[j+1]; i++) {
			filterBank[j][i] = (i - fftBinsOfFreq[j])/(fftBinsOfFreq[j+1]-fftBinsOfFreq[j]);
		}
		for (let i = fftBinsOfFreq[j+1]; i < fftBinsOfFreq[j+2]; i++) {
			filterBank[j][i] = (fftBinsOfFreq[j+2]-i)/(fftBinsOfFreq[j+2]-fftBinsOfFreq[j+1]);
		}
	}

	let loggedMelBands = new Float32Array(numFilters);
	for (let i = 0; i < loggedMelBands.length; i++) {
		loggedMelBands[i] = 0;
		for (let j = 0; j < (args.bufferSize/2); j++) {
			//point multiplication between power spectrum and filterbanks.
			filterBank[i][j] = filterBank[i][j]*powSpec[j];

			//summing up all of the coefficients into one array
			loggedMelBands[i] += filterBank[i][j];
		}
		//log each coefficient
		loggedMelBands[i] = Math.log(loggedMelBands[i]);
	}

	//dct
	let k = Math.PI/numFilters;
	let w1 = 1.0/Math.sqrt(numFilters);
	let w2 = Math.sqrt(2.0/numFilters);
	let numCoeffs = 13;
	let dctMatrix = new Float32Array(numCoeffs*numFilters);

	for(let i = 0; i < numCoeffs; i++){
		for (let j = 0; j < numFilters; j++) {
			let idx = i + (j*numCoeffs);
			if(i === 0){
				dctMatrix[idx] = w1 * Math.cos(k * (i+1) * (j+0.5));
			}
			else{
				dctMatrix[idx] = w2 * Math.cos(k * (i+1) * (j+0.5));
			}
		}
	}

	let mfccs = new Float32Array(numCoeffs);
	for (let k = 0; k < numCoeffs; k++) {
		let v = 0;
		for (let n = 0; n < numFilters; n++) {
			let idx = k + (n*numCoeffs);
			v += (dctMatrix[idx] * loggedMelBands[n]);
		}
		mfccs[k] = v/numCoeffs;
	}
	return mfccs;
}
