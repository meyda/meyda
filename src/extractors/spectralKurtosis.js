import { mu } from './extractorUtilities';

export default function (...args) {
  if (typeof args[0].ampSpectrum !== 'object') {
    throw new TypeError();
  }

  const ampspec = args[0].ampSpectrum;
  const mu1 = mu(1, ampspec);
  const mu2 = mu(2, ampspec);
  const mu3 = mu(3, ampspec);
  const mu4 = mu(4, ampspec);
  const numerator = -3 * Math.pow(mu1, 4) + 6 * mu1 * mu2 - 4 * mu1 * mu3 + mu4;
  const denominator = Math.pow(Math.sqrt(mu2 - Math.pow(mu1, 2)), 4);
  return numerator / denominator;
}
