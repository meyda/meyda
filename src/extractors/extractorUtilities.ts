export function mu(i: number, amplitudeSpect: Float32Array): number {
  let numerator = 0;
  let denominator = 0;
  for (let k = 0; k < amplitudeSpect.length; k++) {
    numerator += Math.pow(k, i) * Math.abs(amplitudeSpect[k]);
    denominator += amplitudeSpect[k];
  }

  return numerator / denominator;
}
