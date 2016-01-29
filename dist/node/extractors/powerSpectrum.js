"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

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

module.exports = exports['default'];