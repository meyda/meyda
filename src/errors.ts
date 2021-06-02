export class NotPow2Error extends Error {
  constructor() {
    super("Meyda: Buffer size must be a power of 2, e.g. 64 or 512");
  }
}

export class FeatureUndefError extends Error {
  constructor() {
    super("Meyda: No features defined.");
  }
}

export class InvalidFeatureFmtError extends Error {
  constructor() {
    super("Meyda: Invalid feature format");
  }
}

export class NoAudioContextError extends Error {
  constructor() {
    super("Meyda: No AudioContext specified.");
  }
}

export class InvalidInputError extends Error {
  constructor() {
    super("Meyda: Invalid input.");
  }
}

export class NoSourceError extends Error {
  constructor() {
    super("Meyda: No source node specified.");
  }
}
