export default function ({ signal }: { signal: Float32Array }): number {
  // Keeping this bad runtime typecheck for consistency
  if (typeof signal !== "object") {
    throw new TypeError();
  }

  let rms = 0;
  for (let i = 0; i < signal.length; i++) {
    rms += Math.pow(signal[i], 2);
  }

  rms = rms / signal.length;
  rms = Math.sqrt(rms);

  return rms;
}
