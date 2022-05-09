import loudness from "./loudness";

export default function ({
  ampSpectrum,
  barkScale,
}: {
  ampSpectrum: Float32Array;
  barkScale: Float32Array;
}): number {
  const loudnessValue = loudness({ ampSpectrum, barkScale });

  let max = 0;
  for (let i = 0; i < loudnessValue.specific.length; i++) {
    if (loudnessValue.specific[i] > max) {
      max = loudnessValue.specific[i];
    }
  }

  const spread = Math.pow((loudnessValue.total - max) / loudnessValue.total, 2);

  return spread;
}
