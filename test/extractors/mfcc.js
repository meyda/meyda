var chai = require("chai");
var assert = chai.assert;
var TestData = require("../TestData");
var utilities = require("../../dist/node/utilities");

// Setup
var mfcc = require("../../dist/node/extractors/mfcc");

describe('mfcc', function(){
  it('should return the correct mfcc value when passed a valid signal', function(done){
    var en = mfcc({
      sampleRate:44100,
      bufferSize:512,
      ampSpectrum:TestData.VALID_AMPLITUDE_SPECTRUM,
      melFilterBank:utilities.createMelFilterBank(26,44100,512)
    });

    assert.deepEqual(en,{
      '0': 0.2318875789642334,
      '1': 0.07211969792842865,
      '2': 0.06255883723497391,
      '3': -0.03579329699277878,
      '4': -0.004338780418038368,
      '5': -0.02093183808028698,
      '6': -0.07918746024370193,
      '7': 0.027367837727069855,
      '8': 0.015149552375078201,
      '9': -0.05025937035679817,
      '10': -0.0041670044884085655,
      '11': -0.025245653465390205,
      '12': -0.031158072873950005,
      '13': 0.007358794566243887,
      '14': -0.03599690645933151,
      '15': -0.014875248074531555,
      '16': 0.013581059873104095,
      '17': -0.04204331710934639,
      '18': -0.025447344407439232,
      '19': -0.00882052257657051,
      '20': -0.036462776362895966,
      '21': -0.012938044033944607,
      '22': -0.014341320842504501,
      '23': -0.014196100644767284,
      '24': 0.024973517283797264,
      '25': 7.047859928011166e-16 }
    );

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
