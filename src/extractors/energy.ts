import { Signal } from "../main";

type EnergyParamters = {
  signal: Signal;
};

export default function (args: EnergyParamters) {
  if (typeof args.signal !== "object") {
    throw new TypeError();
  }

  var energy = 0;
  for (var i = 0; i < args.signal.length; i++) {
    energy += Math.pow(Math.abs(args.signal[i]), 2);
  }

  return energy;
}
