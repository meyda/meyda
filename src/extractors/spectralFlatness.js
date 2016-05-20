export default function (...args) {
  if (typeof args[0].ampSpectrum !== 'object') {
    throw new TypeError();
  }

  let numerator = 0;
  let denominator = 0;
  for (let i = 0; i < args[0].ampSpectrum.length; i++) {
    numerator += Math.log(args[0].ampSpectrum[i]);
    denominator += args[0].ampSpectrum[i];
  }

  return Math.exp(numerator / args[0].ampSpectrum.length) *
      args[0].ampSpectrum.length / denominator;
}
