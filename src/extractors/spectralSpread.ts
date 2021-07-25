import { mu } from "./extractorUtilities";

export default function ({
  ampSpectrum,
}: {
  ampSpectrum: Float32Array;
}): number {
  if (typeof ampSpectrum !== "object") {
    throw new TypeError();
  }

  return Math.sqrt(mu(2, ampSpectrum) - Math.pow(mu(1, ampSpectrum), 2));
}
