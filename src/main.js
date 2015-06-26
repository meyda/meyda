import * as utilities from 'util';
import featureExtractors from 'featureExtractors';

export default class{
	constructor(audioContext, src, bufSize, callback){
		if (!isPowerOfTwo(bufferSize) && !audioContext) {
			utilities.error("Invalid Constructor Arguments");
		}

		let bufferSize = bufSize || 256;

		//callback controllers
		var EXTRACTION_STARTED = false;
		var _featuresToExtract;

		//WINDOWING
		//set default
		this.windowingFunction = "hanning";

		//source setter method
		self.setSource = function(_src) {
			source = _src;
			source.connect(window.spn);
		}

		//create nodes
		window.spn = audioContext.createScriptProcessor(bufferSize,1,1);
		spn.connect(audioContext.destination);

		window.spn.onaudioprocess = function(e) {
			//this is to obtain the current amplitude spectrum
			var inputData = e.inputBuffer.getChannelData(0);
			self.signal = inputData;
			var windowedSignal = self.windowing(self.signal, self.windowingFunction);

			//create complexarray to hold the spectrum
			var data = new complex_array.ComplexArray(bufferSize);
			//map time domain
			data.map(function(value, i, n) {
				value.real = windowedSignal[i];
			});
			//transform
			var spec = data.FFT();
			//assign to meyda
			self.complexSpectrum = spec;
			self.ampSpectrum = new Float32Array(bufferSize/2);
			//calculate amplitude
			for (var i = 0; i < bufferSize/2; i++) {
				self.ampSpectrum[i] = Math.sqrt(Math.pow(spec.real[i],2) + Math.pow(spec.imag[i],2));

			}
			//call callback if applicable
			if (typeof callback === "function" && EXTRACTION_STARTED) {
				callback(self.get(_featuresToExtract));
			}

			self.barkScale = new Float32Array(bufSize);

			for(var i = 0; i < self.barkScale.length; i++){
				self.barkScale[i] = i*audioContext.sampleRate/(bufSize);
				self.barkScale[i] = 13*Math.atan(self.barkScale[i]/1315.8) + 3.5* Math.atan(Math.pow((self.barkScale[i]/7518),2));
			}
		}


		self.start = function(features) {
			_featuresToExtract = features;
			EXTRACTION_STARTED = true;
		}

		self.stop = function() {
			EXTRACTION_STARTED = false;
		}

		self.audioContext = audioContext;

		source.connect(window.spn, 0, 0);
	}

	get(feature) {
		if(typeof feature === "object"){
			var results = {};
			for (var x = 0; x < feature.length; x++){
				try{
					results[feature[x]] = (self.featureExtractors[feature[x]](bufferSize, self));
				} catch (e){
					console.error(e);
				}
			}
			return results;
		}
		else if (typeof feature === "string"){
			return self.featureExtractors[feature](bufferSize, self);
		}
		else{
			throw "Invalid Feature Format";
    }
  }
}
