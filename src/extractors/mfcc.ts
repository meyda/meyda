import extractMelBands from "./melBands";
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
  // Tutorial from:
  // http://practicalcryptography.com/miscellaneous/machine-learning
  // /guide-mel-frequency-cepstral-coefficients-mfccs/
  // @ts-ignore

  let _numberOfMFCCCoefficients = Math.min(
    40,
    Math.max(1, numberOfMFCCCoefficients || 13)
  );

  let numFilters = melFilterBank.length;
  if (numFilters < _numberOfMFCCCoefficients) {
    throw new Error(
      "Insufficient filter bank for requested number of coefficients"
    );
  }
  const loggedMelBandsArray = extractMelBands({
    ampSpectrum,
    melFilterBank,
    bufferSize,
  });
  let mfccs: number[] = dct(loggedMelBandsArray).slice(
    0,
    _numberOfMFCCCoefficients
  );

  return mfccs;
}
