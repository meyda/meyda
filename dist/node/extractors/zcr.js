"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = function (bufferSize, m) {
  var zcr = 0;
  for (var i = 0; i < m.signal.length; i++) {
    if (m.signal[i] >= 0 && m.signal[i + 1] < 0 || m.signal[i] < 0 && m.signal[i + 1] >= 0) {
      zcr++;
    }
  }
  return zcr;
};

module.exports = exports["default"];