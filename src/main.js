import * as utilities from './utilities';
import * as extractors from './featureExtractors';
import {fft, ifft} from 'fftjs';
import {MeydaAnalyzer} from './meyda-wa';

var Meyda = {
  audioContext: null,
  spn: null,
  bufferSize: 512,
  sampleRate: 44100,
  melBands: 26,
  chromaBands: 12,
  callback: null,
  windowingFunction: 'hanning',
  featureExtractors: extractors,
  EXTRACTION_STARTED: false,
  _featuresToExtract: [],
  windowing: utilities.applyWindow,
  _errors: {
    notPow2: new Error(
        'Meyda: Buffer size must be a power of 2, e.g. 64 or 512'),
    featureUndef: new Error('Meyda: No features defined.'),
    invalidFeatureFmt: new Error('Meyda: Invalid feature format'),
    invalidInput: new Error('Meyda: Invalid input.'),
    noAC: new Error('Meyda: No AudioContext specified.'),
    noSource: new Error('Meyda: No source node specified.'),
  },

  createMeydaAnalyzer: function (options) {
    return new MeydaAnalyzer(options, Meyda);
  },

  extract: function (feature, signal, previousSignal) {
    if (!signal)
        throw this._errors.invalidInput;
    else if (typeof signal != 'object')
        throw this._errors.invalidInput;
    else if (!feature)
        throw this._errors.featureUndef;
    else if (!utilities.isPowerOfTwo(signal.length))
        throw this._errors.notPow2;

    if (typeof this.barkScale == 'undefined' ||
            this.barkScale.length != this.bufferSize) {
      this.barkScale = utilities.createBarkScale(
          this.bufferSize,
          this.sampleRate,
          this.bufferSize
      );
    }

    // Recalculate mel bank if buffer length changed
    if (typeof this.melFilterBank == 'undefined' ||
            this.barkScale.length != this.bufferSize ||
            this.melFilterBank.length != this.melBands) {
      this.melFilterBank = utilities.createMelFilterBank(
          this.melBands,
          this.sampleRate,
          this.bufferSize);
    }

    // Recalculate chroma bank if buffer length changed
    if (typeof this.chromaFilterBank == 'undefined' ||
            this.chromaFilterBank.length != this.chromaBands) {
      this.chromaFilterBank = utilities.createChromaFilterBank(
          this.chromaBands,
          this.sampleRate,
          this.bufferSize);
    }

    if (typeof signal.buffer == 'undefined') {
      //signal is a normal array, convert to F32A
      this.signal = utilities.arrayToTyped(signal);
    } else {
      this.signal = signal;
    }

    let preparedSignal = prepareSignalWithSpectrum(
            signal,
            this.windowingFunction,
            this.bufferSize);

    this.signal = preparedSignal.windowedSignal;
    this.complexSpectrum = preparedSignal.complexSpectrum;
    this.ampSpectrum = preparedSignal.ampSpectrum;

    if (previousSignal) {
      let preparedSignal = prepareSignalWithSpectrum(previousSignal,
              this.windowingFunction,
              this.bufferSize);

      this.previousSignal = preparedSignal.windowedSignal;
      this.previousComplexSpectrum = preparedSignal.complexSpectrum;
      this.previousAmpSpectrum = preparedSignal.ampSpectrum;
    }

    if (typeof feature === 'object') {
      var results = {};
      for (var x = 0; x < feature.length; x++) {
        results[feature[x]] = (this.featureExtractors[feature[x]]({
          ampSpectrum:this.ampSpectrum,
          chromaFilterBank: this.chromaFilterBank,
          complexSpectrum:this.complexSpectrum,
          signal:this.signal,
          bufferSize:this.bufferSize,
          sampleRate:this.sampleRate,
          barkScale:this.barkScale,
          melFilterBank:this.melFilterBank,
          previousSignal:this.previousSignal,
          previousAmpSpectrum:this.previousAmpSpectrum,
          previousComplexSpectrum:this.previousComplexSpectrum,
        }));
      }

      return results;
    } else if (typeof feature === 'string') {
      return this.featureExtractors[feature]({
        ampSpectrum:this.ampSpectrum,
        chromaFilterBank: this.chromaFilterBank,
        complexSpectrum:this.complexSpectrum,
        signal:this.signal,
        bufferSize:this.bufferSize,
        sampleRate:this.sampleRate,
        barkScale:this.barkScale,
        melFilterBank:this.melFilterBank,
        previousSignal:this.previousSignal,
        previousAmpSpectrum:this.previousAmpSpectrum,
        previousComplexSpectrum:this.previousComplexSpectrum,
      });
    }    else {
      throw this._errors.invalidFeatureFmt;
    }
  },
};

var prepareSignalWithSpectrum = function (signal,
  windowingFunction,
  bufferSize) {
  var preparedSignal = {};

  if (typeof signal.buffer == 'undefined') {
    //signal is a normal array, convert to F32A
    preparedSignal.signal = utilities.arrayToTyped(signal);
  }  else {
    preparedSignal.signal = signal;
  }

  preparedSignal.windowedSignal = utilities.applyWindow(
    preparedSignal.signal,
    windowingFunction);

  preparedSignal.complexSpectrum = fft(preparedSignal.windowedSignal);
  preparedSignal.ampSpectrum = new Float32Array(bufferSize / 2);
  for (var i = 0; i < bufferSize / 2; i++) {
    preparedSignal.ampSpectrum[i] = Math.sqrt(
      Math.pow(preparedSignal.complexSpectrum.real[i], 2) +
      Math.pow(preparedSignal.complexSpectrum.imag[i], 2));
  }

  return preparedSignal;
};

export default Meyda;

if (typeof window !== 'undefined') window.Meyda = Meyda;
