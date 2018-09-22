export default function() {
  if (typeof arguments[0].signal !== 'object') {
    throw new TypeError();
  }

  var zcr = 0;
  for (var i = 1; i < arguments[0].signal.length; i++) {
    if ((arguments[0].signal[i-1] >= 0 && arguments[0].signal[i] < 0) ||
         (arguments[0].signal[i-1] < 0 && arguments[0].signal[i] >= 0)) {
      zcr++;
    }
  }

  return zcr;
}
