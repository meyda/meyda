import { AmplitudeSpectrum } from "../types";
import { mu } from "./extractorUtilities";

type SpectralCentroidParameters = {
  ampSpectrum: AmplitudeSpectrum;
};

export default function spectralCentroid(args: SpectralCentroidParameters) {
  if (typeof args.ampSpectrum !== "object") {
    throw new TypeError();
  }

  return mu(1, args.ampSpectrum);
}
