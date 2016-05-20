const chai = require('chai');
const assert = chai.assert;
const TestData = require('../TestData');
const utilities = require('../../dist/node/utilities');

// Setup
const mfcc = require('../../dist/node/extractors/mfcc');

describe('mfcc', () => {
  it('should return correct mfcc value given a valid signal', (done) => {
    const en = mfcc({
      sampleRate: 44100,
      bufferSize: 512,
      ampSpectrum: TestData.VALID_AMPLITUDE_SPECTRUM,
      melFilterBank: utilities.createMelFilterBank(26, 44100, 512),
    });

    assert.deepEqual(en, {
      0: -230.54681396484375,
      1: 61.48476791381836,
      2: 13.521626472473145,
      3: 11.729072570800781,
      4: -6.710836887359619,
      5: -0.8134725093841553,
      6: -3.924482583999634,
      7: -14.846750259399414,
      8: 5.131158351898193,
      9: 2.84036922454834,
      10: -9.423062324523926,
      11: -0.7812660932540894,
      12: -4.733273029327393,
      13: -5.841785430908203,
      14: 1.3796908855438232,
      15: -6.749012470245361,
      16: -2.7889416217803955,
      17: 2.546294689178467,
      18: -7.882645130157471,
      19: -4.771088123321533,
      20: -1.6537472009658813,
      21: -6.836357593536377,
      22: -2.425736904144287,
      23: -2.6888346672058105,
      24: -2.661608934402466,
      25: 4.682251453399658 }
    );

    done();
  });

  it('should throw an error when passed an empty object', (done) => {
    try {
      mfcc({});
    } catch (e) {
      done();
    }
  });

  it('should throw an error when not passed anything', (done) => {
    try {
      mfcc();
    } catch (e) {
      done();
    }
  });

  it('should throw an error when passed something invalid', (done) => {
    try {
      mfcc({ signal: 'not a signal' });
    } catch (e) {
      done();
    }
  });
});
