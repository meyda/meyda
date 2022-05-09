export default function ({
  ampSpectrum,
  barkScale,
  numberOfBarkBands = 24,
}: {
  ampSpectrum: Float32Array;
  barkScale: Float32Array;
  numberOfBarkBands?: number;
}): {
  specific: Float32Array;
  total: number;
} {
  if (typeof ampSpectrum !== "object" || typeof barkScale !== "object") {
    throw new TypeError();
  }

  const NUM_BARK_BANDS = numberOfBarkBands;
  const specific = new Float32Array(NUM_BARK_BANDS);
  let total = 0;
  const normalisedSpectrum = ampSpectrum;
  const bbLimits = new Int32Array(NUM_BARK_BANDS + 1);

  bbLimits[0] = 0;
  let currentBandEnd =
    barkScale[normalisedSpectrum.length - 1] / NUM_BARK_BANDS;
  let currentBand = 1;
  for (let i = 0; i < normalisedSpectrum.length; i++) {
    while (barkScale[i] > currentBandEnd) {
      bbLimits[currentBand++] = i;
      currentBandEnd =
        (currentBand * barkScale[normalisedSpectrum.length - 1]) /
        NUM_BARK_BANDS;
    }
  }

  bbLimits[NUM_BARK_BANDS] = normalisedSpectrum.length - 1;

  //process

  for (let i = 0; i < NUM_BARK_BANDS; i++) {
    let sum = 0;
    for (let j = bbLimits[i]; j < bbLimits[i + 1]; j++) {
      sum += normalisedSpectrum[j];
    }

    specific[i] = Math.pow(sum, 0.23);
  }

  //get total loudness
  for (let i = 0; i < specific.length; i++) {
    total += specific[i];
  }

  return {
    specific: specific,
    total: total,
  };
}
