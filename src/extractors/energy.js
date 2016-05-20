export default function (...args) {
  if (typeof args[0].signal !== 'object') {
    throw new TypeError();
  }

  let energy = 0;
  for (let i = 0; i < args[0].signal.length; i++) {
    energy += Math.pow(Math.abs(args[0].signal[i]), 2);
  }

  return energy;
}
