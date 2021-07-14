import { AmplitudeSpectrum } from "../types";

export type SpectralRolloffParameters = {
  ampSpectrum: AmplitudeSpectrum;
  sampleRate: number;
};

export default function spectralRolloff(args: SpectralRolloffParameters) {
  if (typeof args.ampSpectrum !== "object") {
    throw new TypeError();
  }

  var ampspec = args.ampSpectrum;

  //calculate nyquist bin
  var nyqBin = args.sampleRate / (2 * (ampspec.length - 1));
  var ec = 0;
  for (var i = 0; i < ampspec.length; i++) {
    ec += ampspec[i];
  }

  var threshold = 0.99 * ec;
  var n = ampspec.length - 1;
  while (ec > threshold && n >= 0) {
    ec -= ampspec[n];
    --n;
  }

  return (n + 1) * nyqBin;
}
