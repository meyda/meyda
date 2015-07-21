"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _loudness = require('./loudness');

var _loudness2 = _interopRequireDefault(_loudness);

exports["default"] = function () {
  if (typeof arguments[0].signal !== "object") {
    throw new TypeError();
  }
  var loudnessValue = (0, _loudness2["default"])(arguments[0]);
  var spec = loudnessValue.specific;
  var output = 0;

  for (var i = 0; i < spec.length; i++) {
    if (i < 15) {
      output += (i + 1) * spec[i + 1];
    } else {
      output += 0.066 * Math.exp(0.171 * (i + 1));
    }
  }
  output *= 0.11 / loudnessValue.total;

  return output;
};

module.exports = exports["default"];