import * as windowing from './windowing';

const windows = {};

export function isPowerOfTwo(_num) {
  let num = _num;
  while (((num % 2) === 0) && num > 1) {
    num /= 2;
  }

  return (num === 1);
}

export function error(message) {
  throw new Error(`Meyda:  ${message}`);
}

export function pointwiseBufferMult(a, b) {
  const c = [];
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    c[i] = a[i] * b[i];
  }

  return c;
}

export function applyWindow(_signal, _windowname) {
  let windowname = _windowname;
  let signal = _signal;
  if (windowname !== 'rect') {
    if (windowname === '' || !windowname) windowname = 'hanning';
    if (!windows[windowname]) windows[windowname] = {};

    if (!windows[windowname][signal.length]) {
      try {
        windows[windowname][signal.length] = windowing[windowname](
                    signal.length
                );
      } catch (e) {
        throw new Error('Invalid windowing function');
      }
    }

    signal = pointwiseBufferMult(signal, windows[windowname][signal.length]);
  }

  return signal;
}

export function createBarkScale(length, sampleRate, bufferSize) {
  const barkScale = new Float32Array(length);

  for (let i = 0; i < barkScale.length; i++) {
    barkScale[i] = i * sampleRate / (bufferSize);
    barkScale[i] = 13 * Math.atan(barkScale[i] / 1315.8) +
            3.5 * Math.atan(Math.pow((barkScale[i] / 7518), 2));
  }

  return barkScale;
}

export function typedToArray(t) {
  // utility to convert typed arrays to normal arrays
  return Array.prototype.slice.call(t);
}

export function arrayToTyped(t) {
  // utility to convert arrays to typed F32 arrays
  return Float32Array.from(t);
}

export function normalize(a, range) {
  return a.map(n => n / range);
}

export function normalizeToOne(a) {
  const max = Math.max.apply(null, a);

  return normalize(a, max);
}

export function mean(a) {
  return a.reduce((prev, cur) => prev + cur) / a.length;
}

export function melToFreq(melValue) {
  return 700 * (Math.exp(melValue / 1125) - 1);
}

export function freqToMel(freqValue) {
  return 1125 * Math.log(1 + (freqValue / 700));
}

export function createMelFilterBank(numFilters, sampleRate, bufferSize) {
  // the +2 is the upper and lower limits
  const melValues = new Float32Array(numFilters + 2);
  const melValuesInFreq = new Float32Array(numFilters + 2);

  // Generate limits in Hz - from 0 to the nyquist.
  const lowerLimitFreq = 0;
  const upperLimitFreq = sampleRate / 2;

  // Convert the limits to Mel
  const lowerLimitMel = freqToMel(lowerLimitFreq);
  const upperLimitMel = freqToMel(upperLimitFreq);

  // Find the range
  const range = upperLimitMel - lowerLimitMel;

  // Find the range as part of the linear interpolation
  const valueToAdd = range / (numFilters + 1);

  const fftBinsOfFreq = Array(numFilters + 2);

  for (let i = 0; i < melValues.length; i++) {
    // Initialising the mel frequencies
    // They're a linear interpolation between the lower and upper limits.
    melValues[i] = i * valueToAdd;

    // Convert back to Hz
    melValuesInFreq[i] = melToFreq(melValues[i]);

    // Find the corresponding bins
    fftBinsOfFreq[i] = Math.floor((bufferSize + 1) *
                           melValuesInFreq[i] / sampleRate);
  }

  const filterBank = Array(numFilters);
  for (let j = 0; j < filterBank.length; j++) {
    // Create a two dimensional array of size numFilters * (buffersize/2)+1
    // pre-populating the arrays with 0s.
    filterBank[j] = Array.apply(
            null,
						new Array((bufferSize / 2) + 1)).map(Number.prototype.valueOf, 0);

    // creating the lower and upper slopes for each bin
    for (let i = fftBinsOfFreq[j]; i < fftBinsOfFreq[j + 1]; i++) {
      filterBank[j][i] = (i - fftBinsOfFreq[j]) /
                (fftBinsOfFreq[j + 1] - fftBinsOfFreq[j]);
    }

    for (let i = fftBinsOfFreq[j + 1]; i < fftBinsOfFreq[j + 2]; i++) {
      filterBank[j][i] = (fftBinsOfFreq[j + 2] - i) /
                (fftBinsOfFreq[j + 2] - fftBinsOfFreq[j + 1]);
    }
  }

  return filterBank;
}
