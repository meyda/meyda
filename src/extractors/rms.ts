import { Signal } from "../types";

export type RmsParameters = {
  signal: Signal;
};
export default function rms(args: RmsParameters) {
  if (typeof args.signal !== "object") {
    throw new TypeError();
  }

  var rms = 0;
  for (var i = 0; i < args.signal.length; i++) {
    rms += Math.pow(args.signal[i], 2);
  }

  rms = rms / args.signal.length;
  rms = Math.sqrt(rms);

  return rms;
}
