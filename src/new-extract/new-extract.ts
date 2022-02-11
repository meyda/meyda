import * as extractors from "../featureExtractors";
import { MeydaSignal } from "../main";
import {
  createBarkScale,
  createChromaFilterBank,
  createMelFilterBank,
} from "../utilities";
import * as windowingFunctions from "../windowing";

export type WindowingFunction = keyof typeof windowingFunctions | "rectangle";
export type MeydaAudioFeature = keyof typeof extractors;

type ExtractorMap = typeof extractors;

type ParameterTypesOf<T extends Record<string, (...args: any) => any>> = {
  [K in keyof T]: Parameters<T[K]>;
};

type RelevantExtractorParams<
  M extends Record<string, (...args: any) => any>,
  T extends keyof M
> = {
  [ExtractorName in T]: ParameterTypesOf<M>[ExtractorName];
};

type AllMeydaExtractorParams<T extends keyof ExtractorMap> =
  RelevantExtractorParams<ExtractorMap, T>;

type ReturnTypesOf<T extends Record<string, (...args: any) => any>> = {
  [K in keyof T]: ReturnType<T[K]>;
};

type MeydaExtractionResult<F extends MeydaAudioFeature> = {
  [ExtractorName in F]: ReturnTypesOf<ExtractorMap>[ExtractorName];
};
type MelFilterBank = ReturnType<typeof createMelFilterBank>;
type ChromaFilterBank = ReturnType<typeof createChromaFilterBank>;

interface MeydaConfigurationOptions {
  sampleRate: number;
  bufferSize: number;
  windowingFunction: WindowingFunction;
  mfccCoefficients: number;
  chromaBands: number;
  melBands: number;
  barkBands: number;
}

interface MeydaConfiguration {
  barkScale: Float32Array;
  melFilterBank: MelFilterBank;
  chromaFilterBank: ChromaFilterBank;
}

function configure(options: MeydaConfigurationOptions): MeydaConfiguration {
  const { sampleRate, bufferSize, melBands, mfccCoefficients, chromaBands } = {
    ...options,
  };
  return {
    barkScale: createBarkScale(bufferSize, sampleRate, bufferSize),
    melFilterBank: createMelFilterBank(
      Math.max(melBands || 0, mfccCoefficients),
      sampleRate,
      bufferSize
    ),
    chromaFilterBank: createChromaFilterBank(
      chromaBands,
      sampleRate,
      bufferSize
    ),
  };
}

/**
 * If T is an array, the result type is U[]. Otherwise, the result type is U.
 */
type MatchArrayWrap<T, U, V> = T extends Array<V> ? U[] : U;

type OnlyOne<T> = T extends Array<(infer U)[]> ? U : T;

/**
 * # Configure an extractor
 * 
 * Configure an extractor function with options that are shared throughout the
 * extractor function's lifetime. The options pertain to the type of audio that
 * the extractor expects - e.g. the sample rate, the consistent windowing
 * function to apply, etc.
 *
 * @param options Configuration used across all feature extractions made with
 * resulting interface
 
 * @returns A function that takes a set of requested audio features and one
 * buffer of audio, and returns the requested audio features extracted from that
 * audio.
 */
export function configureMeyda(options?: Partial<MeydaConfigurationOptions>) {
  const defaults = {
    bufferSize: 512,
    sampleRate: 44100,
    melBands: 26,
    chromaBands: 12,
    windowingFunction: "hanning",
    mfccCoefficients: 13,
    barkBands: 24,
  } as const;

  const optionsAfterDefaults: MeydaConfigurationOptions = {
    ...defaults,
    ...options,
  };

  // DELETE
  type Params = AllMeydaExtractorParams<keyof ExtractorMap>;
  // ENDDELETE

  const configuration = configure(optionsAfterDefaults);

  /**
   * ## Extract given audio features from given signal
   *
   * @param feature The audio feature(s) to extract. Can be single or an array
   * @param signal The audio signal to extract the feature(s) from
   *
   * The signal should have the same sample rate as specified in the options in
   * the call to `configureMeyda`. Otherwise, the audio features will be wrong.
   * There is no way to validate the sample rate of the signal, so you will get
   * mangled output if you don't match it.
   */
  function extract<T extends MeydaAudioFeature>(
    feature: readonly T[] | T,
    signal: MeydaSignal
    // ): MeydaExtractionResult<T> {
  ): {
    [ExtractorName in T]: ReturnTypesOf<ExtractorMap>[ExtractorName];
  } {
    const features = Array.isArray(feature) ? feature : [feature];

    const signals = Array.isArray(signal[0])
      ? (signal as unknown as MeydaSignal[])
      : [signal];

    const results: MeydaExtractionResult<OnlyOne<T>>[] = signals.map(
      (signal) => {
        // TODO:
        // apply windowing function
        // run fft on signal
        // cache previous (+?) signal, amp spectrum and complex spectrum per channel
        // run extractors with all deps
        // collect to MeydaExtractionResult
        // @ts-ignore
        const preparedThings: AllMeydaExtractorParams<OnlyOne<T>> = 9;

        const channelExtractionResult: MeydaExtractionResult<OnlyOne<T>> =
          Object.fromEntries(
            features.map((feature) => {
              const extractor = extractors[feature];
              extractor("fish");
              return [feature, extractors[feature](preparedThings)];
            })
          ) as MeydaExtractionResult<OnlyOne<T>>;

        return channelExtractionResult;
      }
    );

    type TheRightReturnType = {
      [ExtractorName in T]: ReturnTypesOf<ExtractorMap>[ExtractorName];
    };
    // if (!Array.isArray(signal)) {
    //   return results[0] as MatchArrayWrap<U, MeydaExtractionResult<OnlyOne<T>>>;
    // }
    // return results as MatchArrayWrap<U, MeydaExtractionResult<OnlyOne<T>>>;
    return results as unknown as TheRightReturnType;
  }
  return extract;
}
/**
 * Returns a Meyda extractor function with configured audio features.
 *
 * @param features
 * @param extractor
 * @returns
 */
export function curryMeyda<T extends MeydaAudioFeature>(
  features: T | readonly T[],
  extractor: ReturnType<typeof configureMeyda>
) {
  return function (buffer: Parameters<typeof extractor>[1]) {
    return extractor(features, buffer);
  };
}

/**
 * ### Configure an extractor with options and audio features
 *
 * Configure a Meyda extractor function with options and audio features at once.
 *
 * @param features
 * @param options
 * @returns
 */
export function configureMeydaWithExtractors<T extends MeydaAudioFeature>(
  features: T | readonly T[],
  options?: Partial<MeydaConfigurationOptions>
) {
  return function (signal: MeydaSignal) {
    return curryMeyda(features, configureMeyda(options))(signal);
  };
}
