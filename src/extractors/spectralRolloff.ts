export default function ({
  ampSpectrum,
  sampleRate,
}: {
  ampSpectrum: Float32Array;
  sampleRate: number;
}): number {
  if (typeof ampSpectrum !== "object") {
    throw new TypeError();
  }

  var ampspec = ampSpectrum;

  //calculate nyquist bin
  var nyqBin = sampleRate / (2 * (ampspec.length - 1));
  var ec = 0;
  for (var i = 0; i < ampspec.length; i++) {
    ec += ampspec[i];
  }

  var threshold = 0.99 * ec;
  var n = ampspec.length - 1;
  while (ec > threshold && n >= 0) {
    ec -= ampspec[n];
    --n;
  }

  return (n + 1) * nyqBin;
}
