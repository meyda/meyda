import extractPowerSpectrum from "./powerSpectrum";

export default function ({
  ampSpectrum,
  melFilterBank,
  bufferSize,
}: {
  ampSpectrum: Float32Array;
  melFilterBank: number[][];
  bufferSize: number;
}): number[] {
  if (typeof ampSpectrum !== "object") {
    throw new TypeError("Valid ampSpectrum is required to generate melBands");
  }
  if (typeof melFilterBank !== "object") {
    throw new TypeError("Valid melFilterBank is required to generate melBands");
  }

  let powSpec = extractPowerSpectrum({ ampSpectrum });
  let numFilters = melFilterBank.length;
  let filtered: Float32Array[] = Array(numFilters);
  let loggedMelBands: Float32Array = new Float32Array(numFilters);

  for (let i = 0; i < loggedMelBands.length; i++) {
    filtered[i] = new Float32Array(bufferSize / 2);
    loggedMelBands[i] = 0;
    for (let j = 0; j < bufferSize / 2; j++) {
      //point-wise multiplication between power spectrum and filterbanks.
      filtered[i][j] = melFilterBank[i][j] * powSpec[j];

      //summing up all of the coefficients into one array
      loggedMelBands[i] += filtered[i][j];
    }

    //log each coefficient.
    loggedMelBands[i] = Math.log(loggedMelBands[i] + 1);
  }
  return Array.prototype.slice.call(loggedMelBands);
}
