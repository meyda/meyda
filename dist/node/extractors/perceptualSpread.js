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

	var max = 0;
	for (var i = 0; i < loudnessValue.specific.length; i++) {
		if (loudnessValue.specific[i] > max) {
			max = loudnessValue.specific[i];
		}
	}

	var spread = Math.pow((loudnessValue.total - max) / loudnessValue.total, 2);

	return spread;
};

module.exports = exports["default"];