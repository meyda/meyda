import loudness from "./loudness";

export default function ({
  ampSpectrum,
  barkScale,
}: {
  ampSpectrum: Float32Array;
  barkScale: Float32Array;
}): number {
  var loudnessValue = loudness({ ampSpectrum, barkScale });
  var spec = loudnessValue.specific;
  var output = 0;

  for (var i = 0; i < spec.length; i++) {
    if (i < 15) {
      output += (i + 1) * spec[i + 1];
    } else {
      output += 0.066 * Math.exp(0.171 * (i + 1));
    }
  }

  output *= 0.11 / loudnessValue.total;

  return output;
}
