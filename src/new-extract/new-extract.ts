import * as extractors from "../featureExtractors";
import { MeydaSignal } from "../main";
import {
  createBarkScale,
  createChromaFilterBank,
  createMelFilterBank,
} from "../utilities";
import * as windowingFunctions from "../windowing";
import { A, Union } from "ts-toolbelt";

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

type ConcreteResultType<
  T extends MeydaAudioFeature,
  U extends MeydaSignal[] | MeydaSignal
> =
 U extends MeydaSignal[]
  ? {
      [ExtractorName in T]: ReturnTypesOf<ExtractorMap>[ExtractorName];
    }[]
  : {
      [ExtractorName in T]: ReturnTypesOf<ExtractorMap>[ExtractorName];
    };

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
    T extends MeydaAudioFeature,
    U extends MeydaSignal[] | MeydaSignal,
    V extends T[] | readonly T[] | T
  >(
    feature: readonly T[] | T,
    signal: U
    // ): MeydaExtractionResult<T> {
  ): A.Compute<
    // V extends T[]
    //   ? // ? Partial<{ [k in MeydaAudioFeature]: ReturnTypesOf<ExtractorMap>[k] }>
    //     never
    //   : ConcreteResultType<T, U>
    ConcreteResultType<T, U>
  > {
    const features = Array.isArray(feature) ? feature : [feature];

    const signals = Array.isArray(signal[0])
      ? (signal as unknown as MeydaSignal[])
      : [signal];

    type SingleCorrectReturnType = {
      [ExtractorName in T]: ReturnTypesOf<ExtractorMap>[ExtractorName];
    };

    // type ExtractorParameterUnion = Parameters<ExtractorMap[T]>[0];
    type ExtractorParameterUnion = Parameters<
      ExtractorMap[MeydaAudioFeature]
    >[0];
    type ExtractorParametersIntersection =
      Union.IntersectOf<ExtractorParameterUnion>;
    type ExtractorParameters = {
      [k in keyof ExtractorParametersIntersection]: ExtractorParametersIntersection[k];
    };

    const results: SingleCorrectReturnType[] = signals.map((signal) => {
      // TODO:
      // apply windowing function
      // run fft on signal
      // cache previous (+?) signal, amp spectrum and complex spectrum per channel
      // run extractors with all deps
      // collect to MeydaExtractionResult
      const preparedExtractorDependencies: ExtractorParameters =
        prepareExtractorDependencies(features, signal, configuration);

      const channelExtractionResult = Object.fromEntries(
        features.map((feature) => {
          return [feature, extractors[feature](preparedExtractorDependencies)];
        })
      ) as unknown as SingleCorrectReturnType;

      return channelExtractionResult;
    });

    if (!Array.isArray(signal)) {
      return results[0] as unknown as A.Compute<ConcreteResultType<T, U>>;
    }
    return results as unknown as A.Compute<ConcreteResultType<T, U>>;
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
  extractor: <U extends MeydaSignal[] | MeydaSignal>(
    features: T | readonly T[],
    signal: U
  ) => A.Compute<ConcreteResultType<T, U>>
): <U extends MeydaSignal | MeydaSignal[]>(
  signal: U
) => A.Compute<ConcreteResultType<T, U>> {
  // return extractor.bind(null, features);
  return function extract<U extends MeydaSignal | MeydaSignal[]>(
    signal: U
  ): A.Compute<ConcreteResultType<T, U>> {
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
export function configureMeydaWithExtractors<T extends MeydaAudioFeature>(
  features: T | readonly T[],
  options?: Partial<MeydaConfigurationOptions>
): <U extends MeydaSignal | MeydaSignal[]>(
  signal: U
) => A.Compute<ConcreteResultType<T, U>> {
  return function extract<U extends MeydaSignal | MeydaSignal[]>(
    signal: U
  ): A.Compute<ConcreteResultType<T, U>> {
    return curryMeyda(features, configureMeyda(options))(signal);
  };
}
