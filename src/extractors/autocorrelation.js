export default function autocorrelation() {
  if (typeof arguments[0].signal !== 'object') {
    throw new TypeError();
  }

  const arr = arguments[0].signal;

  var ac = new Float32Array(arr.length);
  for (var lag = 0; lag < arr.length; lag++) {
    var value = 0;
    for (var index = 0; index < arr.length - lag; index++) {
      let a = arr[index];
      let otherindex = index - lag;
      let b = otherindex >= 0 ? arr[otherindex] : 0;
      value = value + a * b;
    }
    ac[lag] = value;
  }
  return ac;
}
