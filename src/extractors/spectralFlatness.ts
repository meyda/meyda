import { AmplitudeSpectrum } from "../types";

export type SpectralFlatnessParameters = {
  ampSpectrum: AmplitudeSpectrum;
};

export default function spectralFlatness(args: SpectralFlatnessParameters) {
  if (typeof args.ampSpectrum !== "object") {
    throw new TypeError();
  }

  var numerator = 0;
  var denominator = 0;
  for (var i = 0; i < args.ampSpectrum.length; i++) {
    numerator += Math.log(args.ampSpectrum[i]);
    denominator += args.ampSpectrum[i];
  }

  return (
    (Math.exp(numerator / args.ampSpectrum.length) * args.ampSpectrum.length) /
    denominator
  );
}
