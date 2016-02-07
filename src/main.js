import * as utilities from './utilities';
import * as extractors from './featureExtractors';
import * as fft from 'jsfft';
import * as complex_array from 'jsfft/lib/complex_array';
import {MeydaAnalyzer} from './meyda-wa';


var Meyda = {
	audioContext: null,
	spn: null,
	bufferSize: 512,
	sampleRate: 44100,
	melBands: 26,
	callback: null,
	windowingFunction: "hanning",
	featureExtractors: extractors,
	EXTRACTION_STARTED: false,
	_featuresToExtract: [],
	_errors: {
		notPow2: new Error('Meyda: Input data length/buffer size needs to be a power of 2, e.g. 64 or 512'),
		featureUndef: new Error('Meyda: No features defined.'),
		invalidFeatureFmt: new Error('Meyda: Invalid feature format'),
		invalidInput: new Error('Meyda: Invalid input.'),
		noAC: new Error('Meyda: No AudioContext specified.'),
		noSource: new Error('Meyda: No source node specified.')
	},

	createMeydaAnalyzer: function(options){
		return new MeydaAnalyzer(options, this);
	},

	extract: function(feature, signal){
		if (!signal)
			throw this._errors.invalidInput;
		else if (typeof signal != 'object')
			throw this._errors.invalidInput;
		else if (!feature)
			throw this._errors.featureUndef;
		else if (!utilities.isPowerOfTwo(signal.length))
			throw this._errors.notPow2;

		if (typeof this.barkScale == "undefined" || this.barkScale.length != this.bufferSize) {
			this.barkScale = utilities.createBarkScale(this.bufferSize,this.sampleRate,this.bufferSize);
		}
		//if buffer size changed, then we need to recalculate the mel bank anyway
		if (typeof this.melFilterBank == "undefined" || this.barkScale.length != this.bufferSize || this.melFilterBank.length != this.melBands) {
			this.melFilterBank = utilities.createMelFilterBank(this.melBands,this.sampleRate,this.bufferSize);
		}

		if (typeof signal.buffer == "undefined") {
			//signal is a normal array, convert to F32A
			this.signal = utilities.arrayToTyped(signal);
		}
		else {
			this.signal = signal;
		}

		var windowedSignal = utilities.applyWindow(this.signal, this.windowingFunction);

		// create complexarray to hold the spectrum
		var data = new complex_array.ComplexArray(this.bufferSize);
		// map time domain
		data.map(function(value, i, n) {
			value.real = windowedSignal[i];
		});
		// transform
		var spec = data.FFT();
		// assign to meyda
		this.complexSpectrum = spec;
		this.ampSpectrum = new Float32Array(this.bufferSize/2);
		for (var i = 0; i < this.bufferSize/2; i++) {
			this.ampSpectrum[i] = Math.sqrt(Math.pow(spec.real[i],2) + Math.pow(spec.imag[i],2));
		}

		if(typeof feature === "object"){
			var results = {};
			for (var x = 0; x < feature.length; x++){
				results[feature[x]] = (this.featureExtractors[feature[x]]({
					ampSpectrum:this.ampSpectrum,
					complexSpectrum:this.complexSpectrum,
					signal:this.signal,
					bufferSize:this.bufferSize,
					sampleRate:this.sampleRate,
					barkScale:this.barkScale,
					melFilterBank:this.melFilterBank
				}));
			}
			return results;
		}
		else if (typeof feature === "string"){
			return this.featureExtractors[feature]({
				ampSpectrum:this.ampSpectrum,
				complexSpectrum:this.complexSpectrum,
				signal:this.signal,
				bufferSize:this.bufferSize,
				sampleRate:this.sampleRate,
				barkScale:this.barkScale,
				melFilterBank:this.melFilterBank
			});
		}
		else{
			throw this._errors.invalidFeatureFmt;
		}
	}
};

export default Meyda;

if (typeof window !== "undefined") window.Meyda = Meyda;
