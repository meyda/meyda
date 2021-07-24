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

type ExtractPartial = {
  <F extends MeydaExtractors>(features: F, signal: Signal): {
    [ExtractorName in F]: ReturnTypesOf<ExtractorMap>[ExtractorName];
  };
  <F extends MeydaExtractors>(features: F): (
    signal: Signal
  ) => { [ExtractorName in F]: ReturnTypesOf<ExtractorMap>[ExtractorName] };
};

type CurriedExtract = {
  <F extends MeydaExtractors>(
    options: MeydaExtractionOptions,
    features: F[],
    signal: Signal
  ): { [ExtractorName in F]: ReturnTypesOf<ExtractorMap>[ExtractorName] };
  <F extends MeydaExtractors>(
    options: MeydaExtractionOptions,
    features: F[]
  ): ExtractPartial;
  (options: MeydaExtractionOptions): ExtractPartial;
};

type Extract = {
  <F extends MeydaExtractors>(
    options: MeydaExtractionOptions,
    features: F[],
    signal: Signal
  ): {
    [ExtractorName in F]: ReturnTypesOf<ExtractorMap>[ExtractorName];
  };
};

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
export const extract: Extract = function extract(options, features, signal) {
  // // prepare feature extractor params
  // if (!features) {
  //   const extractPartial: ExtractPartial = function extractPartial<T, U>(
  //     features: T,
  //     signal?: U | undefined
  //   ) {
  //     if (!signal) {
  //       return (signal: U) => extractPartial(features, signal);
  //     }
  //   };
  //   return extractPartial;
  // }

  // We have to keep doing type assertions here because Typescript's definitions
  // widen things a bit more than necessary.

  const preparedExtractorParameters = {};

  type ProvidedFeature = typeof features[number];

  const returnEntries = features.map<
    [ProvidedFeature, ReturnTypesOf<ExtractorMap>[ProvidedFeature]]
  >((feature) => [feature, extractors[feature](preparedExtractorParameters)]);

  return Object.fromEntries(returnEntries) as {
    [ExtractorName in ProvidedFeature]: ReturnType<ExtractorMap[ExtractorName]>;
  };
};

extract({}, ["energy", "rms", "complexSpectrum"], [1, 2, 3]);
extract({}, ["energy", "rms", "complexSpectrum"], new Float32Array([1, 2, 3]));

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
