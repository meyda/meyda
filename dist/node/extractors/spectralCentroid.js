"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.default = function () {
	if (_typeof(arguments[0].ampSpectrum) !== "object") {
		throw new TypeError();
	}
	return (0, _extractorUtilities.mu)(1, arguments[0].ampSpectrum);
};

var _extractorUtilities = require("./extractorUtilities");

module.exports = exports['default'];