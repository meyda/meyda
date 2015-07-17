"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

var _extractorUtilities = require("./extractorUtilities");

var util = _interopRequireWildcard(_extractorUtilities);

exports["default"] = function () {
	if (typeof arguments[0].ampSpectrum !== "object") {
		throw new TypeError();
	}
	return util.mu(1, arguments[0].ampSpectrum);
};

module.exports = exports["default"];