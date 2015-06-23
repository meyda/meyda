export default function(bufferSize, m) {
  //linear regression
  let ampSum =0;
  let freqSum=0;
  let freqs = new Float32Array(m.ampSpectrum.length);
  let powFreqSum=0;
  let ampFreqSum=0;

  for (var i = 0; i < m.ampSpectrum.length; i++) {
    ampSum += m.ampSpectrum[i];
    let curFreq = i * m.audioContext.sampleRate / bufferSize;
    freqs[i] = curFreq;
    powFreqSum += curFreq*curFreq;
    freqSum += curFreq;
    ampFreqSum += curFreq*m.ampSpectrum[i];
  }
  return (m.ampSpectrum.length*ampFreqSum - freqSum*ampSum)/(ampSum*(powFreqSum - Math.pow(freqSum,2)));
}
