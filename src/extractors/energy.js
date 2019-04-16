import {verifySymbol} from "../utilities/utilities";

export default function () {
  verifySymbol(arguments[0]);

  var energy = 0;
  for (var i = 0; i < arguments[0].signal.length; i++) {
    energy += Math.pow(Math.abs(arguments[0].signal[i]), 2);
  }

  return energy;
}
