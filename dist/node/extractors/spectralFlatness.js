"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

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

module.exports = exports['default'];