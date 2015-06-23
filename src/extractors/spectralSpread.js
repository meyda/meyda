import mu from 'extractorUtilities';

export default function(bufferSize, m){
  var ampspec = m.ampSpectrum;
  return Math.sqrt(mu(2,ampspec)-Math.pow(mu(1,ampspec),2));
}
