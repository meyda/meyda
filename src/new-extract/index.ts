import { A } from "ts-toolbelt";
import extractors, {
  MeydaExtractors,
  ExtractorMap,
} from "../featureExtractors";

type Signal = ArrayLike<number>;
interface MeydaExtractionOptions {
  bufferSize?: number;
}

type ReturnTypesOf<T extends Record<string, (...args: any) => any>> = {
  [K in keyof T]: ReturnType<T[K]>;
};
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

type ExtractionResult<F extends MeydaExtractors> = {
  [ExtractorName in F]: ReturnTypesOf<ExtractorMap>[ExtractorName];
};

/*
 * Options have been set, you can provide features and a signal, or just features,
 * which will partially apply.
 */
type OptionedExtract<F extends MeydaExtractors> = A.Compute<{
  (features: F[], signal: Signal): ExtractionResult<F>;
  (features: F[]): FeaturedExtract<F>;
}>;

/**
 * Options and features have been set, you just need to provide a signal.
 */
type FeaturedExtract<F extends MeydaExtractors> = A.Compute<
  {
    (signal: Signal): ExtractionResult<F>;
  },
  "flat"
>;

/**
 * A curryable function that extracts given features from a signal.
 *
 * ### Direct usage:
 *
 * ```ts
 * const extractedFeatures = extract(options, ["spectralFlux","mfcc"], signal);
 * ```
 *
 * ### Curried usage:
 *
 * ```ts
 * const myFeatures: MeydaExtractors = ["rms", "zcr", "spectralCentroid"];
 * const extractWithOptions = extract(options);
 * const extractMyFeatures = extractWithOptions(myFeatures);
 * const extractedFeatures = extractMyFeatures(signal);
 * ```
 *
 * @param options Top level options for the extraction.
 * @param features A list of features to extract.
 * @param signal The signal to extract features from.
 * @returns An object containing the extracted features.
 */
// type Extract = {
//   <F extends MeydaExtractors>(
//     options: MeydaExtractionOptions
//   ): OptionedExtract<F>;
//   <F extends MeydaExtractors>(
//     options: MeydaExtractionOptions,
//     features: F[]
//   ): FeaturedExtract<F>;
//   <F extends MeydaExtractors>(
//     options: MeydaExtractionOptions,
//     features: F[],
//     signal: Signal
//   ): ExtractionResult<F>;
// };
type Extract = {
  <F extends MeydaExtractors>(
    options: MeydaExtractionOptions,
    features: F[],
    signal: Signal
  ): ExtractionResult<F>;
  <F extends MeydaExtractors>(options: MeydaExtractionOptions, features: F[]): {
    (signal: Signal): ExtractionResult<F>;
  };
  <F extends MeydaExtractors>(options: MeydaExtractionOptions): {
    (features: F[]): {
      (signal: Signal): ExtractionResult<F>;
    };
    (features: F[], signal: Signal): ExtractionResult<F>;
  };
};

export const extract: Extract = function extract<F extends MeydaExtractors>(
  options: MeydaExtractionOptions,
  features?: F[],
  signal?: Signal
) {
  const preparedOptions = prepareExtractorOptions(options);
  if (!features) {
    return function f<F extends MeydaExtractors>(
      features: F[],
      signal?: Signal
    ) {
      // I know this looks like duplication, but since we can't call a function
      // with an optional parameter given a T | undefined, we can't deduplicate
      // this conditional.
      if (!signal) {
        return (signal: Signal) =>
          fullyAppliedExtract(preparedOptions, features, signal);
      }
      return fullyAppliedExtract(preparedOptions, features, signal);
    };
  }
  if (!signal) {
    return (signal: Signal) =>
      fullyAppliedExtract(preparedOptions, features, signal);
  }
  return fullyAppliedExtract(preparedOptions, features, signal);
};

type PreparedExtractorOptions = unknown;

type ExtractWithPreparedOptions = {
  <F extends MeydaExtractors>(
    options: PreparedExtractorOptions,
    features: F[]
  ): (signal: Signal) => ExtractionResult<F>;
  <F extends MeydaExtractors>(
    options: PreparedExtractorOptions,
    features: F[],
    signal: Signal
  ): ExtractionResult<F>;
};

// const extractWithPreparedOptions: ExtractWithPreparedOptions =
const _extractWithPreparedOptions = function extractWithPreparedOptions<
  F extends MeydaExtractors
>(options: PreparedExtractorOptions, features: F[], signal?: Signal) {
  if (!signal) {
    return (signal: Signal) =>
      fullyAppliedExtract<F>(options, features, signal);
  }
  const appliedResult = fullyAppliedExtract<F>(options, features, signal);
  return appliedResult;
};
const extractWithPreparedOptions: ExtractWithPreparedOptions =
  _extractWithPreparedOptions;

const prepareExtractorOptions = (
  options: MeydaExtractionOptions
): PreparedExtractorOptions => {
  return {};
};

function fullyAppliedExtract<F extends MeydaExtractors>(
  options: PreparedExtractorOptions,
  features: F[],
  signal: Signal
): ExtractionResult<F> {
  // We have to keep doing type assertions here because Typescript's definitions
  // widen things a bit more than necessary.

  // @ts-expect-error
  const preparedExtractorParameters: AllMeydaExtractorParams<
    // @ts-expect-error
    keyof typeof features
  > = {};

  type ProvidedFeature = typeof features[number];

  // @ts-expect-error
  const returnEntries = features.map<
    [ProvidedFeature, ReturnTypesOf<ExtractorMap>[ProvidedFeature]]
    //@ts-expect-error
  >((feature) => {
    const extractor = extractors[feature];
    return [
      feature,
      // @ts-expect-error
      extractor({
        ...preparedExtractorParameters,
        signal: new Float32Array(signal),
      }),
    ];
  });

  // TODO: Fix the type here
  return Object.fromEntries(returnEntries) as {
    [ExtractorName in ProvidedFeature]: ReturnType<ExtractorMap[ExtractorName]>;
  } as any;
}

const a = extract({}, ["rms"], [1, 2, 3]);
const b = extract({}, ["rms"]);
const x = b([1, 2, 3]);
const c = extract({});
const rmsExtractor = c(["rms"]);
const rms = rmsExtractor([1, 2, 3]);
c(["rms"], [1, 2, 3]);
const d = extract(
  {},
  ["energy", "rms", "complexSpectrum"],
  new Float32Array([1, 2, 3])
);

type Intersection<A, B> = A & B;
type T = Intersection<{ a: string }, { b: number }>;
const t: T = { a: "", b: 0 };

// export type FunctionInfer<F> = F extends ( ...args: infer A ) => infer R ? [ A /**  A matches params */, R ] : never;
// export type Parameters<F extends (...args: any[]) => any> = F extends (...args: infer A) => any ? A : never;

// // export type EnumLiteralsOf<T extends object> = T[keyof T];

// // export type ValuesWithKeys<T, K extends keyof T> = T[K];
// export type ValuesWithKeys<T extends object, K extends keyof T> = T[K] extends (...args: infer A) => unknown ? T[K]: never

// type InferValue<O extends object, K extends keyof O> = ValuesWithKeys<O, K>

// type TR = ReturnTypesOf<typeof myMap2>;
// type TP = ParameterTypesOf<typeof myMap2>;

// type R = Pick<TR, "function1" | "function2">
// type P = Pick<TP, "function1" | "function2">

// const myMap2 = {
//   function1: (a: boolean, t: string) => "value",
//   function2: () => "value"
// }

// function extract<M extends Record<string, (...args: any) => any>, K extends keyof M>(
//   map: M,
//   functions: K[],
// ): {[ExtractorName in K]: ReturnTypesOf<M>[ExtractorName]} {
//   return {} as any;
// }

// const v = extract(myMap2, ["function1"]);

// type X = Parameters<ValuesWithKeys<typeof myMap2, 'function1'>>
