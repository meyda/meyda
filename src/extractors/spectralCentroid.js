import { mu } from './extractorUtilities';

export default function (...args) {
  if (typeof args[0].ampSpectrum !== 'object') {
    throw new TypeError();
  }

  return mu(1, args[0].ampSpectrum);
}
