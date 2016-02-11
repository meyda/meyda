"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.default = function () {
	if (_typeof(arguments[0].signal) !== "object") {
		throw new TypeError();
	}
	var zcr = 0;
	for (var i = 0; i < arguments[0].signal.length; i++) {
		if (arguments[0].signal[i] >= 0 && arguments[0].signal[i + 1] < 0 || arguments[0].signal[i] < 0 && arguments[0].signal[i + 1] >= 0) {
			zcr++;
		}
	}
	return zcr;
};

module.exports = exports['default'];