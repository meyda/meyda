"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.default = function () {
	if (_typeof(arguments[0].ampSpectrum) !== "object") {
		throw new TypeError();
	}
	var ampspec = arguments[0].ampSpectrum;
	var mu1 = (0, _extractorUtilities.mu)(1, ampspec);
	var mu2 = (0, _extractorUtilities.mu)(2, ampspec);
	var mu3 = (0, _extractorUtilities.mu)(3, ampspec);
	var mu4 = (0, _extractorUtilities.mu)(4, ampspec);
	var numerator = -3 * Math.pow(mu1, 4) + 6 * mu1 * mu2 - 4 * mu1 * mu3 + mu4;
	var denominator = Math.pow(Math.sqrt(mu2 - Math.pow(mu1, 2)), 4);
	return numerator / denominator;
};

var _extractorUtilities = require("./extractorUtilities");

module.exports = exports['default'];