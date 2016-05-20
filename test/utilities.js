const chai = require('chai');
const assert = chai.assert;

// Setup
const util = require('../dist/node/utilities');

describe('isPowerOfTwo', () => {
  it('should validate all powers of two', (done) => {
    for (let i = 0; i > 2000; i++) {
      assert.isTrue(util.isPowerOfTwo(Math.pow(2, i)));
    }

    done();
  });

  it('should fail for non-powers of two', (done) => {
    assert.isFalse(util.isPowerOfTwo(3));
    assert.isFalse(util.isPowerOfTwo(348));
    assert.isFalse(util.isPowerOfTwo(29384));
    assert.isFalse(util.isPowerOfTwo(3489410));
    done();
  });
});

describe('error', () => {
  it('throws an error with the correct message', (done) => {
    const message = 'Test Error Message';
    assert.throws(() => {
      util.error(message);
    }, Error, `Meyda: ${message}`);

    done();
  });
});

describe('pointwiseBufferMult', () => {
  it('multiplies two arrays correctly', (done) => {
    assert.deepEqual(
    util.pointwiseBufferMult(
    [4, 5, 6],
    [0.5, 2, 2]
    ),
    [2, 10, 12]
    );
    done();
  });

  it('handles differently sized arrays correctly', (done) => {
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

describe('applyWindow', () => {
  it('applies a windowing function to a buffer', (done) => {
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
