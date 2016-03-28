import {mu} from './extractorUtilities';

export default function(args) {
  if (typeof args.ampSpectrum !== 'object') {
    throw new TypeError();
  }

  return Math.sqrt(mu(2, args.ampSpectrum) -
         Math.pow(mu(1, args.ampSpectrum), 2));
}
