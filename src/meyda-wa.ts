import * as utilities from "./utilities";
import * as featureExtractors from "./featureExtractors";
import type {
  MeydaAudioFeature,
  MeydaWindowingFunction,
  MeydaFeaturesObject,
} from "./main";

/**
 * MeydaAnalyzerOptions
 */
export interface MeydaAnalyzerOptions {
  /**
   * The Audio Context for the MeydaAnalyzer to operate in.
   */
  audioContext: AudioContext;
  /**
   * The Audio Node for Meyda to listen to.
   */
  source: AudioNode;
  /**
   * The size of the buffer.
   */
  bufferSize: number;
  /**
   * The number of samples between the start of each buffer.
   */
  hopSize?: number | undefined;
  /**
   * The number of samples per second in the audioContext.
   */
  sampleRate?: number | undefined;
  /**
   * Pass `true` to start feature extraction immediately
   */
  startImmediately?: boolean | undefined;
  /**
   * The channel from the input node to listen to
   */
  channel?: number | undefined;
  /**
   * The Windowing Function to apply to the signal before transformation to the frequency domain.
   */
  windowingFunction?: MeydaWindowingFunction | undefined;
  /**
   * What feature extractors to return to the callback.
   */
  featureExtractors?:
    | MeydaAudioFeature
    | ReadonlyArray<MeydaAudioFeature>
    | undefined;
  inputs?: number | undefined;
  outputs?: number | undefined;
  /**
   * The number of mfcc coefficients to calculate for each buffer.
   */
  numberOfMFCCCoefficients?: number | undefined;
  /**
   * The number of bark bands to calculate for use in feature extractors.
   */
  numberOfBarkBands?: number | undefined;
  /**
   * The callback to receive your audio features. Will be called once for each buffer of input audio.
   */
  callback?: ((features: Partial<MeydaFeaturesObject>) => void) | undefined;
}

/**
 * Meyda's interface to the Web Audio API. MeydaAnalyzer abstracts an API on
 * top of the Web Audio API's ScriptProcessorNode, running the Meyda audio
 * feature extractors inside that context.
 *
 * MeydaAnalyzer's constructor should not be called directly - MeydaAnalyzer
 * objects should be generated using the {@link createMeydaAnalyzer}
 * factory function in the main Meyda class.
 *
 * Options are of type {@link MeydaAnalyzerOptions}.
 *
 * @example
 * ```javascript
 * const analyzer = Meyda.createMeydaAnalyzer({
 *   "audioContext": audioContext,
 *   "source": source,
 *   "bufferSize": 512,
 *   "featureExtractors": ["rms"],
 *   "inputs": 2,
 *   "numberOfMFCCCoefficients": 20
 *   "callback": features => {
 *     levelRangeElement.value = features.rms;
 *   }
 * });
 * ```
 */
export class MeydaAnalyzer {
  /** @hidden */
  _m: any;

  /** @hidden */
  constructor(options: MeydaAnalyzerOptions, _this) {
    this._m = _this;
    if (!options.audioContext) {
      throw this._m.errors.noAC;
    } else if (
      options.bufferSize &&
      !utilities.isPowerOfTwo(options.bufferSize)
    ) {
      throw this._m._errors.notPow2;
    } else if (!options.source) {
      throw this._m._errors.noSource;
    }

    this._m.audioContext = options.audioContext;

    // TODO: validate options
    this._m.bufferSize = options.bufferSize || this._m.bufferSize || 256;
    this._m.hopSize = options.hopSize || this._m.hopSize || this._m.bufferSize;
    this._m.sampleRate =
      options.sampleRate || this._m.audioContext.sampleRate || 44100;
    this._m.callback = options.callback;
    this._m.windowingFunction = options.windowingFunction || "hanning";
    this._m.featureExtractors = featureExtractors;
    this._m.EXTRACTION_STARTED = options.startImmediately || false;
    this._m.channel = typeof options.channel === "number" ? options.channel : 0;
    this._m.inputs = options.inputs || 1;
    this._m.outputs = options.outputs || 1;
    this._m.numberOfMFCCCoefficients =
      options.numberOfMFCCCoefficients ||
      this._m.numberOfMFCCCoefficients ||
      13;
    this._m.numberOfBarkBands =
      options.numberOfBarkBands || this._m.numberOfBarkBands || 24;

    //create nodes
    this._m.spn = this._m.audioContext.createScriptProcessor(
      this._m.bufferSize,
      this._m.inputs,
      this._m.outputs
    );
    this._m.spn.connect(this._m.audioContext.destination);

    this._m._featuresToExtract = options.featureExtractors || [];

    //always recalculate BS and MFB when a new Meyda analyzer is created.
    this._m.barkScale = utilities.createBarkScale(
      this._m.bufferSize,
      this._m.sampleRate,
      this._m.bufferSize
    );
    this._m.melFilterBank = utilities.createMelFilterBank(
      Math.max(this._m.melBands, this._m.numberOfMFCCCoefficients),
      this._m.sampleRate,
      this._m.bufferSize
    );

    this._m.inputData = null;
    this._m.previousInputData = null;

    this._m.frame = null;
    this._m.previousFrame = null;

    this.setSource(options.source);

    this._m.spn.onaudioprocess = (e) => {
      var buffer;
      if (this._m.inputData !== null) {
        this._m.previousInputData = this._m.inputData;
      }

      this._m.inputData = e.inputBuffer.getChannelData(this._m.channel);

      if (!this._m.previousInputData) {
        buffer = this._m.inputData;
      } else {
        buffer = new Float32Array(
          this._m.previousInputData.length +
            this._m.inputData.length -
            this._m.hopSize
        );
        buffer.set(this._m.previousInputData.slice(this._m.hopSize));
        buffer.set(
          this._m.inputData,
          this._m.previousInputData.length - this._m.hopSize
        );
      }

      var frames = utilities.frame(buffer, this._m.bufferSize, this._m.hopSize);

      frames.forEach((f) => {
        this._m.frame = f;

        var features = this._m.extract(
          this._m._featuresToExtract,
          this._m.frame,
          this._m.previousFrame
        );

        // call callback if applicable
        if (
          typeof this._m.callback === "function" &&
          this._m.EXTRACTION_STARTED
        ) {
          this._m.callback(features);
        }

        this._m.previousFrame = this._m.frame;
      });
    };
  }

  /**
   * Start feature extraction
   * The audio features will be passed to the callback function that was defined
   * in the MeydaOptions that were passed to the factory when constructing the
   * MeydaAnalyzer.
   * @param {(string|Array.<string>)} [features]
   * Change the features that Meyda is extracting. Defaults to the features that
   * were set upon construction in the options parameter.
   * @example
   * ```javascript
   * analyzer.start('chroma');
   * ```
   */
  start(features?: MeydaAudioFeature | ReadonlyArray<MeydaAudioFeature>): void {
    this._m._featuresToExtract = features || this._m._featuresToExtract;
    this._m.EXTRACTION_STARTED = true;
  }

  /**
   * Stop feature extraction.
   * @example
   * ```javascript
   * analyzer.stop();
   * ```
   */
  stop(): void {
    this._m.EXTRACTION_STARTED = false;
  }

  /**
   * Set the Audio Node for Meyda to listen to.
   * @param {AudioNode} source - The Audio Node for Meyda to listen to
   * @example
   * ```javascript
   * analyzer.setSource(audioSourceNode);
   * ```
   */
  setSource(source: AudioNode): void {
    this._m.source && this._m.source.disconnect(this._m.spn);
    this._m.source = source;
    this._m.source.connect(this._m.spn);
  }

  /**
   * Set the channel of the audio node for Meyda to listen to
   * @param {number} channel - the index of the channel on the input audio node
   * for Meyda to listen to.
   * @example
   * ```javascript
   * analyzer.setChannel(0);
   * ```
   */
  setChannel(channel: number) {
    if (channel <= this._m.inputs) {
      this._m.channel = channel;
    } else {
      console.error(
        `Channel ${channel} does not exist. Make sure you've provided a value for 'inputs' that is greater than ${channel} when instantiating the MeydaAnalyzer`
      );
    }
  }

  /**
   * Get a set of features from the current frame.
   * @param {(string|Array.<string>)} [features]
   * Change the features that Meyda is extracting
   * @example
   * ```javascript
   * analyzer.get('spectralFlatness');
   * ```
   */
  get(
    features?: MeydaAudioFeature | ReadonlyArray<MeydaAudioFeature>
  ): Partial<MeydaFeaturesObject> | null {
    if (this._m.inputData) {
      return this._m.extract(
        features || this._m._featuresToExtract,
        this._m.inputData,
        this._m.previousInputData
      );
    } else {
      return null;
    }
  }
}
