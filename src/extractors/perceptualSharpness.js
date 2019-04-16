import loudness from './loudness';
import {verifySymbol} from "../utilities/utilities";

export default function () {
  verifySymbol(arguments[0]);

  let loudnessValue = loudness(arguments[0]);
  let spec = loudnessValue.specific;
  let output = 0;

  for (let i = 0; i < spec.length; i++) {
    output += updateOutput(i, spec);
  }
  output *= 0.11 / loudnessValue.total;

  return output;
}

function updateOutput(index, spec) {
  if (index < 15) {
    return (index + 1) * spec[index + 1];
  }
  return 0.066 * Math.exp(0.171 * (index + 1));
}
