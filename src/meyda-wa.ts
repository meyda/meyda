import * as utilities from "./utilities";
import { WindowFunction } from "./utilities";
import Meyda from "./main";
import { MeydaFeature, Signal } from "./types";
import { NoAudioContextError, NoSourceError, NotPow2Error } from "./errors";

/**
 * Construction operators for a {@link MeydaAnalyzer}
 */
export type MeydaOptions = {
  /**
   * The Audio Context for the MeydaAnalyzer to operate in
   */
  audioContext: AudioContext;
  /**
   * The Audio Node for Meyda to listetn to
   */
  source: AudioNode;
  /**
   * see {@link Meyda.bufferSize}
   */
  bufferSize: number;
  /**
   * The number of samples between buffers. This can be used to extract audio
   * more slowly than realtime, or more frequently (a negative hop size creates
   * overlapping buffers) for higher resolution features.
   */
  hopSize: number;
  /**
   * see {@link Meyda.sampleRate}
   */
  sampleRate: number;
  /**
   * A function to receive the frames of audio features
   */
  callback: (arg: any) => any;
  /**
   * The Windowing Function to apply to the signal before transformation to the frequency domain
   */
  windowingFunction: WindowFunction;
  /**
   * Specify the feature extractors you want to run on the audio.
   */
  featureExtractors: MeydaFeature[];
  /**
   * Pass `true` to start feature extraction immediately
   */
  startImmediately: boolean;
  /**
   * The number of MFCC co-efficients that the MFCC feature extractor should return
   */
  numberOfMFCCCoefficients: number;
  outputs: number;
  inputs: number;
  channel: number;
};

/**
 * Meyda's interface to the Web Audio API. MeydaAnalyzer abstracts an API on
 * top of the Web Audio API's ScriptProcessorNode, running the Meyda audio
 * feature extractors inside that context.
 *
 * MeydaAnalyzer's constructor should not be called directly - MeydaAnalyzer
 * objects should be generated using the {@link Meyda.createMeydaAnalyzer}
 * factory function in the main Meyda class.
 *
 * ```
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
  _m: Meyda;
  inputData?: Signal;
  previousInputData?: Signal;
  frame?: number[];
  previousFrame?: number[];
  source?: AudioNode;
  _featuresToExtract: MeydaFeature | MeydaFeature[] = [];
  /**
   * A function you can provide that will be called for each buffer that Meyda
   * receives from its source node
   * @instance
   * @member {Function}
   */
  callback: Function;
  /**
   * Meyda stores a reference to the relevant audio context here for use inside
   * the Web Audio API.
   * @instance
   * @member {AudioContext}
   */
  audioContext: AudioContext;
  /**
   * Meyda keeps an internal ScriptProcessorNode in which it runs audio feature
   * extraction. The ScriptProcessorNode is stored in this member variable.
   */
  spn: ScriptProcessorNode;

  /**
   * @internal
   * @hidden
   */
  constructor(options: MeydaOptions, _this: Meyda) {
    this._m = _this;
    if (!options.audioContext) {
      throw new NoAudioContextError();
    } else if (
      options.bufferSize &&
      !utilities.isPowerOfTwo(options.bufferSize)
    ) {
      throw new NotPow2Error();
    } else if (!options.source) {
      throw new NoSourceError();
    }

    this.audioContext = options.audioContext;

    // TODO: validate options
    this._m.bufferSize = options.bufferSize || this._m.bufferSize || 256;
    this._m.hopSize = options.hopSize || this._m.hopSize || this._m.bufferSize;
    this._m.sampleRate =
      options.sampleRate || this.audioContext.sampleRate || 44100;
    this.callback = options.callback;
    this._m.windowingFunction = options.windowingFunction || "hanning";
    this._m.EXTRACTION_STARTED = options.startImmediately || false;
    this._m.channel = typeof options.channel === "number" ? options.channel : 0;
    this._m.inputs = options.inputs || 1;
    this._m.outputs = options.outputs || 1;
    this._m.numberOfMFCCCoefficients =
      options.numberOfMFCCCoefficients ||
      this._m.numberOfMFCCCoefficients ||
      13;

    //create nodes
    this.spn = this.audioContext.createScriptProcessor(
      this._m.bufferSize,
      this._m.inputs,
      this._m.outputs
    );
    this.spn.connect(this.audioContext.destination);

    this._featuresToExtract = options.featureExtractors || [];

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

    this.inputData = undefined;
    this.previousInputData = undefined;

    this.frame = undefined;
    this.previousFrame = undefined;

    this.setSource(options.source);

    this.spn.onaudioprocess = (e: AudioProcessingEvent) => {
      if (this.inputData !== null) {
        this.previousInputData = this.inputData;
      }

      this.inputData = e.inputBuffer.getChannelData(this._m.channel);

      let buffer: any;

      if (!this.previousInputData) {
        buffer = this.inputData;
      } else {
        buffer = new Float32Array(
          this.previousInputData.length +
            this.inputData.length -
            this._m.hopSize
        );
        buffer.set(this.previousInputData.slice(this._m.hopSize));
        buffer.set(
          this.inputData,
          this.previousInputData.length - this._m.hopSize
        );
      }

      var frames = utilities.frame(buffer, this._m.bufferSize, this._m.hopSize);

      frames.forEach((f) => {
        this.frame = f;

        var features = this._m.extract(
          this._featuresToExtract,
          this.frame,
          this.previousFrame
        );

        // call callback if applicable
        if (typeof this.callback === "function" && this._m.EXTRACTION_STARTED) {
          this.callback(features);
        }

        this.previousFrame = this.frame;
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
   * analyzer.start('chroma');
   */
  start(features?: MeydaFeature | MeydaFeature[]) {
    this._featuresToExtract = features
      ? Array.isArray(features)
        ? features
        : [features]
      : this._featuresToExtract || [];
    this._m.EXTRACTION_STARTED = true;
  }

  /**
   * Stop feature extraction.
   * @example
   * analyzer.stop();
   */
  stop() {
    this._m.EXTRACTION_STARTED = false;
  }

  /**
   * Set the Audio Node for Meyda to listen to.
   * @param {AudioNode} source - The Audio Node for Meyda to listen to
   * @example
   * analyzer.setSource(audioSourceNode);
   */
  setSource(source: AudioNode) {
    this.source && this.source.disconnect(this.spn);
    this.source = source;
    this.source.connect(this.spn);
  }

  /**
   * Set the channel of the audio node for Meyda to listen to
   * @param {number} channel - the index of the channel on the input audio node
   * for Meyda to listen to.
   * @example
   * analyzer.setChannel(0);
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
   * analyzer.get('spectralFlatness');
   */
  get(features: MeydaFeature | MeydaFeature[]) {
    if (this.inputData) {
      return this._m.extract(
        features || this._featuresToExtract,
        this.inputData,
        this.previousInputData
      );
    } else {
      return null;
    }
  }
}
