var chai = require('chai');
var assert = chai.assert;
var TestData = require('../TestData');

// Setup
var loudness = require('../../dist/node/extractors/loudness');

describe('loudness', function () {
  it('should return correct value given a valid signal', function (done) {
    var en = loudness({
      ampSpectrum:TestData.VALID_AMPLITUDE_SPECTRUM,
      barkScale:TestData.VALID_BARK_SCALE,
    });

    assert.deepEqual(en, { specific:{ 0:0.8241609334945679,
    1:0.971539318561554,
    2:0.7246851921081543,
    3:0.868057370185852,
    4:0.9084116816520691,
    5:0.5983786582946777,
    6:0.8250990509986877,
    7:0.8279480338096619,
    8:0.6802764534950256,
    9:0.6513881683349609,
    10:0.6347343325614929,
    11:0.6553743481636047,
    12:0.6563374996185303,
    13:0.7111011147499084,
    14:0.694219172000885,
    15:0.7696076035499573,
    16:0.677422285079956,
    17:0.6804705262184143,
    18:0.668949544429779,
    19:0.6583544611930847,
    20:0.8762503862380981,
    21:0.7247303128242493,
    22:0.7742922306060791,
    23:0.8974387645721436,
    },
    total:17.959227442741394,
    });

    done();
  });

  it('should throw an error when passed an empty object', function (done) {
    try {
      var en = loudness({});
    } catch (e) {
      done();
    }
  });

  it('should throw an error when not passed anything', function (done) {
    try {
      var en = loudness();
    } catch (e) {
      done();
    }
  });

  it('should throw an error when passed something invalid', function (done) {
    try {
      var en = loudness({ signal:'not a signal' });
    } catch (e) {
      done();
    }
  });
});
