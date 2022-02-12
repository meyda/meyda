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
import { MeydaSignal } from "./main";

let buffer = function (args: { signal: MeydaSignal }): MeydaSignal {
  return args.signal;
};

let complexSpectrum = function (args: {
  complexSpectrum: { real: number[]; imag: number[] };
}) {
  return args.complexSpectrum;
};

let amplitudeSpectrum = function (args: { ampSpectrum: number[] }) {
  return args.ampSpectrum;
};

export {
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
};
