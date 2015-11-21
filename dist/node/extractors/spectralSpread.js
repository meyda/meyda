"use strict";

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

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

module.exports = exports['default'];