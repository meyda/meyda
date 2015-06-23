export default function(bufferSize, m){
  var barkScale = new Float32Array(m.ampSpectrum.length);
  var NUM_BARK_BANDS = 24;
  var specific = new Float32Array(NUM_BARK_BANDS);
  var tot = 0;
  var normalisedSpectrum = m.ampSpectrum;
  var bbLimits = new Int32Array(NUM_BARK_BANDS+1);

  for(var i = 0; i < barkScale.length; i++){
    barkScale[i] = i*m.audioContext.sampleRate/(bufferSize);
    barkScale[i] = 13*Math.atan(barkScale[i]/1315.8) + 3.5* Math.atan(Math.pow((barkScale[i]/7518),2));
  }


  bbLimits[0] = 0;
  var currentBandEnd = barkScale[m.ampSpectrum.length-1]/NUM_BARK_BANDS;
  var currentBand = 1;
  for(var i = 0; i<m.ampSpectrum.length; i++){
    while(barkScale[i] > currentBandEnd) {
      bbLimits[currentBand++] = i;
      currentBandEnd = currentBand*barkScale[m.ampSpectrum.length-1]/NUM_BARK_BANDS;
    }
  }

  bbLimits[NUM_BARK_BANDS] = m.ampSpectrum.length-1;

  //process

  for (var i = 0; i < NUM_BARK_BANDS; i++){
    var sum = 0;
    for (var j = bbLimits[i] ; j < bbLimits[i+1] ; j++) {

      sum += normalisedSpectrum[j];
    }
    specific[i] = Math.pow(sum,0.23);
  }

  //get total loudness
  for (var i = 0; i < specific.length; i++){
    tot += specific[i];
  }
  return {
    "specific": specific,
    "total": tot
  };
}
