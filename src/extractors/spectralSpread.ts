import { AmplitudeSpectrum } from "../main";
import { mu } from "./extractorUtilities";

export type SpectralSpreadParameters = {
  ampSpectrum: AmplitudeSpectrum;
};

export default function spectralSpread(args: SpectralSpreadParameters) {
  if (typeof args.ampSpectrum !== "object") {
    throw new TypeError();
  }

  return Math.sqrt(
    mu(2, args.ampSpectrum) - Math.pow(mu(1, args.ampSpectrum), 2)
  );
}
