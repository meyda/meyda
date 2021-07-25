export default function ({
  ampSpectrum,
  sampleRate,
  bufferSize,
}: {
  ampSpectrum: Float32Array;
  sampleRate: number;
  bufferSize: number;
}): number {
  if (typeof ampSpectrum !== "object") {
    throw new TypeError();
  }

  //linear regression
  let ampSum = 0;
  let freqSum = 0;
  let freqs = new Float32Array(ampSpectrum.length);
  let powFreqSum = 0;
  let ampFreqSum = 0;

  for (var i = 0; i < ampSpectrum.length; i++) {
    ampSum += ampSpectrum[i];
    let curFreq = (i * sampleRate) / bufferSize;
    freqs[i] = curFreq;
    powFreqSum += curFreq * curFreq;
    freqSum += curFreq;
    ampFreqSum += curFreq * ampSpectrum[i];
  }

  return (
    (ampSpectrum.length * ampFreqSum - freqSum * ampSum) /
    (ampSum * (powFreqSum - Math.pow(freqSum, 2)))
  );
}
