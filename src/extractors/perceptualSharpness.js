import loudness from './loudness';

export default function (...args) {
  if (typeof args[0].signal !== 'object') {
    throw new TypeError();
  }

  const loudnessValue = loudness(args[0]);
  const spec = loudnessValue.specific;
  let output = 0;

  for (let i = 0; i < spec.length; i++) {
    if (i < 15) {
      output += (i + 1) * spec[i + 1];
    } else {
      output += 0.066 * Math.exp(0.171 * (i + 1));
    }
  }

  output *= 0.11 / loudnessValue.total;

  return output;
}
