import {verifySymbol} from "../utilities/utilities";

export default function () {
  verifySymbol(arguments[0]);

  let zcr = 0;
  for (let i = 0; i < arguments[0].signal.length; i++) {
    if (verifySignal(arguments[0], i)) {
      zcr++;
    }
  }

  return zcr;
}

function verifySignal(argument, index) {
  if ((arguments[0].signal[index] >= 0 && arguments[0].signal[index + 1] < 0) ||
    (arguments[0].signal[index] < 0 && arguments[0].signal[index + 1] >= 0)) {
    return true;
  }
}
