export default function ({
  ampSpectrum,
}: {
  ampSpectrum: Float32Array;
}): Float32Array {
  if (typeof ampSpectrum !== "object") {
    throw new TypeError();
  }

  const powerSpectrum = new Float32Array(ampSpectrum.length);
  for (let i = 0; i < powerSpectrum.length; i++) {
    powerSpectrum[i] = Math.pow(ampSpectrum[i], 2);
  }

  return powerSpectrum;
}
