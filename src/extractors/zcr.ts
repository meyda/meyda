export default function ({ signal }: { signal: Float32Array }): number {
  if (typeof signal !== "object") {
    throw new TypeError();
  }

  var zcr = 0;
  for (var i = 1; i < signal.length; i++) {
    if (
      (signal[i - 1] >= 0 && signal[i] < 0) ||
      (signal[i - 1] < 0 && signal[i] >= 0)
    ) {
      zcr++;
    }
  }

  return zcr;
}
