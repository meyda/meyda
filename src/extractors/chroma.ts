export default function ({
  ampSpectrum,
  chromaFilterBank,
}: {
  ampSpectrum: Float32Array;
  chromaFilterBank: number[][];
}): number[] {
  if (typeof ampSpectrum !== "object") {
    throw new TypeError("Valid ampSpectrum is required to generate chroma");
  }
  if (typeof chromaFilterBank !== "object") {
    throw new TypeError(
      "Valid chromaFilterBank is required to generate chroma"
    );
  }

  var chromagram = chromaFilterBank.map((row, i) =>
    ampSpectrum.reduce((acc, v, j) => acc + v * row[j], 0)
  );
  var maxVal = Math.max(...chromagram);

  return maxVal ? chromagram.map((v) => v / maxVal) : chromagram;
}
