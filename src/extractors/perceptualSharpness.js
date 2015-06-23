export default function(bufferSize,m) {
  var loudness = m.featureExtractors["loudness"](bufferSize, m);
  var spec = loudness.specific;
  var output = 0;

  for (var i = 0; i < spec.length; i++) {
    if (i < 15) {
      output += (i+1) * spec[i+1];
    }
    else {
      output += 0.066 * Math.exp(0.171 * (i+1));
    }
  };
  output *= 0.11/loudness.total;

  return output;
}
