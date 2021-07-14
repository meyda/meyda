import { Signal } from "../types";
import loudness, { LoudnessParameters } from "./loudness";

export type PerceptualSharpnessParamters = {
  signal: Signal;
} & LoudnessParameters;

export default function perceptualSharpness(
  args: PerceptualSharpnessParamters
) {
  if (typeof args.signal !== "object") {
    throw new TypeError();
  }

  var loudnessValue = loudness(args);
  var spec = loudnessValue.specific;
  var output = 0;

  for (var i = 0; i < spec.length; i++) {
    if (i < 15) {
      output += (i + 1) * spec[i + 1];
    } else {
      output += 0.066 * Math.exp(0.171 * (i + 1));
    }
  }

  output *= 0.11 / loudnessValue.total;

  return output;
}
