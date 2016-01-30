import * as utilities from './utilities';
import * as featureExtractors from './featureExtractors';

class MeydaAnalyzer{
	constructor(options, self){
		if (!options.audioContext)
			throw self._errors.noAC;
		else if (options.bufferSize && !utilities.isPowerOfTwo(options.bufferSize))
			throw self._errors.notPow2;
		else if (!options.source)
			throw self._errors.noSource;

		self.audioContext = options.audioContext;

		// TODO: validate options
		self.setSource(options.source);
		self.bufferSize = options.bufferSize || self.bufferSize || 256;
		self.sampleRate = options.sampleRate || self.audioContext.sampleRate || 44100;
		self.callback = options.callback;
		self.windowingFunction = options.windowingFunction || "hanning";
		self.featureExtractors = featureExtractors;
		self.EXTRACTION_STARTED = options.startImmediately || false;

		//create nodes
		self.spn = self.audioContext.createScriptProcessor(self.bufferSize,1,1);
		self.spn.connect(self.audioContext.destination);

		self._featuresToExtract = options.featureExtractors || [];

		//always recalculate BS and MFB when a new Meyda analyzer is created.
		self.barkScale = utilities.createBarkScale(self.bufferSize, self.sampleRate, self.bufferSize);
		self.melFilterBank = utilities.createMelFilterBank(self.melBands, self.sampleRate, self.bufferSize);

		self.inputData = null;

		self.spn.onaudioprocess = function(e) {
			// self is to obtain the current frame pcm data
			self.inputData = e.inputBuffer.getChannelData(0);

			var features = self.extract(self._featuresToExtract, self.inputData);

			// call callback if applicable
			if (typeof self.callback === "function" && self.EXTRACTION_STARTED) {
				self.callback(features);
			}

		};
	}

	start(features) {
		self._featuresToExtract = features;
		self.EXTRACTION_STARTED = true;
	}

	stop() {
		self.EXTRACTION_STARTED = false;
	}

	setSource(source) {
		source.connect(this.spn);
	}

	get(features){
		if(self.inputData !== null){
			return self.extract((features || self._featuresToExtract), self.inputData);
		} else {
			return null;
		}
	}
}

export default MeydaAnalyzer;
