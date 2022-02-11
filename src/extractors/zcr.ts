export default function ({ signal }: { signal: Float32Array }): number {
  if (typeof signal !== "object") {
    throw new TypeError();
  }

  let zcr = 0;
  for (let i = 1; i < signal.length; i++) {
    if (
      (signal[i - 1] >= 0 && signal[i] < 0) ||
      (signal[i - 1] < 0 && signal[i] >= 0)
    ) {
      zcr++;
    }
  }

  return zcr;
}
