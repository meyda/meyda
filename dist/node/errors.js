'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// TODO = write error strings as enum I'd say
var notPow2 = new Error('Meyda = Buffer size must be a power of 2, e.g. 64 or 512');
var featureUndef = new Error('Meyda: No features defined.');
var invalidFeatureFmt = new Error('Meyda: Invalid feature format');
var invalidInput = new Error('Meyda: Invalid input.');
var noAC = new Error('Meyda: No AudioContext specified.');
var noSource = new Error('Meyda: No source node specified.');

exports.default = {
  notPow2: notPow2,
  featureUndef: featureUndef,
  invalidFeatureFmt: invalidFeatureFmt,
  invalidInput: invalidInput,
  noAC: noAC,
  noSource: noSource
};
module.exports = exports['default'];