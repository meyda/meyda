import { AmplitudeSpectrum, ChromaFilterBank } from "../main";

export type ChromaParameters = {
  ampSpectrum: AmplitudeSpectrum;
  chromaFilterBank: ChromaFilterBank;
};

export default function (args: ChromaParameters) {
  if (typeof args.ampSpectrum !== "object") {
    throw new TypeError("Valid ampSpectrum is required to generate chroma");
  }
  if (typeof args.chromaFilterBank !== "object") {
    throw new TypeError(
      "Valid chromaFilterBank is required to generate chroma"
    );
  }

  var chromagram = args.chromaFilterBank.map((row, i) =>
    args.ampSpectrum.reduce((acc, v, j) => acc + v * row[j], 0)
  );
  var maxVal = Math.max(...chromagram);

  return maxVal ? chromagram.map((v) => v / maxVal) : chromagram;
}
