import * as utilities from 'util';
import featureExtractors from './featureExtractors';
import {complex_array} from 'jsfft';

class Meyda{
	constructor(options){
		// TODO: validate options
		self.audioContext = options.audioContext;
		this.setSource(options.source);
		self.bufferSize = options.bufferSize || 256;
		self.callback = options.callback;
		self.windowingFunction = options.windowingFunction || "hanning";

		//callback controllers
		var EXTRACTION_STARTED = false;
		var _featuresToExtract;

		self.barkScale = new Float32Array(bufSize);

		for(var i = 0; i < self.barkScale.length; i++){
			self.barkScale[i] = i*audioContext.sampleRate/(bufSize);
			self.barkScale[i] = 13*Math.atan(self.barkScale[i]/1315.8) + 3.5* Math.atan(Math.pow((self.barkScale[i]/7518),2));
		}

		//create nodes
		window.spn = audioContext.createScriptProcessor(self.bufferSize,1,1);
		spn.connect(audioContext.destination);

		window.spn.onaudioprocess = function(e) {
			// this is to obtain the current frame pcm data
			var inputData = e.inputBuffer.getChannelData(0);
			self.signal = inputData;
			var windowedSignal = utilities.applyWindow(inputData, 'hanning');

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

		source.connect(window.spn, 0, 0);
	}

	start(features) {
		_featuresToExtract = features;
		EXTRACTION_STARTED = true;
	}

	stop() {
		EXTRACTION_STARTED = false;
	}

	setSource(_src) {
		source = _src;
		source.connect(window.spn);
	}

	get(feature) {
		var self = this;
		if(typeof feature === "object"){
			var results = {};
			for (var x = 0; x < feature.length; x++){
				results[feature[x]] = (featureExtractors[feature[x]](self.bufferSize, self));
			}
			return results;
		}
		else if (typeof feature === "string"){
			return featureExtractors[feature](self.bufferSize, self);
		}
		else{
			throw "Invalid Feature Format";
    }
  }
}

export default Meyda;
if(typeof window !== 'undefined') window.Meyda = Meyda;
