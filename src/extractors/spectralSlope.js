export default function(args) {
  if (typeof args.ampSpectrum !== 'object') {
    throw new TypeError();
  }

  //linear regression
  let ampSum = 0;
  let freqSum = 0;
  let freqs = new Float32Array(args.ampSpectrum.length);
  let powFreqSum = 0;
  let ampFreqSum = 0;

  for (var i = 0; i < args.ampSpectrum.length; i++) {
    ampSum += args.ampSpectrum[i];
    let curFreq = i * args.sampleRate / args.bufferSize;
    freqs[i] = curFreq;
    powFreqSum += curFreq * curFreq;
    freqSum += curFreq;
    ampFreqSum += curFreq * args.ampSpectrum[i];
  }

  return (args.ampSpectrum.length * ampFreqSum - freqSum * ampSum) / (ampSum * (
        powFreqSum - Math.pow(freqSum, 2)));
}
