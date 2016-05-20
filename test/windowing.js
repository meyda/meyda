const chai = require('chai');
const assert = chai.assert;

// Setup
const windowing = require('../dist/node/windowing');

const blackman128 = require('./data/blackman128.json');
const blackman256 = require('./data/blackman256.json');
const blackman512 = require('./data/blackman512.json');
const blackman1024 = require('./data/blackman1024.json');
const blackman2048 = require('./data/blackman2048.json');
const hanning128 = require('./data/hanning128.json');
const hanning256 = require('./data/hanning256.json');
const hanning512 = require('./data/hanning512.json');
const hanning1024 = require('./data/hanning1024.json');
const hanning2048 = require('./data/hanning2048.json');
const hamming128 = require('./data/hamming128.json');
const hamming256 = require('./data/hamming256.json');
const hamming512 = require('./data/hamming512.json');
const hamming1024 = require('./data/hamming1024.json');
const hamming2048 = require('./data/hamming2048.json');
const sine128 = require('./data/sine128.json');
const sine256 = require('./data/sine256.json');
const sine512 = require('./data/sine512.json');
const sine1024 = require('./data/sine1024.json');
const sine2048 = require('./data/sine2048.json');

describe('windowing', () => {
  it('should generate a correct 128 bin blackman window', (done) => {
    assert.deepEqual(blackman128, windowing.blackman(128));
    done();
  });

  it('should generate a correct 256 bin blackman window', (done) => {
    assert.deepEqual(blackman256, windowing.blackman(256));
    done();
  });

  it('should generate a correct 512 bin blackman window', (done) => {
    assert.deepEqual(blackman512, windowing.blackman(512));
    done();
  });

  it('should generate a correct 1024 bin blackman window', (done) => {
    assert.deepEqual(blackman1024, windowing.blackman(1024));
    done();
  });

  it('should generate a correct 2048 bin blackman window', (done) => {
    assert.deepEqual(blackman2048, windowing.blackman(2048));
    done();
  });

  it('should generate a correct 128 bin hanning window', (done) => {
    assert.deepEqual(hanning128, windowing.hanning(128));
    done();
  });

  it('should generate a correct 256 bin hanning window', (done) => {
    assert.deepEqual(hanning256, windowing.hanning(256));
    done();
  });

  it('should generate a correct 512 bin hanning window', (done) => {
    assert.deepEqual(hanning512, windowing.hanning(512));
    done();
  });

  it('should generate a correct 1024 bin hanning window', (done) => {
    assert.deepEqual(hanning1024, windowing.hanning(1024));
    done();
  });

  it('should generate a correct 2048 bin hanning window', (done) => {
    assert.deepEqual(hanning2048, windowing.hanning(2048));
    done();
  });

  it('should generate a correct 128 bin hamming window', (done) => {
    assert.deepEqual(hamming128, windowing.hamming(128));
    done();
  });

  it('should generate a correct 256 bin hamming window', (done) => {
    assert.deepEqual(hamming256, windowing.hamming(256));
    done();
  });

  it('should generate a correct 512 bin hamming window', (done) => {
    assert.deepEqual(hamming512, windowing.hamming(512));
    done();
  });

  it('should generate a correct 1024 bin hamming window', (done) => {
    assert.deepEqual(hamming1024, windowing.hamming(1024));
    done();
  });

  it('should generate a correct 2048 bin hamming window', (done) => {
    assert.deepEqual(hamming2048, windowing.hamming(2048));
    done();
  });

  it('should generate a correct 128 bin sine window', (done) => {
    assert.deepEqual(sine128, windowing.sine(128));
    done();
  });

  it('should generate a correct 256 bin sine window', (done) => {
    assert.deepEqual(sine256, windowing.sine(256));
    done();
  });

  it('should generate a correct 512 bin sine window', (done) => {
    assert.deepEqual(sine512, windowing.sine(512));
    done();
  });

  it('should generate a correct 1024 bin sine window', (done) => {
    assert.deepEqual(sine1024, windowing.sine(1024));
    done();
  });

  it('should generate a correct 2048 bin sine window', (done) => {
    assert.deepEqual(sine2048, windowing.sine(2048));
    done();
  });
});
