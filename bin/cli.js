'use strict';

var opt = require('node-getopt').create([
  ['s' , ''                    , 'short option.'],
  [''  , 'long'                , 'long option.'],
  ['S' , 'short-with-arg=ARG'  , 'option with argument'],
  ['L' , 'long-with-arg=ARG'   , 'long option with argument'],
  [''  , 'color[=COLOR]'       , 'COLOR is optional'],
  ['m' , 'multi-with-arg=ARG+' , 'multiple option with argument'],
  [''  , 'no-comment'],
  ['h' , 'help'                , 'display this help'],
  ['v' , 'version'             , 'show version']
])
.bindHelp()
.parseSystem();

var meyda = require('../dist/node/main.js');
var WavLoader = require('./wav-loader.js');

var FRAME_SIZE = 2048;
meyda.bufferSize = FRAME_SIZE;
var features = {};
var featuresToExtract = ["zcr","rms","spectralCentroid"];
for(var i = 0; i < featuresToExtract.length; i++){
  features[featuresToExtract[i]] = [];
}

var wl = new WavLoader(null,function(buffer){
  console.log(buffer.length);
  for(var i = 0; i < buffer.length;i+=FRAME_SIZE){
    var frame = buffer.slice(i,buffer.length-i>FRAME_SIZE?i+FRAME_SIZE:buffer.length);
    for(var j = 0; j < featuresToExtract.length; j++){
      var fset = meyda.extract(featuresToExtract,frame);
      features[featuresToExtract[j]].push(fset[featuresToExtract[j]]);
    }
  }
  for(var j = 0; j < featuresToExtract.length;j++){
    console.log('Average '+featuresToExtract[j]+': '+features[featuresToExtract[j]].reduce(function(previousValue, currentValue){
      return previousValue+currentValue;
    })/features[featuresToExtract[j]].length);
  }
});

wl.open(opt.argv[0]);
