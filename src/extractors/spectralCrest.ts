export default function ({
  ampSpectrum,
}: {
  ampSpectrum: Float32Array;
}): number {
  if (typeof ampSpectrum !== "object") {
    throw new TypeError();
  }

  var rms = 0;
  var peak = -Infinity;

  ampSpectrum.forEach((x) => {
    rms += Math.pow(x, 2);
    peak = x > peak ? x : peak;
  });

  rms = rms / ampSpectrum.length;
  rms = Math.sqrt(rms);

  return peak / rms;
}
