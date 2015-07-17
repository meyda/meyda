var chai = require("chai");
var assert = chai.assert;
var TestData = require("../TestData");

// Setup
var mfcc = require("../../dist/node/extractors/mfcc");

describe('mfcc', function(){
  it('should return the correct mfcc value when passed a valid signal', function(done){
    var en = mfcc({
      signal:TestData.VALID_SIGNAL
    });

    assert.equal(en,3.6735467237693653);
    console.log(en);

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