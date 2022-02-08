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

  return function extract<
    T extends MeydaAudioFeature,
    U extends MeydaSignal | MeydaSignal[]
  >(
    feature: T | T[],
    signal: MeydaSignal | MeydaSignal[]
  ): U extends [] ? MeydaExtractionResult<T>[] : MeydaExtractionResult<T> {
    type TheRightReturnType = U extends []
      ? MeydaExtractionResult<T>[]
      : MeydaExtractionResult<T>;
    const features = Array.isArray(feature) ? feature : [feature];
    const signals = Array.isArray(signal) ? signal : [signal];

    const results: MeydaExtractionResult<T>[] = signals.map((signal) => {
      // TODO:
      // apply windowing function
      // run fft on signal
      // cache previous (+?) signal, amp spectrum and complex spectrum per channel
      // run extractors with all deps
      // collect to MeydaExtractionResult
      const preparedThings: AllMeydaExtractorParams<T> = 9;

      const channelExtractionResult: MeydaExtractionResult<T> =
        Object.fromEntries(
          features.map((feature) => {
            const extractor = extractors[feature];
            extractor("fish");
            return [feature, extractors[feature](preparedThings)];
          })
        ) as MeydaExtractionResult<T>;

      return channelExtractionResult;
    });

    if (!Array.isArray(signal)) {
      return results[0] as TheRightReturnType;
    }
    return results as TheRightReturnType;
  };
}
