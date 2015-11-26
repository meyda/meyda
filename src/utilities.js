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
  return num/range;
}

export function normalize_a(a, range) {
  return a.map(function(n) { return n/range; });
}

export function normalize_a_to_1(a) {
  var max = 0;
  a.forEach(function(v,i,_a) {
    if (v > max) max = v;
  });
  return a.map(function(n) {
    return n/max;
  });
}

export function mean(a) {
  return a.reduce(function(prev,cur) {  return prev + cur;  }) / a.length;
}

function _melToFreq(melValue){
  var freqValue = 700*(Math.exp(melValue/1125)-1);
  return freqValue;
}

function _freqToMel(freqValue){
  var melValue = 1125*Math.log(1+(freqValue/700));
  return melValue;
}

export function melToFreq(mV) { return _melToFreq(mV); }
export function freqToMel(fV) { return _freqToMel(fV); }

export function createMelFilterBank(numFilters, sampleRate, bufferSize) {
  let melValues = new Float32Array(numFilters+2); //the +2 is the upper and lower limits
  let melValuesInFreq = new Float32Array(numFilters+2);
  //Generate limits in Hz - from 0 to the nyquist.
  let lowerLimitFreq = 0;
  let upperLimitFreq = sampleRate/2;
  //Convert the limits to Mel
  let lowerLimitMel = _freqToMel(lowerLimitFreq);
  let upperLimitMel = _freqToMel(upperLimitFreq);
  //Find the range
  let range = upperLimitMel-lowerLimitMel;
  //Find the range as part of the linear interpolation
  let valueToAdd = range/(numFilters+1);

  let fftBinsOfFreq = Array(numFilters+2);

  for (let i = 0; i < melValues.length; i++) {
    //Initialising the mel frequencies - they are just a linear interpolation between the lower and upper limits.
    melValues[i] = i*valueToAdd;
    //Convert back to Hz
    melValuesInFreq[i] = _melToFreq(melValues[i]);
    //Find the corresponding bins
    fftBinsOfFreq[i] = Math.floor((bufferSize+1)*melValuesInFreq[i]/sampleRate);
  }

  var filterBank = Array(numFilters);
  for (let j = 0; j < filterBank.length; j++) {
    //creating a two dimensional array of size numFilters * (buffersize/2)+1 and pre-populating the arrays with 0s.
    filterBank[j] = Array.apply(null, new Array((bufferSize/2)+1)).map(Number.prototype.valueOf,0);
    //creating the lower and upper slopes for each bin
    for (let i = fftBinsOfFreq[j]; i < fftBinsOfFreq[j+1]; i++) {
      filterBank[j][i] = (i - fftBinsOfFreq[j])/(fftBinsOfFreq[j+1]-fftBinsOfFreq[j]);
    }
    for (let i = fftBinsOfFreq[j+1]; i < fftBinsOfFreq[j+2]; i++) {
      filterBank[j][i] = (fftBinsOfFreq[j+2]-i)/(fftBinsOfFreq[j+2]-fftBinsOfFreq[j+1]);
    }
  }

  return filterBank;
}
