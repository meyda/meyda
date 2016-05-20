'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.default = function () {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  if (_typeof(args[0].signal) !== 'object') {
    throw new TypeError();
  }

  var loudnessValue = (0, _loudness2.default)(args[0]);

  var max = 0;
  for (var i = 0; i < loudnessValue.specific.length; i++) {
    if (loudnessValue.specific[i] > max) {
      max = loudnessValue.specific[i];
    }
  }

  return Math.pow((loudnessValue.total - max) / loudnessValue.total, 2);
};

var _loudness = require('./loudness');

var _loudness2 = _interopRequireDefault(_loudness);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports['default'];