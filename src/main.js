import * as utilities from './utilities';
import featureExtractors as extractors from './featureExtractors';
import * as fft from 'jsfft';
import * as complex_array from 'jsfft/lib/complex_array';
import * as MeydaWA from './meyda-wa';


var Meyda = {
	audioContext: null,
	spn: null,
	bufferSize: 256,
	callback: null,
	windowingFunction: "hanning",
	featureExtractors: extractors,
	EXTRACTION_STARTED: false,
	_featuresToExtract: [],

	createMeydaAnalyzer: (options) => {
		return new MeydaWA(options, this)
	},

	extract: (feature, data) => {
		if (typeof this.barkScale == "undefined") {
			this.barkScale = utilities.createBarkScale(this.bufferSize)
		}

		this.signal = data;
		var windowedSignal = utilities.applyWindow(data, this.windowingFunction);

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
				results[feature[x]] = (featureExtractors[feature[x]]({
					ampSpectrum:this.ampSpectrum,
					complexSpectrum:this.complexSpectrum,
					signal:this.signal,
					bufferSize:this.bufferSize,
					sampleRate:this.audioContext.sampleRate,
					barkScale:this.barkScale
				}));
			}
			return results;
		}
		else if (typeof feature === "string"){
			return featureExtractors[feature]({
				ampSpectrum:this.ampSpectrum,
				complexSpectrum:this.complexSpectrum,
				signal:this.signal,
				bufferSize:this.bufferSize,
				sampleRate:this.audioContext.sampleRate,
				barkScale:this.barkScale
			});
		}
		else{
			throw "Invalid Feature Format";
		}
	}
}

export default Meyda;

if (typeof window !== "undefined") window.Meyda = Meyda;
