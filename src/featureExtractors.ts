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
import { AmplitudeSpectrum, Signal } from "./main";
import { ComplexSpectrum } from "fftjs";

function buffer({ signal }: { signal: Signal }) {
  return signal;
}

function complexSpectrum({
  complexSpectrum,
}: {
  complexSpectrum: ComplexSpectrum;
}) {
  return complexSpectrum;
}

function amplitudeSpectrum({
  ampSpectrum,
}: {
  ampSpectrum: AmplitudeSpectrum;
}) {
  return ampSpectrum;
}

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

type ExtractorsType = typeof extractors;
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;

type ExtractorFunctions = ExtractorsType[keyof ExtractorsType];
type AllParameterTypes = Parameters<ExtractorFunctions>[0];
export type UnionExtractorParams = UnionToIntersection<AllParameterTypes>;

export default extractors;
