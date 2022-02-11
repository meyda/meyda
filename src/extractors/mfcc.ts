import extractPowerSpectrum from "./powerSpectrum";
import dct from "dct";

export default function ({
  ampSpectrum,
  melFilterBank,
  numberOfMFCCCoefficients,
  bufferSize,
}: {
  ampSpectrum: Float32Array;
  melFilterBank: number[][];
  numberOfMFCCCoefficients: number;
  bufferSize: number;
}): number[] {
  if (typeof ampSpectrum !== "object") {
    throw new TypeError("Valid ampSpectrum is required to generate MFCC");
  }
  if (typeof melFilterBank !== "object") {
    throw new TypeError("Valid melFilterBank is required to generate MFCC");
  }

  const _numberOfMFCCCoefficients = Math.min(
    40,
    Math.max(1, numberOfMFCCCoefficients || 13)
  );

  // Tutorial from:
  // http://practicalcryptography.com/miscellaneous/machine-learning
  // /guide-mel-frequency-cepstral-coefficients-mfccs/
  // @ts-ignore
  const powSpec = extractPowerSpectrum({ ampSpectrum });
  const numFilters = melFilterBank.length;
  const filtered: Float32Array[] = Array(numFilters);

  if (numFilters < _numberOfMFCCCoefficients) {
    throw new Error(
      "Insufficient filter bank for requested number of coefficients"
    );
  }

  const loggedMelBands: Float32Array = new Float32Array(numFilters);

  for (let i = 0; i < loggedMelBands.length; i++) {
    filtered[i] = new Float32Array(bufferSize / 2);
    loggedMelBands[i] = 0;
    for (let j = 0; j < bufferSize / 2; j++) {
      // point-wise multiplication between power spectrum and filterbanks.
      filtered[i][j] = melFilterBank[i][j] * powSpec[j];

      // summing up all of the coefficients into one array
      loggedMelBands[i] += filtered[i][j];
    }

    // log each coefficient.
    loggedMelBands[i] = Math.log(loggedMelBands[i] + 1);
  }

  //dct
  const loggedMelBandsArray: number[] =
    Array.prototype.slice.call(loggedMelBands);
  const mfccs: number[] = dct(loggedMelBandsArray).slice(
    0,
    _numberOfMFCCCoefficients
  );

  return mfccs;
}
