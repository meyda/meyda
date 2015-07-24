"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

var _assert = require('assert');

var assert = _interopRequireWildcard(_assert);

exports["default"] = function () {
	if (typeof arguments[0].signal !== "object") {
		throw new TypeError();
	}

	var energy = 0;
	for (var i = 0; i < arguments[0].signal.length; i++) {
		energy += Math.pow(Math.abs(arguments[0].signal[i]), 2);
	}
	return energy;
};

module.exports = exports["default"];