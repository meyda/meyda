import * as utilities from './util';
import featureExtractors from './featureExtractors';
import * as fft from '../lib/jsfft/fft';
import * as complex_array from '../lib/jsfft/complex_array'
class Meyda{
	constructor(audioContext, src, bufSize, callback){
		var self = this;
		if (!utilities.isPowerOfTwo(bufSize) && !audioContext) {
			utilities.error("Invalid Constructor Arguments");
		}

		self.bufferSize = bufSize || 256;

		//callback controllers
		var EXTRACTION_STARTED = false;
		var _featuresToExtract;

		//source setter method
		self.setSource = function(_src) {
			source = _src;
			source.connect(window.spn);
		}

		//create nodes
		window.spn = audioContext.createScriptProcessor(self.bufferSize,1,1);
		spn.connect(audioContext.destination);

		window.spn.onaudioprocess = function(e) {
			//this is to obtain the current amplitude spectrum
			var inputData = e.inputBuffer.getChannelData(0);
			self.signal = inputData;
			var windowedSignal = utilities.applyWindow(inputData, 'hanning');

			//create complexarray to hold the spectrum
			var data = new complex_array.ComplexArray(self.bufferSize);
			//map time domain
			data.map(function(value, i, n) {
				value.real = windowedSignal[i];
			});
			//transform
			var spec = data.FFT();
			//assign to meyda
			self.complexSpectrum = spec;
			self.ampSpectrum = new Float32Array(self.bufferSize/2);
			//calculate amplitude
			for (var i = 0; i < this.bufferSize/2; i++) {
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
		var self = this;
		if(typeof feature === "object"){
			var results = {};
			for (var x = 0; x < feature.length; x++){
				try{
					results[feature[x]] = (featureExtractors[feature[x]](self.bufferSize, self));
				} catch (e){
					console.error(e);
				}
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
window.Meyda = Meyda;
