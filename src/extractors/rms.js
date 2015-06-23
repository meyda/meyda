export default function(bufferSize, m){

  var rms = 0;
  for(var i = 0 ; i < m.signal.length ; i++){
    rms += Math.pow(m.signal[i],2);
  }
  rms = rms / m.signal.length;
  rms = Math.sqrt(rms);

  return rms;
}
