import loudness from './loudness';

export default function() {
  if (typeof arguments[0].signal !== 'object') {
    throw new TypeError();
  }

  var loudnessValue = loudness(arguments[0]);

  var max = 0;
  for (var i = 0; i < loudnessValue.specific.length; i++) {
    if (loudnessValue.specific[i] > max) {
      max = loudnessValue.specific[i];
    }
  }

  var spread = Math.pow((loudnessValue.total - max) / loudnessValue.total, 2);

  return spread;
}
