import loudness from './loudness';

export default function (...args) {
  if (typeof args[0].signal !== 'object') {
    throw new TypeError();
  }

  const loudnessValue = loudness(args[0]);

  let max = 0;
  for (let i = 0; i < loudnessValue.specific.length; i++) {
    if (loudnessValue.specific[i] > max) {
      max = loudnessValue.specific[i];
    }
  }

  return Math.pow((loudnessValue.total - max) / loudnessValue.total, 2);
}
