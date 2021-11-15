import { magnitudeForComplexSpectrum, normalizeToOne } from "../utilities";

export default function ({
  complexSpectrum,
  previousComplexSpectrum,
}: {
  complexSpectrum: { real: number[]; imag: number[] };
  previousComplexSpectrum: { real: number[]; imag: number[] };
}): number {
  if (!previousComplexSpectrum) {
    return 0;
  }

  const magnitudeSpectrum = magnitudeForComplexSpectrum(complexSpectrum);
  const previousMagnitudeSpectrum = magnitudeForComplexSpectrum(
    previousComplexSpectrum
  );

  const normalizedMagnitudeSpectrum = normalizeToOne(magnitudeSpectrum);
  const previousNormalizedMagnitudeSpectrum = normalizeToOne(
    previousMagnitudeSpectrum
  );

  let sf = 0;
  for (let i = 0; i < normalizedMagnitudeSpectrum.length; i++) {
    let x =
      Math.abs(normalizedMagnitudeSpectrum[i]) -
      Math.abs(previousNormalizedMagnitudeSpectrum[i]);
    sf += Math.pow(Math.max(x, 0), 2);
  }

  return Math.sqrt(sf);
}
