export default function ({
  ampSpectrum,
}: {
  ampSpectrum: Float32Array;
}): number {
  if (typeof ampSpectrum !== "object") {
    throw new TypeError();
  }

  var numerator = 0;
  var denominator = 0;
  for (var i = 0; i < ampSpectrum.length; i++) {
    numerator += Math.log(ampSpectrum[i]);
    denominator += ampSpectrum[i];
  }

  return (
    (Math.exp(numerator / ampSpectrum.length) * ampSpectrum.length) /
    denominator
  );
}
