export default function (...args) {
  if (typeof args[0].ampSpectrum !== 'object') {
    throw new TypeError();
  }

  const ampspec = args[0].ampSpectrum;

  // calculate nyquist bin
  const nyqBin = args[0].sampleRate / (2 * (ampspec.length - 1));
  let ec = 0;
  for (let i = 0; i < ampspec.length; i++) {
    ec += ampspec[i];
  }

  const threshold = 0.99 * ec;
  let n = ampspec.length - 1;
  while (ec > threshold && n >= 0) {
    ec -= ampspec[n];
    --n;
  }

  return (n + 1) * nyqBin;
}
