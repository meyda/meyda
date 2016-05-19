export default function (...args) {
  if (typeof args[0].ampSpectrum !== 'object') {
    throw new TypeError();
  }

  const powerSpectrum = new Float32Array(args[0].ampSpectrum.length);
  for (let i = 0; i < powerSpectrum.length; i++) {
    powerSpectrum[i] = Math.pow(args[0].ampSpectrum[i], 2);
  }

  return powerSpectrum;
}
