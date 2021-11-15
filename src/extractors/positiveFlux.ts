import { normalizeToOne } from "../utilities";

export default function ({
  ampSpectrum,
  previousAmpSpectrum,
}: {
  ampSpectrum: Float32Array;
  previousAmpSpectrum: Float32Array;
}): number {
  if (!previousAmpSpectrum) {
    return 0;
  }

  const normalizedMagnitudeSpectrum = normalizeToOne(ampSpectrum);
  const previousNormalizedMagnitudeSpectrum =
    normalizeToOne(previousAmpSpectrum);

  let sf = 0;
  for (let i = 0; i < normalizedMagnitudeSpectrum.length; i++) {
    let x =
      Math.abs(normalizedMagnitudeSpectrum[i]) -
      Math.abs(previousNormalizedMagnitudeSpectrum[i]);
    sf += Math.pow(Math.max(x, 0), 2);
  }

  return Math.sqrt(sf);
}
