import * as windowing from './windowing';

let windows = {};

export function isPowerOfTwo(num) {
  while (((num % 2) === 0) && num > 1) {
    num /= 2;
  }
  return (num === 1);
}

export function error(message){
  throw new Error("Meyda: "+message);
}

export function pointwiseBufferMult(a,b){
  let c = [];
  for(let i = 0; i < Math.min(a.length, b.length); i++){
    c[i] = a[i]*b[i];
  }
  return c;
}

export function applyWindow(signal, windowname){
  if(!windows[windowname]) windows[windowname] = {};
  if(!windows[windowname][signal.length]) windows[windowname][signal.length] = windowing.hanning(signal.length);

  return pointwiseBufferMult(signal,windows[windowname][signal.length]);
}

export function createBarkScale(length,sampleRate,bufferSize) {
  let barkScale = new Float32Array(length);

  for(var i = 0; i < barkScale.length; i++){
    barkScale[i] = i*sampleRate/(bufferSize);
    barkScale[i] = 13*Math.atan(barkScale[i]/1315.8) + 3.5* Math.atan(Math.pow((barkScale[i]/7518),2));
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

export function normalize(num, range) {
  return num/range
}

export function normalize_a(a, range) {
  return a.map(function(n) { return n/range })
}

export function normalize_a_to_1(a) {
  var max = 0
  a.forEach(function(v,i,_a) {
    if (v > max) max = v
  })
  return a.map(function(n) { return n/max })
}

export function mean(a) {
  return a.reduce(function(prev,cur) {  return prev + cur;  }) / a.length;
}