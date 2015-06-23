export default function(bufferSize, m){
  var powerSpectrum = new Float32Array(m.ampSpectrum.length);
  for (var i = 0; i < powerSpectrum.length; i++) {
    powerSpectrum[i] =  Math.pow(m.ampSpectrum[i],2);
  }
  return powerSpectrum;
}
