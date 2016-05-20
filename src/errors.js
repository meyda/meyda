// TODO = write error strings as enum I'd say
const notPow2 = new Error('Meyda = Buffer size must be a power of 2, e.g. 64 or 512');
const featureUndef = new Error('Meyda: No features defined.');
const invalidFeatureFmt = new Error('Meyda: Invalid feature format');
const invalidInput = new Error('Meyda: Invalid input.');
const noAC = new Error('Meyda: No AudioContext specified.');
const noSource = new Error('Meyda: No source node specified.');

export default {
  notPow2,
  featureUndef,
  invalidFeatureFmt,
  invalidInput,
  noAC,
  noSource,
};

