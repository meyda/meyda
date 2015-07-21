"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extractorUtilities = require('./extractorUtilities');

exports["default"] = function (args) {
	if (typeof args.ampSpectrum !== "object") {
		throw new TypeError();
	}
	return Math.sqrt((0, _extractorUtilities.mu)(2, args.ampSpectrum) - Math.pow((0, _extractorUtilities.mu)(1, args.ampSpectrum), 2));
};

module.exports = exports["default"];