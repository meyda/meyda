import * as utilities from './utilities';
import * as featureExtractors from './featureExtractors';

export class MeydaAnalyzer {
  constructor(options, _this) {
    this.meyda = _this;
    if (!options.audioContext) {
      throw this.meyda.errors.noAC;
    } else if (options.bufferSize &&
               !utilities.isPowerOfTwo(options.bufferSize)) {
      throw this.meyda.errors.notPow2;
    } else if (!options.source) {
      throw this.meyda.errors.noSource;
    }

    this.meyda.audioContext = options.audioContext;

    // TODO: validate options
    this.meyda.bufferSize = options.bufferSize || this.meyda.bufferSize || 256;
    this.meyda.sampleRate = options.sampleRate
        || this.meyda.audioContext.sampleRate || 44100;
    this.meyda.callback = options.callback;
    this.meyda.windowingFunction = options.windowingFunction || 'hanning';
    this.meyda.featureExtractors = featureExtractors;
    this.meyda.EXTRACTION_STARTED = options.startImmediately || false;

    // Create nodes
    this.meyda.spn = this.meyda.audioContext.createScriptProcessor(
        this.meyda.bufferSize, 1, 1);
    this.meyda.spn.connect(this.meyda.audioContext.destination);

    this.meyda.featuresToExtract = options.featureExtractors || [];

    // Always recalculate BS and MFB when a new Meyda analyzer is created.
    this.meyda.barkScale = utilities.createBarkScale(
        this.meyda.bufferSize,
        this.meyda.sampleRate,
        this.meyda.bufferSize);
    this.meyda.melFilterBank = utilities.createMelFilterBank(
        this.meyda.melBands,
        this.meyda.sampleRate,
        this.meyda.bufferSize);

    this.meyda.inputData = null;
    this.meyda.previousInputData = null;

    this.setSource(options.source);

    this.meyda.spn.onaudioprocess = (e) => {
      if (this.meyda.inputData !== null) {
        this.meyda.previousInputData = this.meyda.inputData;
      }

      this.meyda.inputData = e.inputBuffer.getChannelData(0);

      const features = this.meyda.extract(
        this.meyda.featuresToExtract,
        this.meyda.inputData,
        this.meyda.previousInputData);

      // Call callback if applicable
      if (typeof this.meyda.callback === 'function' && this.meyda.EXTRACTION_STARTED) {
        this.meyda.callback(features);
      }
    };
  }

  start(features) {
    this.meyda.featuresToExtract = features || this.meyda.featuresToExtract;
    this.meyda.EXTRACTION_STARTED = true;
  }

  stop() {
    this.meyda.EXTRACTION_STARTED = false;
  }

  setSource(source) {
    source.connect(this.meyda.spn);
  }

  get(features) {
    if (this.meyda.inputData) {
      return this.meyda.extract((features ||
                                 this.meyda.featuresToExtract),
                                this.meyda.inputData,
                                this.meyda.previousInputData);
    }
    return null;
  }
}
