export default function ({
  complexSpectrum,
  previousComplexSpectrum
}: {
  complexSpectrum: {real: number[]; imag: number[]};
  previousComplexSpectrum: {real: number[]; imag: number[]};
}): number {
  if (typeof complexSpectrum.real !== "object" || typeof complexSpectrum.imag != "object") {
    throw new TypeError();
  }

  let sf = 0;
  for (let i = 0; i < complexSpectrum.real.length; i++) {
    let x =
      Math.abs(complexSpectrum.real[i]) -
      Math.abs(previousComplexSpectrum.real[i]);
    sf += Math.pow(x, 2);
  }

  return Math.sqrt(sf);
}
