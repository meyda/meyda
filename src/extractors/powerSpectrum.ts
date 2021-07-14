import { AmplitudeSpectrum } from "../types";

type PowerSpectrumParameters = {
  ampSpectrum: AmplitudeSpectrum;
};

export default function powerSpectrum(args: PowerSpectrumParameters) {
  if (typeof args.ampSpectrum !== "object") {
    throw new TypeError();
  }

  var powerSpectrum = new Float32Array(arguments[0].ampSpectrum.length);
  for (var i = 0; i < powerSpectrum.length; i++) {
    powerSpectrum[i] = Math.pow(arguments[0].ampSpectrum[i], 2);
  }

  return powerSpectrum;
}
