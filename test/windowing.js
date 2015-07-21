var chai = require("chai");
var assert = chai.assert;
var TestData = require('./TestData');

// Setup
var windowing = require("../dist/node/windowing");

var hanning128 = require("./data/hanning128.json");
var hanning256 = require("./data/hanning256.json");
var hanning512 = require("./data/hanning512.json");
var hanning1024 = require("./data/hanning1024.json");
var hanning2048 = require("./data/hanning2048.json");
var hamming128 = require("./data/hamming128.json");
var hamming256 = require("./data/hamming256.json");
var hamming512 = require("./data/hamming512.json");
var hamming1024 = require("./data/hamming1024.json");
var hamming2048 = require("./data/hamming2048.json");

describe('windowing', function(){
	it('should generate a correct 128 bin hanning window', function(done){
		assert.deepEqual(hanning128,windowing.hanning(128));
		done();
	});

	it('should generate a correct 256 bin hanning window', function(done){
		assert.deepEqual(hanning256,windowing.hanning(256));
		done();
	});

	it('should generate a correct 512 bin hanning window', function(done){
		assert.deepEqual(hanning512,windowing.hanning(512));
		done();
	});

	it('should generate a correct 1024 bin hanning window', function(done){
		assert.deepEqual(hanning1024,windowing.hanning(1024));
		done();
	});

	it('should generate a correct 2048 bin hanning window', function(done){
		assert.deepEqual(hanning2048,windowing.hanning(2048));
		done();
	});

	it('should generate a correct 128 bin hamming window', function(done){
		assert.deepEqual(hamming128,windowing.hamming(128));
		done();
	});

	it('should generate a correct 256 bin hamming window', function(done){
		assert.deepEqual(hamming256,windowing.hamming(256));
		done();
	});

	it('should generate a correct 512 bin hamming window', function(done){
		assert.deepEqual(hamming512,windowing.hamming(512));
		done();
	});

	it('should generate a correct 1024 bin hamming window', function(done){
		assert.deepEqual(hamming1024,windowing.hamming(1024));
		done();
	});

	it('should generate a correct 2048 bin hamming window', function(done){
		assert.deepEqual(hamming2048,windowing.hamming(2048));
		done();
	});
});