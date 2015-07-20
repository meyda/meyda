"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports["default"] = function () {
	if (typeof arguments[0].signal !== "object") {
		throw new TypeError();
	}
	var rms = 0;
	for (var i = 0; i < arguments[0].signal.length; i++) {
		rms += Math.pow(arguments[0].signal[i], 2);
	}
	rms = rms / arguments[0].signal.length;
	rms = Math.sqrt(rms);

	return rms;
};

module.exports = exports["default"];