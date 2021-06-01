declare module "fftjs" {
  interface ComplexSpectrum {
    real: number[];
    imag: number[];
  }
  function fft(signal: ArrayLike<number>): ComplexSpectrum;
  function ifft(complexSpectrum: ComplexSpectrum): InputSignal;
}

declare module "dct" {
  function dct(signal: number[], scale?: number): number[];
  export = dct;
}
