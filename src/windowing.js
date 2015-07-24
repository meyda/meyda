let generateBlackman = function(size){
  let blackman = new Float32Array(size);
  //According to http://uk.mathworks.com/help/signal/ref/blackman.html
  //first half of the window
  for (let i = 0; i < (size % 2) ? (size+1)/2 : size/2; i++) {
    blackman[i] = 0.42 - 0.5*Math.cos(2*Math.PI*i/(size-1)) + 0.08*Math.cos(4*Math.PI*i/(size-1));
  }
  //second half of the window
  for (let i = size/2; i > 0; i--) {
    blackman[size - i] = blackman[i];
  }
};

// @TODO: finish and export Blackman

export function hanning(size){
  let hanningBuffer = new Float32Array(size);
  for (let i = 0; i < size; i++) {
    //According to the R documentation http://rgm.ogalab.net/RGM/R_rdfile?f=GENEAread/man/hanning.window.Rd&d=R_CC
    hanningBuffer[i] = 0.5 - 0.5*Math.cos(2*Math.PI*i/(size-1));
  }
  return hanningBuffer;
}

export function hamming (size){
  let hammingBuffer = new Float32Array(size);
  for (let i = 0; i < size; i++) {
    //According to http://uk.mathworks.com/help/signal/ref/hamming.html
    hammingBuffer[i] = 0.54 - 0.46*Math.cos(2*Math.PI*(i/size-1));
  }
  return hammingBuffer;
}
