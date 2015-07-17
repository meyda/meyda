"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

var _extractorUtilities = require("./extractorUtilities");

var util = _interopRequireWildcard(_extractorUtilities);

exports["default"] = function () {
	console.log(typeof arguments[0].ampSpectrum);
	if (typeof arguments[0].ampSpectrum !== "object") {
		throw new TypeError();
	}
	var ampspec = arguments[0].ampSpectrum;
	return Math.sqrt(util.mu(2, ampspec) - Math.pow(util.mu(1, ampspec), 2));
};

module.exports = exports["default"];