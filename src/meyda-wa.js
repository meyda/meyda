import * as utilities from './utilities';
import * as featureExtractors from './featureExtractors';

export class MeydaAnalyzer{
	constructor(options, _this) {
  this._m = _this;
  if (!options.audioContext)
  throw self._errors.noAC;
  else if (options.bufferSize &&
        !utilities.isPowerOfTwo(options.bufferSize))
  throw self._errors.notPow2;
  else if (!options.source)
  throw self._errors.noSource;

  this._m.audioContext = options.audioContext;

  // TODO: validate options
  this._m.bufferSize = options.bufferSize || this._m.bufferSize || 256;
  this._m.sampleRate = options.sampleRate
    || this._m.audioContext.sampleRate || 44100;
  this._m.callback = options.callback;
  this._m.windowingFunction = options.windowingFunction || 'hanning';
  this._m.featureExtractors = featureExtractors;
  this._m.EXTRACTION_STARTED = options.startImmediately || false;

  //create nodes
  this._m.spn = this._m.audioContext.createScriptProcessor(
    this._m.bufferSize, 1, 1);
  this._m.spn.connect(this._m.audioContext.destination);

  this._m._featuresToExtract = options.featureExtractors || [];

  //always recalculate BS and MFB when a new Meyda analyzer is created.
  this._m.barkScale = utilities.createBarkScale(
    this._m.bufferSize,
    this._m.sampleRate,
    this._m.bufferSize);
  this._m.melFilterBank = utilities.createMelFilterBank(
    this._m.melBands,
    this._m.sampleRate,
    this._m.bufferSize);

  this._m.inputData = null;
  this._m.previousInputData = null;

  this.setSource(options.source);

  this._m.spn.onaudioprocess = (e)=> {
    if (this._m.inputData !== null) {
      this._m.previousInputData = this._m.inputData;
    }

    this._m.inputData = e.inputBuffer.getChannelData(0);

    var features = this._m.extract(
      this._m._featuresToExtract,
      this._m.inputData,
      this._m.previousInputData);

    // call callback if applicable
    if (typeof this._m.callback === 'function' && this._m.EXTRACTION_STARTED) {
      this._m.callback(features);
    }

  };
	}

	start(features) {
  this._featuresToExtract = features;
  this.EXTRACTION_STARTED = true;
	}

	stop() {
  this.EXTRACTION_STARTED = false;
	}

	setSource(source) {
  source.connect(this._m.spn);
	}

	get(features) {
  if (this._m.inputData) {
    return this._m.extract(
            (features || this._featuresToExtract),
            this._m.inputData,
            this._m.previousInputData);
  } else {
    return null;
  }
	}
}
