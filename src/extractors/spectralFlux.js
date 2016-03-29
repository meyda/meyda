export default function(args) {
  if (typeof args.signal !== 'object' ||
  typeof args.previousSignal != 'object'
		) {
    throw new TypeError();
  }

  let sf = 0;
  for (let i = -(args.bufferSize / 2); i < signal.length / 2 - 1; i++) {
    x = Math.abs(args.signal[i]) - Math.abs(args.previousSignal[i]);
    sf += (x + Math.abs(x)) / 2;
  }

  return sf;
}
