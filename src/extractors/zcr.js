export default function (...args) {
  if (typeof args[0].signal !== 'object') {
    throw new TypeError();
  }

  let zcr = 0;
  for (let i = 0; i < args[0].signal.length; i++) {
    if ((args[0].signal[i] >= 0 && args[0].signal[i + 1] < 0) ||
         (args[0].signal[i] < 0 && args[0].signal[i + 1] >= 0)) {
      zcr++;
    }
  }

  return zcr;
}
