import {mu} from './extractorUtilities';

export default function() {
  if (typeof arguments[0].ampSpectrum !== 'object') {
    throw new TypeError();
  }

  return mu(1, arguments[0].ampSpectrum);
}
