import powerSpectrum from './powerSpectrum';
import freqToMel from './../utilities';
import melToFreq from './../utilities';


export default function(args){
	if(typeof args.ampSpectrum !== "object" || typeof args.melFilterBank !== "object"){
		throw new TypeError();
	}
	//used tutorial from http://practicalcryptography.com/miscellaneous/machine-learning/guide-mel-frequency-cepstral-coefficients-mfccs/
	let powSpec = powerSpectrum(args);
	let numFilters = args.melFilterBank.length;
	let filtered = Array(numFilters);

	let loggedMelBands = new Float32Array(numFilters);

	for (let i = 0; i < loggedMelBands.length; i++) {
		filtered[i] = new Float32Array(args.bufferSize/2);
		loggedMelBands[i] = 0;
		for (let j = 0; j < (args.bufferSize/2); j++) {
			//point-wise multiplication between power spectrum and filterbanks.
			filtered[i][j] = args.melFilterBank[i][j]*powSpec[j];

			//summing up all of the coefficients into one array
			loggedMelBands[i] += filtered[i][j];
		}

		//log each coefficient
		loggedMelBands[i] = Math.log(loggedMelBands[i]);
	}

	//dct
	let k = Math.PI/numFilters;
	let w1 = 1.0/Math.sqrt(numFilters);
	let w2 = Math.sqrt(2.0/numFilters);
	let numCoeffs = numFilters;
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
