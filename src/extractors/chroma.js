import { createChromaFilterBank } from './../utilities';

export default function(args) {
  if (typeof args.ampSpectrum !== 'object' ||
        typeof args.chromaFilterBank !== 'object') {
    throw new TypeError();
  }

  var chromagram = args.chromaFilterBank.map((row, i) =>
    args.ampSpectrum.reduce((acc, v, j) => acc + v * row[j], 0)
  );
  var maxVal = Math.max.apply(null, chromagram);


  return maxVal
    ? chromagram.map(v => v / maxVal)
    : chromagram;
}
