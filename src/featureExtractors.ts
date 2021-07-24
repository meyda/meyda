import rms from "./extractors/rms";
import energy from "./extractors/energy";
import spectralSlope from "./extractors/spectralSlope";
import spectralCentroid from "./extractors/spectralCentroid";
import spectralRolloff from "./extractors/spectralRolloff";
import spectralFlatness from "./extractors/spectralFlatness";
import spectralSpread from "./extractors/spectralSpread";
import spectralSkewness from "./extractors/spectralSkewness";
import spectralKurtosis from "./extractors/spectralKurtosis";
import zcr from "./extractors/zcr";
import loudness from "./extractors/loudness";
import perceptualSpread from "./extractors/perceptualSpread";
import perceptualSharpness from "./extractors/perceptualSharpness";
import mfcc from "./extractors/mfcc";
import chroma from "./extractors/chroma";
import powerSpectrum from "./extractors/powerSpectrum";
import spectralFlux from "./extractors/spectralFlux";

let buffer = function (args) {
  return args.signal;
};

let complexSpectrum = function (args) {
  return args.complexSpectrum;
};

let amplitudeSpectrum = function (args) {
  return args.ampSpectrum;
};

const extractors = {
  buffer,
  rms,
  energy,
  complexSpectrum,
  spectralSlope,
  spectralCentroid,
  spectralRolloff,
  spectralFlatness,
  spectralSpread,
  spectralSkewness,
  spectralKurtosis,
  amplitudeSpectrum,
  zcr,
  loudness,
  perceptualSpread,
  perceptualSharpness,
  powerSpectrum,
  mfcc,
  chroma,
  spectralFlux,
} as const;

export type ExtractorMap = typeof extractors;
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;

type ExtractorFunctions = ExtractorMap[keyof ExtractorMap];
type AllParameterTypes = Parameters<ExtractorFunctions>[0];
export type MeydaExtractors = keyof ExtractorMap;
export type UnionExtractorParams = UnionToIntersection<AllParameterTypes>;

export default extractors;
