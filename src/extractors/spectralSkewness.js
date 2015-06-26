import mu from './extractorUtilities';

export default function(bufferSize, m, spectrum){
  var ampspec = m.ampSpectrum;
  var mu1 = mu(1,ampspec);
  var mu2 = mu(2,ampspec);
  var mu3 = mu(3,ampspec);
  var numerator = 2*Math.pow(mu1,3)-3*mu1*mu2+mu3;
  var denominator = Math.pow(Math.sqrt(mu2-Math.pow(mu1,2)),3);
  return numerator/denominator;
}
