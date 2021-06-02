import { Signal } from "../types";

export type ZcrParameters = {
  signal: Signal;
};

export default function zcr(args: ZcrParameters) {
  if (typeof args.signal !== "object") {
    throw new TypeError();
  }

  var zcr = 0;
  for (var i = 1; i < args.signal.length; i++) {
    if (
      (args.signal[i - 1] >= 0 && arguments[0].signal[i] < 0) ||
      (args.signal[i - 1] < 0 && arguments[0].signal[i] >= 0)
    ) {
      zcr++;
    }
  }

  return zcr;
}
