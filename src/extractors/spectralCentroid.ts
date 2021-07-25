import { mu } from "./extractorUtilities";

export default function ({
  ampSpectrum,
}: {
  ampSpectrum: Float32Array;
}): number {
  if (typeof ampSpectrum !== "object") {
    throw new TypeError();
  }

  return mu(1, ampSpectrum);
}
