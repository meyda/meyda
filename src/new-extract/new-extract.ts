import * as extractors from "../featureExtractors";
import { MeydaSignal } from "../main";
import {
  createBarkScale,
  createChromaFilterBank,
  createMelFilterBank,
} from "../utilities";
import * as windowingFunctions from "../windowing";
import { A, U, Union } from "ts-toolbelt";
import { MatchTupleLength } from "./match-tuple-length";

export type WindowingFunction = keyof typeof windowingFunctions | "rectangle";
export type MeydaAudioFeature = keyof typeof extractors;

type ExtractorMap = typeof extractors;

type ParameterTypesOf<T extends Record<string, (...args: any) => any>> = {
  [K in keyof T]: Parameters<T[K]>;
};

type ReturnTypesOf<T extends Record<string, (...args: any) => any>> = {
  [K in keyof T]: ReturnType<T[K]>;
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

// type ConcreteResultType<
//   T extends MeydaAudioFeature,
//   U extends readonly MeydaSignal[] | MeydaSignal
// > = U extends MeydaSignal[]
//   ? {
//       [ExtractorName in T]: ReturnTypesOf<ExtractorMap>[ExtractorName];
//     }[]
//   : {
//       [ExtractorName in T]: ReturnTypesOf<ExtractorMap>[ExtractorName];
//     };

type ConcreteResultType<T extends MeydaAudioFeature> = {
  [ExtractorName in T]: ReturnTypesOf<ExtractorMap>[ExtractorName];
};

type MaybePartialResult<
  T extends V extends readonly (infer K)[] ? K : V extends (infer K)[] ? K : V,
  U extends readonly MeydaSignal[] | MeydaSignal,
  V extends readonly MeydaAudioFeature[] | MeydaAudioFeature
> = MatchTupleLength<
  U,
  V extends T[]
    ? A.Compute<Partial<ConcreteResultType<MeydaAudioFeature>>, "flat">
    : A.Compute<ConcreteResultType<T>, "flat">
>;

type ExtractorParameterUnion<T extends MeydaAudioFeature> = Parameters<
  ExtractorMap[T]
>[0];
type ExtractorParametersIntersection<T extends MeydaAudioFeature> =
  Union.IntersectOf<ExtractorParameterUnion<T>>;
type ExtractorParameters<T extends MeydaAudioFeature> = {
  [k in keyof ExtractorParametersIntersection<T>]: ExtractorParametersIntersection<T>[k];
};

function isArray<T>(thing: T | T[] | readonly T[]): thing is readonly T[] {
  return Array.isArray(thing);
}

function isNotArray<T>(thing: T | T[] | readonly T[]): thing is T {
  return !Array.isArray(thing);
}

function isReadonlyArray<T>(thing: T | readonly T[]): thing is readonly T[] {
  return Array.isArray(thing);
}

function prepareExtractorDependencies<T extends MeydaAudioFeature>(
  features: readonly T[],
  signal: MeydaSignal,
  configuration: MeydaConfiguration
): ExtractorParameters<T> {
  return {};
}

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

  const configuration = configure(optionsAfterDefaults);

  /**
   * ## Extract given audio features from given signal
   *
   * @param feature The audio feature(s) to extract. Can be single or an array
   * @param signal The audio signal to extract the feature(s) from. Can be an
   * array containing each channel of a frame of multi-channel audio. If signal
   * is multi-channel, the result will be an array.
   *
   * The signal should have the same sample rate as specified in the options in
   * the call to `configureMeyda`. Otherwise, the audio features will be wrong.
   * There is no way to validate the sample rate of the signal, so you will get
   * mangled output if you don't match it.
   *
   * @returns The audio feature(s) extracted from the signal. If the signal is
   * multi-channel, this will be an array of results for each channel in the
   * same order that the channels were passed in.
   *
   * *NB: Multi-Channel -* Meyda saves a portion of the history of each channel
   * of audio for subsequent feature extraction runs. We assume that the
   * channels are passed in in the same order for every call to extract.
   * Changing the order of the channels between calls will produce invalid
   * results. We have no way to detect or warn you about this, so please make
   * sure that your audio channels are passed in in the same order every time.
   */
  function extract<
    T extends V extends readonly (infer K)[]
      ? K
      : V extends (infer K)[]
      ? K
      : V,
    U extends readonly MeydaSignal[] | MeydaSignal,
    V extends
      | MeydaAudioFeature[]
      | readonly MeydaAudioFeature[]
      | MeydaAudioFeature
  >(feature: V, signal: U): MaybePartialResult<T, U, V> {
    // const features: readonly T[] = isReadonlyArray<T>(feature as readonly T[] | T)
    //   ? feature
    //   : [feature];
    const features = (Array.isArray(feature)
      ? feature
      : [feature]) as unknown as readonly T[];

    const signals = Array.isArray(signal[0])
      ? (signal as unknown as readonly MeydaSignal[])
      : [signal];

    type SingleCorrectReturnType = {
      [ExtractorName in T]: ReturnTypesOf<ExtractorMap>[ExtractorName];
    };

    const results: SingleCorrectReturnType[] = signals.map((signal) => {
      // TODO:
      // apply windowing function
      // run fft on signal
      // cache previous (+?) signal, amp spectrum and complex spectrum per channel
      // run extractors with all deps
      // collect to MeydaExtractionResult
      const preparedExtractorDependencies: ExtractorParameters<MeydaAudioFeature> =
        prepareExtractorDependencies(features, signal, configuration);

      const channelExtractionResult = Object.fromEntries(
        features.map((feature) => {
          const extractor = extractors[feature];
          return [feature, extractors[feature](preparedExtractorDependencies)];
        })
      ) as unknown as SingleCorrectReturnType;

      return channelExtractionResult;
    });

    if (!Array.isArray(signal)) {
      return results[0] as unknown as MaybePartialResult<T, U, V>;
    }
    return results as unknown as MaybePartialResult<T, U, V>;
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
export function curryMeyda<
  T extends V extends readonly (infer K)[] ? K : V extends (infer K)[] ? K : V,
  U extends readonly MeydaSignal[] | MeydaSignal,
  V extends
    | MeydaAudioFeature[]
    | readonly MeydaAudioFeature[]
    | MeydaAudioFeature
>(
  features: V,
  extractor: (feature: V, signal: U) => MaybePartialResult<T, U, V>
): (signal: U) => MaybePartialResult<T, U, V> {
  return function extract(signal: U): MaybePartialResult<T, U, V> {
    const result = extractor(features, signal);
    return result;
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
export function configureMeydaWithExtractors<
  T extends V extends readonly (infer K)[] ? K : V extends (infer K)[] ? K : V,
  U extends readonly MeydaSignal[] | MeydaSignal,
  V extends
    | MeydaAudioFeature[]
    | readonly MeydaAudioFeature[]
    | MeydaAudioFeature
>(
  features: V,
  options?: Partial<MeydaConfigurationOptions>
): (signal: U) => MaybePartialResult<T, U, V> {
  return function extract(signal: U): MaybePartialResult<T, U, V> {
    const extractor: (feature: V, signal: U) => MaybePartialResult<T, U, V> =
      configureMeyda(options);
    return curryMeyda<T, U, V>(features, extractor)(signal);
  };
}

// type FType<
//   T extends V extends readonly (infer K)[] ? K : V extends (infer K)[] ? K : V,
//   U extends readonly MeydaSignal[] | MeydaSignal,
//   V extends
//     | MeydaAudioFeature[]
//     | readonly MeydaAudioFeature[]
//     | MeydaAudioFeature
// > = (feature: V, signal: U) => MaybePartialResult<T, U, V>;
