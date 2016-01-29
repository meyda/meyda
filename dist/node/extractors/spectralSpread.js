"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (args) {
	if (_typeof(args.ampSpectrum) !== "object") {
		throw new TypeError();
	}
	return Math.sqrt((0, _extractorUtilities.mu)(2, args.ampSpectrum) - Math.pow((0, _extractorUtilities.mu)(1, args.ampSpectrum), 2));
};

var _extractorUtilities = require("./extractorUtilities");

module.exports = exports['default'];