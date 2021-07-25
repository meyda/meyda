export default function ({ signal }: { signal: Float32Array }): number {
  if (typeof signal !== "object") {
    throw new TypeError();
  }

  var energy = 0;
  for (var i = 0; i < signal.length; i++) {
    energy += Math.pow(Math.abs(signal[i]), 2);
  }

  return energy;
}
