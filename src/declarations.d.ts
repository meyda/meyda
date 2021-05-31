declare module "fftjs" {
  interface ComplexSpectrum {
    real: number[];
    imag: number[];
  }
  type Signal = number[] | Float32Array;
  function fft(signal: Signal): ComplexSpectrum;
  function ifft(complexSpectrum: ComplexSpectrum): Signal;
}

declare module "dct" {
  function dct(signal: number[], scale?: number): number[];
  export = dct;
}
