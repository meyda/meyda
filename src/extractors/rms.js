export default function (args) {
  if (typeof args.signal !== 'object') {
    throw new TypeError();
  }

  let rms = 0;
  for (let i = 0; i < args.signal.length; i++) {
    rms += Math.pow(args.signal[i], 2);
  }

  rms = rms / args.signal.length;
  rms = Math.sqrt(rms);

  return rms;
}
