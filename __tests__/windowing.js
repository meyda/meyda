var windowing = require('../dist/node/windowing');

var blackman128 = require('./data/blackman128.json');
var blackman256 = require('./data/blackman256.json');
var blackman512 = require('./data/blackman512.json');
var blackman1024 = require('./data/blackman1024.json');
var blackman2048 = require('./data/blackman2048.json');
var hanning128 = require('./data/hanning128.json');
var hanning256 = require('./data/hanning256.json');
var hanning512 = require('./data/hanning512.json');
var hanning1024 = require('./data/hanning1024.json');
var hanning2048 = require('./data/hanning2048.json');
var hamming128 = require('./data/hamming128.json');
var hamming256 = require('./data/hamming256.json');
var hamming512 = require('./data/hamming512.json');
var hamming1024 = require('./data/hamming1024.json');
var hamming2048 = require('./data/hamming2048.json');
var sine128 = require('./data/sine128.json');
var sine256 = require('./data/sine256.json');
var sine512 = require('./data/sine512.json');
var sine1024 = require('./data/sine1024.json');
var sine2048 = require('./data/sine2048.json');

describe('windowing', () => {
  test('should generate a correct 128 bin blackman window', done => {
    expect(blackman128).toEqual(windowing.blackman(128));
    done();
  });

  test('should generate a correct 256 bin blackman window', done => {
    expect(blackman256).toEqual(windowing.blackman(256));
    done();
  });

  test('should generate a correct 512 bin blackman window', done => {
    expect(blackman512).toEqual(windowing.blackman(512));
    done();
  });

  test('should generate a correct 1024 bin blackman window', done => {
    expect(blackman1024).toEqual(windowing.blackman(1024));
    done();
  });

  test('should generate a correct 2048 bin blackman window', done => {
    expect(blackman2048).toEqual(windowing.blackman(2048));
    done();
  });

  test('should generate a correct 128 bin hanning window', done => {
    expect(hanning128).toEqual(windowing.hanning(128));
    done();
  });

  test('should generate a correct 256 bin hanning window', done => {
    expect(hanning256).toEqual(windowing.hanning(256));
    done();
  });

  test('should generate a correct 512 bin hanning window', done => {
    expect(hanning512).toEqual(windowing.hanning(512));
    done();
  });

  test('should generate a correct 1024 bin hanning window', done => {
    expect(hanning1024).toEqual(windowing.hanning(1024));
    done();
  });

  test('should generate a correct 2048 bin hanning window', done => {
    expect(hanning2048).toEqual(windowing.hanning(2048));
    done();
  });

  test('should generate a correct 128 bin hamming window', done => {
    expect(hamming128).toEqual(windowing.hamming(128));
    done();
  });

  test('should generate a correct 256 bin hamming window', done => {
    expect(hamming256).toEqual(windowing.hamming(256));
    done();
  });

  test('should generate a correct 512 bin hamming window', done => {
    expect(hamming512).toEqual(windowing.hamming(512));
    done();
  });

  test('should generate a correct 1024 bin hamming window', done => {
    expect(hamming1024).toEqual(windowing.hamming(1024));
    done();
  });

  test('should generate a correct 2048 bin hamming window', done => {
    expect(hamming2048).toEqual(windowing.hamming(2048));
    done();
  });

  test('should generate a correct 128 bin sine window', done => {
    expect(sine128).toEqual(windowing.sine(128));
    done();
  });

  test('should generate a correct 256 bin sine window', done => {
    expect(sine256).toEqual(windowing.sine(256));
    done();
  });

  test('should generate a correct 512 bin sine window', done => {
    expect(sine512).toEqual(windowing.sine(512));
    done();
  });

  test('should generate a correct 1024 bin sine window', done => {
    expect(sine1024).toEqual(windowing.sine(1024));
    done();
  });

  test('should generate a correct 2048 bin sine window', done => {
    expect(sine2048).toEqual(windowing.sine(2048));
    done();
  });
});
