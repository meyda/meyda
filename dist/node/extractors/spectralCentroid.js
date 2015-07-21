"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extractorUtilities = require('./extractorUtilities');

exports["default"] = function () {
	if (typeof arguments[0].ampSpectrum !== "object") {
		throw new TypeError();
	}
	return (0, _extractorUtilities.mu)(1, arguments[0].ampSpectrum);
};

module.exports = exports["default"];