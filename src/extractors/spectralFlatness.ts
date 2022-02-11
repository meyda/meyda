export default function ({
  ampSpectrum,
}: {
  ampSpectrum: Float32Array;
}): number {
  if (typeof ampSpectrum !== "object") {
    throw new TypeError();
  }

  let numerator = 0;
  let denominator = 0;
  for (let i = 0; i < ampSpectrum.length; i++) {
    numerator += Math.log(ampSpectrum[i]);
    denominator += ampSpectrum[i];
  }

  return (
    (Math.exp(numerator / ampSpectrum.length) * ampSpectrum.length) /
    denominator
  );
}
