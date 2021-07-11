import * as utilities from "./utilities";
import { WindowFunction } from "./utilities";
import extractors, { UnionExtractorParams } from "./featureExtractors";
import { fft } from "fftjs";
import { MeydaAnalyzer, MeydaOptions } from "./meyda-wa";
import {
  Signal,
  MeydaFeature,
  BarkScale,
  MelFilterBank,
  ChromaFilterBank,
} from "./types";
import {
  FeatureUndefError,
  InvalidFeatureFmtError,
  InvalidInputError,
  NotPow2Error,
} from "./errors";

/**
 * Meyda Module
 * @module meyda
 */

export default class Meyda {
  /**
   * @hidden
   */
  constructor() {}
  /**
   * The length of each buffer that Meyda will extract audio on. When recieving
   * input via the Web Audio API, the Script Processor Node chunks incoming audio
   * into arrays of this length. Longer buffers allow for more precision in the
   * frequency domain, but increase the amount of time it takes for Meyda to
   * output a set of audio features for the buffer. You can calculate how many
   * sets of audio features Meyda will output per second by dividing the
   * buffer size by the sample rate. If you're using Meyda for visualisation,
   * make sure that you're collecting audio features at a rate that's faster
   * than or equal to the video frame rate you expect.
   */
  bufferSize = 512;
  hopSize = 0;
  /**
   * The number of samples per second of the incoming audio. This affects
   * feature extraction outside of the context of the Web Audio API, and must be
   * set accurately - otherwise calculations will be off.
   */
  sampleRate = 44100;
  /**
   * The number of Mel bands to use in the Mel Frequency Cepstral Co-efficients
   * feature extractor
   */
  melBands = 26;
  /**
   * The number of bands to divide the spectrum into for the Chroma feature
   * extractor. 12 is the standard number of semitones per octave in the western
   * music tradition, but Meyda can use an arbitrary number of bands, which
   * can be useful for microtonal music.
   */
  chromaBands = 12;
  /**
   * Specify the windowing function to apply to the buffer before the
   * transformation from the time domain to the frequency domain is performed
   *
   * The default windowing function is the hanning window.
   *
   * @instance
   * @member {string}
   */
  windowingFunction: WindowFunction = "hanning";
  /**
   * @member {object}
   */
  featureExtractors = extractors;
  EXTRACTION_STARTED = false;
  /**
   * The number of MFCC co-efficients that the MFCC feature extractor should return
   * @instance
   * @member {number}
   */
  numberOfMFCCCoefficients = 13;
  // internals
  windowing = utilities.applyWindow;
  barkScale: BarkScale = Float32Array.from([]);
  melFilterBank: MelFilterBank = [];
  chromaFilterBank: ChromaFilterBank = [];
  // previousComplexSpectrum: null as unknown as ComplexSpectrum,
  // previousAmpSpectrum: null as unknown as AmplitudeSpectrum,
  inputs = 1;
  outputs = 1;
  channel = 0;

  /**
   * @summary
   * Create a MeydaAnalyzer
   *
   * A factory function for creating a MeydaAnalyzer, the interface for using
   * Meyda in the context of Web Audio.
   *
   * @method
   * @param {MeydaOptions} options Options - an object containing configuration
   * @returns {MeydaAnalyzer}
   * @example
   * const analyzer = Meyda.createMeydaAnalyzer({
   *   "audioContext": audioContext,
   *   "source": source,
   *   "bufferSize": 512,
   *   "featureExtractors": ["rms"],
   *   "inputs": 2,
   *   "callback": features => {
   *     levelRangeElement.value = features.rms;
   *   }
   * });
   */
  createMeydaAnalyzer(options: MeydaOptions) {
    return new MeydaAnalyzer(options, this);
  }

  /**
   * List available audio feature extractors. Return format provides the key to
   * be used in selecting the extractor in the extract methods
   *
   * @returns {Array.<string>} featureExtractors - a list of the keys of
   * available audio feature extractors
   */

  listAvailableFeatureExtractors() {
    return Object.keys(extractors);
  }

  /**
   * Extract an audio feature from a buffer
   *
   * Unless `meyda.windowingFunction` is set otherwise, `extract` will
   * internally apply a hanning window to the buffer prior to conversion into
   * the frequency domain.
   *
   * @function
   * @param {(string|Array.<string>)} feature - the feature you want to extract
   * @param {Array.<number>} signal
   * An array of numbers that represents the signal. It should be of length
   * `meyda.bufferSize`
   * @param {Array.<number>} [previousSignal] - the previous buffer
   * @returns {object} Features
   * @example
   * meyda.bufferSize = 2048;
   * const features = meyda.extract(['zcr', 'spectralCentroid'], signal);
   */
  extract(
    feature: MeydaFeature | MeydaFeature[],
    signal: number[] | Signal,
    previousSignal?: number[] | Signal
  ): any {
    if (!signal) throw new InvalidInputError();
    else if (typeof signal != "object") throw new InvalidInputError();
    else if (!feature) throw new FeatureUndefError();
    else if (!utilities.isPowerOfTwo(signal.length)) throw new NotPow2Error();

    if (
      typeof this.barkScale == "undefined" ||
      this.barkScale.length != this.bufferSize
    ) {
      this.barkScale = utilities.createBarkScale(
        this.bufferSize,
        this.sampleRate,
        this.bufferSize
      );
    }

    // Recalculate mel bank if buffer length changed
    if (
      typeof this.melFilterBank == "undefined" ||
      this.barkScale.length != this.bufferSize ||
      this.melFilterBank.length != this.melBands
    ) {
      this.melFilterBank = utilities.createMelFilterBank(
        Math.max(this.melBands, this.numberOfMFCCCoefficients),
        this.sampleRate,
        this.bufferSize
      );
    }

    // Recalculate chroma bank if buffer length changed
    if (
      typeof this.chromaFilterBank == "undefined" ||
      this.chromaFilterBank.length != this.chromaBands
    ) {
      this.chromaFilterBank = utilities.createChromaFilterBank(
        this.chromaBands,
        this.sampleRate,
        this.bufferSize
      );
    }

    let {
      // BUG: we were never actually windowing the signal of the current buffer
      // We should use windowedSignal instead of signal here.
      signal: preparedSignal,
      complexSpectrum: preparedComplexSpectrum,
      ampSpectrum: preparedAmpSpectrum,
    } = prepareSignalWithSpectrum(
      signal,
      this.windowingFunction,
      this.bufferSize
    );

    let {
      windowedSignal: previousPreparedSignal,
      /*
        if we needed these we could use them
        complexSpectrum: previousPreparedComplexSpectrum,
        ampSpectrum: previousPreparedAmpSpectrum
        */
    } = previousSignal
      ? prepareSignalWithSpectrum(
          previousSignal,
          this.windowingFunction,
          this.bufferSize
        )
      : { windowedSignal: new Float32Array() };

    const extract = (feature: MeydaFeature) => {
      const extractorParams: UnionExtractorParams = {
        ampSpectrum: preparedAmpSpectrum,
        chromaFilterBank: this.chromaFilterBank,
        complexSpectrum: preparedComplexSpectrum,
        signal: preparedSignal,
        bufferSize: this.bufferSize,
        sampleRate: this.sampleRate,
        barkScale: this.barkScale,
        melFilterBank: this.melFilterBank,
        previousSignal: previousPreparedSignal,
        // Not required by any extractor right now
        // previousAmpSpectrum: this.previousAmpSpectrum,
        // previousComplexSpectrum: this.previousComplexSpectrum,
        numberOfMFCCCoefficients: this.numberOfMFCCCoefficients,
      };
      return this.featureExtractors[feature](extractorParams);
    };

    if (typeof feature === "object") {
      return feature.reduce(
        (acc, el) =>
          Object.assign({}, acc, {
            [el]: extract(el),
          }),
        {}
      );
    } else if (typeof feature === "string") {
      return extract(feature);
    } else {
      throw new InvalidFeatureFmtError();
    }
  }
}

type SignalPreparedWithSpectrum = {
  signal: Signal;
  windowedSignal: Signal;
  complexSpectrum: ReturnType<typeof fft>;
  ampSpectrum: Float32Array;
};

function prepareSignalWithSpectrum(
  providedSignal: number[] | Signal,
  windowingFunction: WindowFunction,
  bufferSize: number
): SignalPreparedWithSpectrum {
  var signal: Signal =
    providedSignal.constructor !== Float32Array && Array.isArray(providedSignal)
      ? utilities.arrayToTyped(providedSignal)
      : providedSignal;
  const windowedSignal = utilities.applyWindow(signal, windowingFunction);

  const complexSpectrum = fft(windowedSignal);
  const ampSpectrum = new Float32Array(bufferSize / 2);

  for (var i = 0; i < bufferSize / 2; i++) {
    ampSpectrum[i] = Math.sqrt(
      Math.pow(complexSpectrum.real[i], 2) +
        Math.pow(complexSpectrum.imag[i], 2)
    );
  }

  const preparedSignal: SignalPreparedWithSpectrum = {
    signal,
    windowedSignal: utilities.applyWindow(signal, windowingFunction),
    complexSpectrum,
    ampSpectrum,
  };

  return preparedSignal;
}

// @ts-ignore
if (typeof window !== "undefined") window.Meyda = Meyda;

export { MeydaAnalyzer };
