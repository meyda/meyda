'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.default = function () {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  if (_typeof(args[0].signal) !== 'object' || _typeof(args[0].previousSignal) !== 'object') {
    throw new TypeError();
  }

  var sf = 0;
  for (var i = -(args[0].bufferSize / 2); i < args[0].signal.length / 2 - 1; i++) {
    var x = Math.abs(args[0].signal[i]) - Math.abs(args[0].previousSignal[i]);
    sf += (x + Math.abs(x)) / 2;
  }

  return sf;
};

module.exports = exports['default'];