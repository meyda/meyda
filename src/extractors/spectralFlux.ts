import { normalizeToOne } from "../utilities";

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

  if (
    typeof complexSpectrum.real !== "object" ||
    typeof complexSpectrum.imag != "object"
  ) {
    throw new TypeError();
  }
  const normalizedRealComponent = normalizeToOne(complexSpectrum.real);
  const previousNormalizedRealComponent = normalizeToOne(
    previousComplexSpectrum.real
  );

  let sf = 0;
  for (let i = 0; i < normalizedRealComponent.length; i++) {
    let x =
      Math.abs(normalizedRealComponent[i]) -
      Math.abs(previousNormalizedRealComponent[i]);
    sf += Math.pow(x, 2);
  }

  return Math.sqrt(sf);
}
