export default function (...args) {
  if (typeof args[0].signal !== 'object' ||
  typeof args[0].previousSignal !== 'object'
		) {
    throw new TypeError();
  }

  let sf = 0;
  for (let i = -(args[0].bufferSize / 2);
       i < args[0].signal.length / 2 - 1;
       i++) {
    const x = Math.abs(args[0].signal[i]) - Math.abs(args[0].previousSignal[i]);
    sf += (x + Math.abs(x)) / 2;
  }

  return sf;
}
