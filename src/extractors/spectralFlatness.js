export default function(bufferSize, m){
  var ampspec = m.ampSpectrum;
  var numerator = 0;
  var denominator = 0;
  for(var i = 0; i < ampspec.length;i++){
    numerator += Math.log(ampspec[i]);
    denominator += ampspec[i];
  }
  return Math.exp(numerator/ampspec.length)*ampspec.length/denominator;
}
