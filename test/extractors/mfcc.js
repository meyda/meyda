var chai = require("chai");
var assert = chai.assert;
var TestData = require("../TestData");

// Setup
var mfcc = require("../../dist/node/extractors/mfcc");

describe('mfcc', function(){
  it('should return the correct mfcc value when passed a valid signal', function(done){
    var en = mfcc({
      sampleRate:44100,
      bufferSize:512,
      ampSpectrum:TestData.VALID_AMPLITUDE_SPECTRUM
    });

    assert.deepEqual(en,{
      "0": 0.4637751877307892,
      "1": 0.1442393958568573,
      "2": 0.12511767446994781,
      "3": -0.07158658653497696,
      "4": -0.008677568286657333,
      "5": -0.04186367616057396,
      "6": -0.15837490558624268,
      "7": 0.054735664278268814,
      "8": 0.030299112200737,
      "9": -0.10051874071359634,
      "10": -0.008334016427397728,
      "11": -0.050491295754909515,
      "12": -0.062316153198480606
    });

    done();
  });
  
  it('should throw an error when passed an empty object', function(done){
    try{
      var en = mfcc({});
    } catch(e){
      done();
    }
  });
  
  it('should throw an error when not passed anything', function(done){
    try{
      var en = mfcc();
    } catch(e){
      done();
    }
  });

  it('should throw an error when passed something invalid', function(done){
    try{
      var en = mfcc({signal:"not a signal"});
    } catch(e){
      done();
    }
  });
});