import { mu } from "./extractorUtilities";

export default function ({
  ampSpectrum,
}: {
  ampSpectrum: Float32Array;
}): number {
  if (typeof ampSpectrum !== "object") {
    throw new TypeError();
  }

  const mu1 = mu(1, ampSpectrum);
  const mu2 = mu(2, ampSpectrum);
  const mu3 = mu(3, ampSpectrum);
  const numerator = 2 * Math.pow(mu1, 3) - 3 * mu1 * mu2 + mu3;
  const denominator = Math.pow(Math.sqrt(mu2 - Math.pow(mu1, 2)), 3);
  return numerator / denominator;
}
