import {mu} from './extractorUtilities';

export default function(args) {
  if (typeof args.ampSpectrum !== 'object') {
    throw new TypeError();
  }

  var mu1 = mu(1, args.ampSpectrum);
  var mu2 = mu(2, args.ampSpectrum);
  var mu3 = mu(3, args.ampSpectrum);
  var numerator = 2 * Math.pow(mu1, 3) - 3 * mu1 * mu2 + mu3;
  var denominator = Math.pow(Math.sqrt(mu2 - Math.pow(mu1, 2)), 3);
  return numerator / denominator;
}
