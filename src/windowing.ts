export function blackman(size: number): Float32Array {
  const blackmanBuffer = new Float32Array(size);
  const coeff1 = (2 * Math.PI) / (size - 1);
  const coeff2 = 2 * coeff1;

  //According to http://uk.mathworks.com/help/signal/ref/blackman.html
  //first half of the window
  for (let i = 0; i < size / 2; i++) {
    blackmanBuffer[i] =
      0.42 - 0.5 * Math.cos(i * coeff1) + 0.08 * Math.cos(i * coeff2);
  }

  //second half of the window
  for (let i = Math.ceil(size / 2); i > 0; i--) {
    blackmanBuffer[size - i] = blackmanBuffer[i - 1];
  }

  return blackmanBuffer;
}

export function sine(size: number): Float32Array {
  const coeff = Math.PI / (size - 1);
  const sineBuffer = new Float32Array(size);

  for (let i = 0; i < size; i++) {
    sineBuffer[i] = Math.sin(coeff * i);
  }

  return sineBuffer;
}

export function hanning(size: number): Float32Array {
  const hanningBuffer = new Float32Array(size);
  for (let i = 0; i < size; i++) {
    // According to the R documentation
    // http://ugrad.stat.ubc.ca/R/library/e1071/html/hanning.window.html
    hanningBuffer[i] = 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / (size - 1));
  }

  return hanningBuffer;
}

export function hamming(size: number): Float32Array {
  const hammingBuffer = new Float32Array(size);
  for (let i = 0; i < size; i++) {
    //According to http://uk.mathworks.com/help/signal/ref/hamming.html
    hammingBuffer[i] = 0.54 - 0.46 * Math.cos(2 * Math.PI * (i / size - 1));
  }

  return hammingBuffer;
}
