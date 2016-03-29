import * as assert from 'assert';

export default function() {
  if (typeof arguments[0].signal !== 'object') {
    throw new TypeError();
  }

  var energy = 0;
  for (var i = 0; i < arguments[0].signal.length; i++) {
    energy += Math.pow(Math.abs(arguments[0].signal[i]), 2);
  }

  return energy;
}
