import { Signal } from "../main";
import loudness, { LoudnessParameters } from "./loudness";

export type PerceptualSpreadParameters = {
  signal: Signal;
} & LoudnessParameters;

export default function perceptualSpread(args: PerceptualSpreadParameters) {
  if (typeof args.signal !== "object") {
    throw new TypeError();
  }

  var loudnessValue = loudness(args);

  var max = 0;
  for (var i = 0; i < loudnessValue.specific.length; i++) {
    if (loudnessValue.specific[i] > max) {
      max = loudnessValue.specific[i];
    }
  }

  var spread = Math.pow((loudnessValue.total - max) / loudnessValue.total, 2);

  return spread;
}
