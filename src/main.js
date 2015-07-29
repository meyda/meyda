import * as utilities from './utilities';
import featureExtractors from './featureExtractors';
import * as fft from 'jsfft';
import * as complex_array from 'jsfft/lib/complex_array';

class Meyda{
	constructor(options){
		var self = this;
		self.audioContext = options.audioContext;

		//create nodes
		self.spn = self.audioContext.createScriptProcessor(self.bufferSize,1,1);
		self.spn.connect(self.audioContext.destination);

		// TODO: validate options
		self.setSource(options.source);
		self.bufferSize = options.bufferSize || 256;
		self.callback = options.callback;
		self.windowingFunction = options.windowingFunction || "hanning";
		self.featureExtractors = featureExtractors;

		//callback controllers
		var EXTRACTION_STARTED = false;
		var _featuresToExtract;

		self.barkScale = new Float32Array(self.bufferSize);

		for(var i = 0; i < self.barkScale.length; i++){
			self.barkScale[i] = i*self.audioContext.sampleRate/(self.bufferSize);
			self.barkScale[i] = 13*Math.atan(self.barkScale[i]/1315.8) + 3.5* Math.atan(Math.pow((self.barkScale[i]/7518),2));
		}

		self.spn.onaudioprocess = function(e) {
			// self is to obtain the current frame pcm data
			var inputData = e.inputBuffer.getChannelData(0);
			self.signal = inputData;
			var windowedSignal = utilities.applyWindow(inputData, self.windowingFunction);

			// create complexarray to hold the spectrum
			var data = new complex_array.ComplexArray(self.bufferSize);
			// map time domain
			data.map(function(value, i, n) {
				value.real = windowedSignal[i];
			});
			// transform
			var spec = data.FFT();
			// assign to meyda
			self.complexSpectrum = spec;
			self.ampSpectrum = new Float32Array(self.bufferSize/2);
			for (var i = 0; i < self.bufferSize/2; i++) {
				self.ampSpectrum[i] = Math.sqrt(Math.pow(spec.real[i],2) + Math.pow(spec.imag[i],2));
			}
			// call callback if applicable
			if (typeof callback === "function" && EXTRACTION_STARTED) {
				callback(self.get(_featuresToExtract));
			}
		};
	}

	start(features) {
		_featuresToExtract = features;
		EXTRACTION_STARTED = true;
	}

	stop() {
		EXTRACTION_STARTED = false;
	}

	setSource(source) {
		source.connect(this.spn);
	}

	get(feature) {
		var self = this;
		if(typeof feature === "object"){
			var results = {};
			for (var x = 0; x < feature.length; x++){
				results[feature[x]] = (featureExtractors[feature[x]]({
					ampSpectrum:self.ampSpectrum,
					complexSpectrum:self.complexSpectrum,
					signal:self.signal,
					bufferSize:self.bufferSize,
					sampleRate:self.audioContext.sampleRate,
					barkScale:self.barkScale
				}));
			}
			return results;
		}
		else if (typeof feature === "string"){
			return featureExtractors[feature]({
				ampSpectrum:self.ampSpectrum,
				complexSpectrum:self.complexSpectrum,
				signal:self.signal,
				bufferSize:self.bufferSize,
				sampleRate:self.audioContext.sampleRate,
				barkScale:self.barkScale
			});
		}
		else{
			throw "Invalid Feature Format";
    }
  }
}

export default Meyda;
if(typeof window !== 'undefined') window.Meyda = Meyda;
