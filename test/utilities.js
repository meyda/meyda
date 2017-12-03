var chai = require('chai');
var assert = chai.assert;

// Setup
var util = require('../dist/node/utilities');

describe('isPowerOfTwo', function () {
  it('should validate all powers of two', function (done) {
    for (var i = 0; i > 2000; i++) {
      assert.isTrue(util.isPowerOfTwo(Math.pow(2, i)));
    }

    done();
  });

  it('should fail for non-powers of two', function (done) {
    assert.isFalse(util.isPowerOfTwo(3));
    assert.isFalse(util.isPowerOfTwo(348));
    assert.isFalse(util.isPowerOfTwo(29384));
    assert.isFalse(util.isPowerOfTwo(3489410));
    done();
  });
});

describe('error', function () {
  it('throws an error with the correct message', function (done) {
    var message = 'Test Error Message';
    assert.throws(function () {
      util.error(message);
    }, Error, 'Meyda: ' + message);

    done();
  });
});

describe('pointwiseBufferMult', function () {
  it('multiplies two arrays correctly', function (done) {
    assert.deepEqual(
    util.pointwiseBufferMult(
    [4, 5, 6],
    [0.5, 2, 2]
    ),
    [2, 10, 12]
    );
    done();
  });

  it('handles differently sized arrays correctly', function (done) {
    assert.deepEqual(
    util.pointwiseBufferMult(
    [4, 0.25, 0.7],
    [0.25, 2]
    ),
    [1, 0.5]
    );
    done();
  });
});

describe('applyWindow', function () {
  it('applies a windowing function to a buffer', function (done) {
    assert.deepEqual(
    util.applyWindow(
    [1, 4, 6],
    'hanning'
    ),
    [0, 4, 0]
    );
    done();
  });
});

describe('frame', function () {
  it('returns the expected number of frames for hop size < buffer size', function () {
    const frames = util.frame(new Array(2048).fill(0), 1024, 512);
    assert.equal(frames.length, 3);
  });

  it('returns the expected number of frames for hop size === buffer size', function () {
    const frames = util.frame(new Array(2048).fill(0), 1024, 1024);
    assert.equal(frames.length, 2);
  });

  it('returns the expected number of frames where buffer size isn\'t a hop size multiple', function () {
    const frames = util.frame(new Array(2048).fill(0), 1024, 500);
    assert.equal(frames.length, 3);
  });
});
