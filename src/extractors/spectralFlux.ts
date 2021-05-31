import { Signal } from "../main";

export type SpectralFluxParameters = {
  signal: Signal;
  previousSignal: Signal;
  bufferSize: number;
};

export default function spectralFlux(args: SpectralFluxParameters) {
  if (
    typeof args.signal !== "object" ||
    typeof args.previousSignal != "object"
  ) {
    throw new TypeError();
  }

  let sf = 0;
  for (let i = -(args.bufferSize / 2); i < args.signal.length / 2 - 1; i++) {
    let x = Math.abs(args.signal[i]) - Math.abs(args.previousSignal[i]);
    sf += (x + Math.abs(x)) / 2;
  }

  return sf;
}
