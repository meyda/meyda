var chai = require("chai");
var assert = chai.assert;
var TestData = require("../TestData");

// Setup
var loudness = require("../../dist/node/extractors/loudness");

describe('loudness', function(){
  it('should return the correct loudness value when passed a valid signal', function(done){
    var en = loudness({
      ampSpectrum:TestData.VALID_AMPLITUDE_SPECTRUM,
      barkScale:TestData.VALID_BARK_SCALE
    });
    assert.deepEqual(en,{
      "specific":{
        "0":1,
        "1":0,
        "2":0,
        "3":0,
        "4":0,
        "5":0,
        "6":0,
        "7":0,
        "8":0,
        "9":0,
        "10":0,
        "11":0,
        "12":0,
        "13":0,
        "14":0,
        "15":0,
        "16":0,
        "17":0,
        "18":0,
        "19":0,
        "20":0,
        "21":0,
        "22":0,
        "23":0
      },
      "total":0
    });

    done();
  });
  
  it('should throw an error when passed an empty object', function(done){
    try{
      var en = loudness({});
    } catch(e){
      done();
    }
  });
  
  it('should throw an error when not passed anything', function(done){
    try{
      var en = loudness();
    } catch(e){
      done();
    }
  });

  it('should throw an error when passed something invalid', function(done){
    try{
      var en = loudness({signal:"not a signal"});
    } catch(e){
      done();
    }
  });
});