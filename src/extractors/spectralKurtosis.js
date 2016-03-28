import {mu} from './extractorUtilities';

export default function() {
  if (typeof arguments[0].ampSpectrum !== 'object') {
    throw new TypeError();
  }

  var ampspec = arguments[0].ampSpectrum;
  var mu1 = mu(1, ampspec);
  var mu2 = mu(2, ampspec);
  var mu3 = mu(3, ampspec);
  var mu4 = mu(4, ampspec);
  var numerator = -3 * Math.pow(mu1, 4) + 6 * mu1 * mu2 - 4 * mu1 * mu3 + mu4;
  var denominator = Math.pow(Math.sqrt(mu2 - Math.pow(mu1, 2)), 4);
  return numerator / denominator;
}
