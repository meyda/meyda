import extractors from "./featureExtractors";

export type MeydaFeature = keyof typeof extractors;
export type AmplitudeSpectrum = Float32Array;
export type BarkScale = Float32Array;
export type MelFilterBank = number[][];
export type ChromaFilterBank = number[][];
export type Signal = Float32Array;
