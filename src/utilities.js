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
