"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {
	if (_typeof(arguments[0].ampSpectrum) !== "object") {
		throw new TypeError();
	}
	var numerator = 0;
	var denominator = 0;
	for (var i = 0; i < arguments[0].ampSpectrum.length; i++) {
		numerator += Math.log(arguments[0].ampSpectrum[i]);
		denominator += arguments[0].ampSpectrum[i];
	}
	return Math.exp(numerator / arguments[0].ampSpectrum.length) * arguments[0].ampSpectrum.length / denominator;
};

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

module.exports = exports['default'];