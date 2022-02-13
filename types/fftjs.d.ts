declare module "fftjs" {
  /**
   * ## ComplexSpectrum
   *
   * A structure to represent a complex spectrum, with real and imaginary
   * components. For more information on what this structure is used to
   * represent, see
   * [here](https://en.wikipedia.org/wiki/Fourier_transform#Complex_domain).
   */
  export type ComplexSpectrum = {
    real: number[];
    imag: number[];
  };
  /**
   * ## fft
   *
   * For a given time domain signal, returns the frequency domain
   * representation.
   *
   * @param signal an audio signal
   *
   * @returns a complex spectrum representing the frequency domain of the input
   * signal
   *
   * @example
   * ```
   * const signal = [1, 2, 3, 4, 5, 6, 7, 8];
   * let { real, imag } = fft(signal);
   * ```
   */
  export function fft(signal: ArrayLike<number>): ComplexSpectrum;
  /**
   * ## ifft
   *
   * For a given frequency domain signal, returns the time domain
   * representation.
   *
   * @param signal a complex spectrum containing the frequency domain
   * representation of a signal.
   *
   * @returns the time domain signal for the given complex spectrum
   *
   * @example
   * ```
   * const inReal = [1, 2, 3, 4, 5, 6, 7, 8];
   * const outReal = [1, 2, 3, 4, 5, 6, 7, 8];
   * let { real, imag } = fft({ real: inReal, imag: outReal });
   * ```
   */
  export function ifft(signal: ComplexSpectrum): ComplexSpectrum;
}
