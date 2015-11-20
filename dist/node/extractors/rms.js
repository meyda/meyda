"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (args) {
	if (_typeof(args.signal) !== "object") {
		throw new TypeError();
	}
	var rms = 0;
	for (var i = 0; i < args.signal.length; i++) {
		rms += Math.pow(args.signal[i], 2);
	}
	rms = rms / args.signal.length;
	rms = Math.sqrt(rms);

	return rms;
};

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

module.exports = exports['default'];