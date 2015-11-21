import * as utilities from './utilities';
import featureExtractors as extractors from './featureExtractors';

class MeydaWA{
	constructor(options, self){
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
		self.EXTRACTION_STARTED = options.startImmediately || false;

		//callback controllers
		self._featuresToExtract = options.featureExtractors || [];

		self.barkScale = utilities.createBarkScale(self.bufferSize);

		self.spn.onaudioprocess = function(e) {
			// self is to obtain the current frame pcm data
			var inputData = e.inputBuffer.getChannelData(0);

			var features = self.get(self._featuresToExtract, inputData);

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
  }
}

export default MeydaWA