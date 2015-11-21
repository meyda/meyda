"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {
	if (_typeof(arguments[0].ampSpectrum) !== "object") {
		throw new TypeError();
	}
	var powerSpectrum = new Float32Array(arguments[0].ampSpectrum.length);
	for (var i = 0; i < powerSpectrum.length; i++) {
		powerSpectrum[i] = Math.pow(arguments[0].ampSpectrum[i], 2);
	}
	return powerSpectrum;
};

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

module.exports = exports['default'];