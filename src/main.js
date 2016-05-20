import * as utilities from './utilities';
import * as extractors from './featureExtractors';
// jsfft is required by complex_array, but doesn't export anything
require('jsfft');
import * as complexArray from 'jsfft/lib/complex_array';
import { MeydaAnalyzer } from './meyda-wa';

const prepareSignalWithSpectrum = (signal, windowingFunction, bufferSize) => {
  const preparedSignal = {};

  if (typeof signal.buffer === 'undefined') {
    // signal is a normal array, convert to F32A
    preparedSignal.signal = utilities.arrayToTyped(signal);
  } else {
    preparedSignal.signal = signal;
  }

  preparedSignal.windowedSignal = utilities.applyWindow(
    preparedSignal.signal,
    windowingFunction);

  // create complexarray to hold the spectrum
  const data = new complexArray.ComplexArray(bufferSize);

  // map time domain
  data.map((value, i) => {
    const v = value;
    v.real = preparedSignal.windowedSignal[i];
    return v;
  });

  // Functions shouldn't start with upper case chars, options.trips our linter
  data.fft = data.FFT;
  preparedSignal.complexSpectrum = data.fft();
  preparedSignal.ampSpectrum = new Float32Array(bufferSize / 2);
  for (let i = 0; i < bufferSize / 2; i++) {
    preparedSignal.ampSpectrum[i] = Math.sqrt(
      Math.pow(preparedSignal.complexSpectrum.real[i], 2) +
      Math.pow(preparedSignal.complexSpectrum.imag[i], 2));
  }

  return preparedSignal;
};

const defaults = {
  bufferSize: 512,
  sampleRate: 44100,
  melBands: 26,
  windowingFunction: 'hanning',
  featureExtractors: extractors,
};

export function createMeydaAnalyzer(options) {
  return new MeydaAnalyzer(options);
}

// TODO: now that we're not an object, we should let users pass configs
// which we merge with defaults
export function extract(feature, signal, previousSignal, config) {
  const options = defaults.merge(config);
  if (!signal) {
    throw options.errors.invalidInput;
  } else if (typeof signal !== 'object') {
    throw options.errors.invalidInput;
  } else if (!feature) {
    throw options.errors.featureUndef;
  } else if (!utilities.isPowerOfTwo(signal.length)) {
    throw options.errors.notPow2;
  }

  if (typeof options.barkScale === 'undefined' ||
      options.barkScale.length !== options.bufferSize) {
    options.barkScale = utilities.createBarkScale(
      options.bufferSize,
      options.sampleRate,
      options.bufferSize
    );
  }

  // Recalcuate mel bank if buffer length changed
  if (typeof options.melFilterBank === 'undefined' ||
      options.barkScale.length !== options.bufferSize ||
      options.melFilterBank.length !== options.melBands) {
    options.melFilterBank = utilities.createMelFilterBank(
      options.melBands,
      options.sampleRate,
      options.bufferSize);
  }

  if (typeof signal.buffer === 'undefined') {
    // signal is a normal array, convert to F32A
    options.signal = utilities.arrayToTyped(signal);
  } else {
    options.signal = signal;
  }

  let preparedSignal = prepareSignalWithSpectrum(
        signal,
        options.windowingFunction,
        options.bufferSize);

  options.signal = preparedSignal.windowedSignal;
  options.complexSpectrum = preparedSignal.complexSpectrum;
  options.ampSpectrum = preparedSignal.ampSpectrum;

  if (previousSignal) {
    preparedSignal = prepareSignalWithSpectrum(previousSignal,
          options.windowingFunction,
          options.bufferSize);

    options.previousSignal = preparedSignal.windowedSignal;
    options.previousComplexSpectrum = preparedSignal.complexSpectrum;
    options.previousAmpSpectrum = preparedSignal.ampSpectrum;
  }

  if (typeof feature === 'object') {
    const results = {};
    for (let x = 0; x < feature.length; x++) {
      results[feature[x]] = (options.featureExtractors[feature[x]]({
        ampSpectrum: options.ampSpectrum,
        complexSpectrum: options.complexSpectrum,
        signal: options.signal,
        bufferSize: options.bufferSize,
        sampleRate: options.sampleRate,
        barkScale: options.barkScale,
        melFilterBank: options.melFilterBank,
        previousSignal: options.previousSignal,
        previousAmpSpectrum: options.previousAmpSpectrum,
        previousComplexSpectrum: options.previousComplexSpectrum,
      }));
    }
    return results;
  } else if (typeof feature === 'string') {
    return options.featureExtractors[feature]({
      ampSpectrum: options.ampSpectrum,
      complexSpectrum: options.complexSpectrum,
      signal: options.signal,
      bufferSize: options.bufferSize,
      sampleRate: options.sampleRate,
      barkScale: options.barkScale,
      melFilterBank: options.melFilterBank,
      previousSignal: options.previousSignal,
      previousAmpSpectrum: options.previousAmpSpectrum,
      previousComplexSpectrum: options.previousComplexSpectrum,
    });
  }
  throw options.errors.invalidFeatureFmt;
}

