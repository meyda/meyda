import * as windowing from '../windowing';

let windows = {};

export function verifySymbol(argument) {
  if (typeof argument.signal !== 'object') {
    throw new TypeError();
  }
}

export function isPowerOfTwo(num) {
  while (((num % 2) === 0) && num > 1) {
    num /= 2;
  }

  return (num === 1);
}

export function error(message) {
  throw new Error('Meyda: ' + message);
}

export function pointwiseBufferMult(a, b) {
  let c = [];
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    c[i] = a[i] * b[i];
  }

  return c;
}

export function applyWindow(signal, windowName) {
  if (windowName !== 'rect') {
    return notRect(signal, windowName);
  }
  return signal;
}

function notRect(signal, windowName) {
  if (windowName === '' || !windowName) {
    windowName = 'hanning';
  }

  if (!windows[windowName]) {
    windows[windowName] = {};
  }

  normalizeWindows(signal, windowName);

  return pointwiseBufferMult(signal, windows[windowName][signal.length]);
}

function normalizeWindows(signal, windowName) {
  if (!windows[windowName][signal.length]) {
    try {
      windows[windowName][signal.length] = windowing[windowName](signal.length);
    } catch (e) {
      throw new Error('Invalid windowing function');
    }
  }
}

export function createBarkScale(length, sampleRate, bufferSize) {
  let barkScale = new Float32Array(length);

  for (var i = 0; i < barkScale.length; i++) {
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

export function _normalize(num, range) {
  return num / range;
}

export function normalize(a, range) {
  return a.map(function (n) {
    return _normalize(n, range);
  });
}

export function normalizeToOne(a) {
  var max = Math.max.apply(null, a);

  return a.map(function (n) {
    return n / max;
  });
}

export function mean(a) {
  return a.reduce(function (prev, cur) {
    return prev + cur;
  }) / a.length;
}

function _melToFreq(melValue) {
  var freqValue = 700 * (Math.exp(melValue / 1125) - 1);
  return freqValue;
}

function _freqToMel(freqValue) {
  var melValue = 1125 * Math.log(1 + (freqValue / 700));
  return melValue;
}

export function melToFreq(mV) {
  return _melToFreq(mV);
}

export function freqToMel(fV) {
  return _freqToMel(fV);
}


export function hzToOctaves(freq, A440) {
  return Math.log2(16 * freq / A440);
}

export function normalizeByColumn(a) {
  var emptyRow = a[0].map(() => 0);
  var colDenominators = a.reduce((acc, row) => {
    row.forEach((cell, j) => {
      acc[j] += Math.pow(cell, 2);
    });
    return acc;
  }, emptyRow).map(Math.sqrt);
  return a.map((row, i) => row.map((v, j) => v / (colDenominators[j] || 1)));
};

export function frame(buffer, frameLength, hopLength) {
  if (buffer.length < frameLength) {
    throw new Error('Buffer is too short for frame length');
  }
  if (hopLength < 1) {
    throw new Error('Hop length cannot be less that 1');
  }
  if (frameLength < 1) {
    throw new Error('Frame length cannot be less that 1');
  }

  const numFrames = 1 + Math.floor((buffer.length - frameLength) / hopLength);

  return new Array(numFrames).fill(0).map((_, i) =>
    buffer.slice(i * hopLength, (i * hopLength) + frameLength));
}
