import loudness from "./loudness";

export default function ({
  ampSpectrum,
  barkScale,
}: {
  ampSpectrum: Float32Array;
  barkScale: Float32Array;
}): number {
  var loudnessValue = loudness({ ampSpectrum, barkScale });

  var max = 0;
  for (var i = 0; i < loudnessValue.specific.length; i++) {
    if (loudnessValue.specific[i] > max) {
      max = loudnessValue.specific[i];
    }
  }

  var spread = Math.pow((loudnessValue.total - max) / loudnessValue.total, 2);

  return spread;
}
