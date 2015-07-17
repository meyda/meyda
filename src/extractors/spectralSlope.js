export default function() {
  if(typeof arguments[0].ampSpectrum !== "object"){
    throw new TypeError;
  }

  //linear regression
  let ampSum =0;
  let freqSum=0;
  let freqs = new Float32Array(arguments[0].ampSpectrum.length);
  let powFreqSum=0;
  let ampFreqSum=0;

  for (var i = 0; i < arguments[0].ampSpectrum.length; i++) {
    ampSum += arguments[0].ampSpectrum[i];
    let curFreq = i * arguments[0].sampleRate / bufferSize;
    freqs[i] = curFreq;
    powFreqSum += curFreq*curFreq;
    freqSum += curFreq;
    ampFreqSum += curFreq*arguments[0].ampSpectrum[i];
  }
  return (arguments[0].ampSpectrum.length*ampFreqSum - freqSum*ampSum)/(ampSum*(powFreqSum - Math.pow(freqSum,2)));
}
