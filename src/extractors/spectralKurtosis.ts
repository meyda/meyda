import { AmplitudeSpectrum } from "../main";
import { mu } from "./extractorUtilities";

export type SpectralKurtosisParameters = {
  ampSpectrum: AmplitudeSpectrum;
};

export default function spectralKurtosis(args: SpectralKurtosisParameters) {
  if (typeof args.ampSpectrum !== "object") {
    throw new TypeError();
  }

  var ampspec = args.ampSpectrum;
  var mu1 = mu(1, ampspec);
  var mu2 = mu(2, ampspec);
  var mu3 = mu(3, ampspec);
  var mu4 = mu(4, ampspec);
  var numerator = -3 * Math.pow(mu1, 4) + 6 * mu1 * mu2 - 4 * mu1 * mu3 + mu4;
  var denominator = Math.pow(Math.sqrt(mu2 - Math.pow(mu1, 2)), 4);
  return numerator / denominator;
}
