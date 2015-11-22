'use strict';

var opt = require('node-getopt').create([
        ['','o=OUTPUT_FILE','Path to output file'],
        ['', 'bs[=BUFFER_SIZE]', 'Buffer size in samples (optional, default is 512)'],
        ['', 'w[=WINDOWING_FUNCTION]', 'Windowing function (optional, default is hanning)'],
        ['p', '', 'Disables logging and outputs data to stdout, useful for piping'],
        ['h', 'help', 'Display help'],
        ['v', 'version', 'show version']
    ])
    .bindHelp()
    .parseSystem();

if (!opt.argv.length)
  throw new Error('Input file was not specified.')
else if (opt.argv.length < 2)
  throw new Error('No features specified.')
else if (!opt.options.p && (!opt.options.o || opt.options.o.length == 0))
  throw new Error('Output file not specified')

var Meyda = require('../dist/node/main.js');
var WavLoader = require('./wav-loader.js');
var fs = require('fs');

var FRAME_SIZE = parseInt(opt.options.bs) || 512;
Meyda.bufferSize = FRAME_SIZE;
Meyda.windowingFunction = opt.options.w || 'hanning';
var features = {};
var featuresToExtract = opt.argv.slice(1);

for (var i = 0; i < featuresToExtract.length; i++) {
    features[featuresToExtract[i]] = [];
}

// utility to convert typed arrays to normal arrays
function typedToArray(t) {
  return Array.prototype.slice.call(t);
}

function output(val) {
  if (opt.options.p) {
    process.stdout.write(val)
  }
  else {
    wstream.write(val)
  }
}

//helper method to extract features for this chunk
function extractFeatures(chunk) {
  //make it a F32A for efficiency
  var frame = new Float32Array(chunk);
  //run the extraction of selected features
  var fset = Meyda.extract(featuresToExtract, frame);
  for (var j = 0; j < featuresToExtract.length; j++) {
      var feature = fset[featuresToExtract[j]]
      features[featuresToExtract[j]].push(feature);
      if (typeof feature == 'object') {
        for (var f = 0; f < feature.length; f++)
          output(feature[f].toString() + ', ');
      }
      else {
        output(feature.toString());
        output(j==featuresToExtract.length-1 ? '' : ', ');
      }
  }
  output('\n');
}

if (!opt.options.p) {
  var wstream = fs.createWriteStream(opt.options.o)
}

//this is a buffer
var buffer = [];
var frameCount = 0;
if (!opt.options.p) {
  //cosmetics
  console.log('\n=========\nMeyda CLI\n=========\n\n');
  console.log('Buffer size: ' + FRAME_SIZE);
  console.log('Windowing function: ' + Meyda.windowingFunction);
  console.log('Will extract:');
  process.stdout.write('\t');
  //log features to extract
  featuresToExtract.forEach(function(f,i,a){
    process.stdout.write(f + ' ');
    output(f.toString());
    output(i == featuresToExtract.length-1 ? '': ', ');
  })
  output('\n');

  process.stdout.write('\n\nStarting extraction...\n|');
}


var wl = new WavLoader(

  function(chunk){
    //convert to normal array so we can concatenate
    var _chunk = typedToArray(chunk);
    buffer = buffer.concat(_chunk);
    //if we're long enough, splice the frame, and extract features on it
    if (buffer.length > FRAME_SIZE) {
      extractFeatures(buffer.splice(0, FRAME_SIZE));
      if (!opt.options.p) process.stdout.write('-');
      frameCount++;
    }
  },

  function(data) {
    //check if there's still something left in our buffer
    if (buffer.length) {
      //zero pad the buffer at the end so we get a full frame (needed for successful spectral analysis)
      for (var i = buffer.length; i < FRAME_SIZE; i++) {
        buffer.push(0);
      }
      //extract features for zero-padded frame
      extractFeatures(buffer);
      frameCount++;
    }

    if (!opt.options.p) {
      process.stdout.write('-|\nExtraction finished.\n\n')
      console.log(frameCount + ' frames analysed.\n')
      //get averages
      for (var j = 0; j < featuresToExtract.length; j++) {
          //check if this feature returns arrays
          if (typeof featuresToExtract[j][0] != 'object') //if not, calculate average
            console.log('Average ' + featuresToExtract[j] + ': ' + features[featuresToExtract[j]].reduce(function(previousValue, currentValue) {
                return previousValue + currentValue;
            }) / features[featuresToExtract[j]].length);
      }

      wstream.end();
      console.log('')

    }

});

wl.open(opt.argv[0]);
