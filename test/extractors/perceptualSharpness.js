var chai = require("chai");
var assert = chai.assert;
var TestData = require("../TestData");

// Setup
var perceptualSharpness = require("../../dist/node/extractors/perceptualSharpness");

describe('perceptualSharpness', function(){
  it('should return the correct perceptualSharpness value when passed a valid signal', function(done){
    var en = perceptualSharpness({
      signal:TestData.VALID_SIGNAL,
      ampSpectrum:TestData.VALID_AMPLITUDE_SPECTRUM,
      barkScale:TestData.VALID_BARK_SCALE
    });

    assert.equal(en,0.6469286541680944);

    done();
  });
  
  it('should throw an error when passed an empty object', function(done){
    try{
      var en = perceptualSharpness({});
    } catch(e){
      done();
    }
  });
  
  it('should throw an error when not passed anything', function(done){
    try{
      var en = perceptualSharpness();
    } catch(e){
      done();
    }
  });

  it('should throw an error when passed something invalid', function(done){
    try{
      var en = perceptualSharpness({signal:"not a signal"});
    } catch(e){
      done();
    }
  });
});