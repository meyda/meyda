// Type definitions for meyda 4.3
// Project: https://github.com/meyda/meyda
// Definitions by: Damien Erambert <https://github.com/eramdam>
//                 Hugh Rawlinson <https://github.com/hughrawlinson>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

export as namespace Meyda;

/**
 * The supported windowing functions that can be applied to audio buffers before
 * feature extraction.
 */
export type MeydaWindowingFunction =
  | "blackman"
  | "sine"
  | "hanning"
  | "hamming";

export type MeydaAudioFeature =
  | "amplitudeSpectrum"
  | "chroma"
  | "complexSpectrum"
  | "energy"
  | "loudness"
  | "mfcc"
  | "perceptualSharpness"
  | "perceptualSpread"
  | "powerSpectrum"
  | "rms"
  | "spectralCentroid"
  | "spectralFlatness"
  | "spectralFlux"
  | "spectralKurtosis"
  | "spectralRolloff"
  | "spectralSkewness"
  | "spectralSlope"
  | "spectralSpread"
  | "zcr"
  | "buffer";

export as namespace Meyda;
