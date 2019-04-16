import {hzToOctaves, normalizeByColumn} from "./utilities";

export function createChromaFilterBank(numFilters, sampleRate, bufferSize, centerOctave = 5, octaveWidth = 2, baseC = true, A440 = 440) {
  let numOutputBins = Math.floor(bufferSize / 2) + 1;

  let frequencyBins = new Array(bufferSize).fill(0)
    .map((_, i) => numFilters * hzToOctaves(sampleRate * i / bufferSize, A440));

  // Set a value for the 0 Hz bin that is 1.5 octaves below bin 1
  // (so chroma is 50% rotated from bin 1, and bin width is broad)
  frequencyBins[0] = frequencyBins[1] - 1.5 * numFilters;

  let binWidthBins = frequencyBins.slice(1)
    .map((v, i) => Math.max(v - frequencyBins[i]), 1).concat([1]);

  let halfNumFilters = Math.round(numFilters / 2);

  let filterPeaks = new Array(numFilters).fill(0)
    .map((_, i) => frequencyBins.map(frq =>
      ((10 * numFilters + halfNumFilters + frq - i) % numFilters) - halfNumFilters
    ));

  let weights = filterPeaks.map((row, i) => row.map((_, j) => (
    Math.exp(-0.5 * Math.pow(2 * filterPeaks[i][j] / binWidthBins[j], 2))
  )));

  weights = normalizeByColumn(weights);

  if (octaveWidth) {
    let octaveWeights = frequencyBins.map(v =>
      Math.exp(-0.5 * Math.pow((v / numFilters - centerOctave) / octaveWidth, 2))
    );
    weights = weights.map(row => row.map((cell, j) => cell * octaveWeights[j]));
  }

  weights = baseCNormalization(weights, baseC);

  return weights.map(row => row.slice(0, numOutputBins));
}

function baseCNormalization(weights, baseC) {
  if (baseC) {
    weights = [...weights.slice(3), ...weights.slice(0, 3)];
  }

  return weights;
}
