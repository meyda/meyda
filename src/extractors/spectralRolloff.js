export default function(bufferSize, m){
  var ampspec = m.ampSpectrum;
  //calculate nyquist bin
  var nyqBin = m.audioContext.sampleRate/(2*(ampspec.length-1));
  var ec = 0;
  for(var i = 0; i < ampspec.length; i++){
    ec += ampspec[i];
  }
  var threshold = 0.99 * ec;
  var n = ampspec.length - 1;
  while(ec > threshold && n >= 0){
    ec -= ampspec[n];
          --n;
  }
  return (n+1) * nyqBin;
}
