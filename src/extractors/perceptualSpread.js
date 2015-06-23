export default function(bufferSize, m) {
  var loudness = m.featureExtractors["loudness"](bufferSize, m);

  var max = 0;
  for (var i=0; i<loudness.specific.length; i++) {
    if (loudness.specific[i] > max) {
      max = loudness.specific[i];
    }
  }

  var spread = Math.pow((loudness.total - max)/loudness.total, 2);

  return spread;
}
