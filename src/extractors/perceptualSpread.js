import loudness from './loudness';
import {verifySymbol} from "../utilities/utilities";

export default function () {
  verifySymbol(arguments[0]);

  var loudnessValue = loudness(arguments[0]);

  var max = 0;
  for (var i = 0; i < loudnessValue.specific.length; i++) {
    if (loudnessValue.specific[i] > max) {
      max = loudnessValue.specific[i];
    }
  }

  var spread = Math.pow((loudnessValue.total - max) / loudnessValue.total, 2);

  return spread;
}
