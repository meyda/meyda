#! /usr/bin/env node

(function () {
  "use strict";

  var opt = require("node-getopt")
    .create([
      [
        "",
        "o[=OUTPUT_FILE]",
        "Path to output file (optional, if not specified prints to console",
      ],
      [
        "",
        "bs[=BUFFER_SIZE]",
        "Buffer size in samples (optional, default is 512)",
      ],
      [
        "",
        "mfcc[=MFCC_COEFFICIENTS]",
        "Number of MFCC co-efficients that the MFCC feature extractor should return (optional, default is 13)",
      ],
      [
        "",
        "hs[=HOP_SIZE]",
        "Hop size in samples (optional, defaults to matching buffer size)",
      ],
      [
        "",
        "w[=WINDOWING_FUNCTION]",
        "Windowing function (optional, default is hanning)",
      ],
      [
        "",
        "format[=FORMAT_TYPE]",
        "Type of output file (optional, default is csv)",
      ],
      [
        "p",
        "",
        "Disables some of the logging and outputs data to stdout, useful for piping",
      ],
      ["h", "help", "Display help"],
    ])
    .bindHelp()
    .parseSystem();

  if (!opt.argv.length) throw new Error("Input file was not specified.");
  else if (opt.argv.length < 2) throw new Error("No features specified.");
  else if (opt.options.p && opt.options.o)
    throw new Error("Please choose either -p or --o.");
  else if (
    opt.options.format &&
    opt.options.format != "json" &&
    opt.options.format != "csv"
  )
    throw new Error("Invalid output format. Please choose either json or csv.");

  var Meyda = require("../dist/node/main.js");
  var WavLoader = require("./wav-loader.js");
  var fs = require("fs");

  var FRAME_SIZE = parseInt(opt.options.bs) || 512;
  var HOP_SIZE = parseInt(opt.options.hs) || FRAME_SIZE;
  var MFCC_COEFFICIENTS = parseInt(opt.options.mfcc) || 13;
  Meyda.bufferSize = FRAME_SIZE;
  Meyda.hopSize = HOP_SIZE;
  Meyda.windowingFunction = opt.options.w || "hanning";
  Meyda.numberOfMFCCCoefficients = MFCC_COEFFICIENTS;

  var outputFormat = null;
  if (opt.options.o) {
    outputFormat = opt.options.format || "csv";
  }
  var features = {};
  var featuresToExtract = opt.argv.slice(1);

  for (var i = 0; i < featuresToExtract.length; i++) {
    features[featuresToExtract[i]] = [];
  }

  // utility to convert typed arrays to normal arrays
  function typedToArray(t) {
    return Array.prototype.slice.call(t);
  }

  // utility to convert arrays to typed F32 arrays
  function arrayToTyped(t) {
    return Float32Array.from(t);
  }

  function output(val) {
    if (!opt.options.o || opt.options.p) {
      process.stdout.write(val);
    } else {
      wstream.write(val);
    }
  }

  //helper method to extract features for this chunk
  function extractFeatures(chunk) {
    //make it a F32A for efficiency
    var frame = arrayToTyped(chunk);
    //run the extraction of selected features
    var fset = Meyda.extract(featuresToExtract, frame);
    for (let j = 0; j < featuresToExtract.length; j++) {
      const feature = fset[featuresToExtract[j]];
      features[featuresToExtract[j]].push(feature);
    }
  }

  if (opt.options.o && !opt.options.p) {
    var wstream = fs.createWriteStream(opt.options.o);
  }

  //this is a buffer
  var buffer = [];
  var frameCount = 0;

  if (!opt.options.p) {
    //cosmetics
    console.log("\n=========\nMeyda CLI\n=========\n\n");
    console.log("Buffer size: " + FRAME_SIZE);
    console.log("Hop size: " + HOP_SIZE);
    console.log("Windowing function: " + Meyda.windowingFunction);
    console.log("Will extract:");
    //log features to extract
    featuresToExtract.forEach(function (f, i, a) {
      process.stdout.write(f + " ");
    });

    process.stdout.write("\n\nStarting extraction...\n|");
  }

  var wl = new WavLoader(
    function (config) {
      Meyda.sampleRate = config.sampleRate;
      if (!opt.options.p) {
        console.log("Sample rate recognized as: " + Meyda.sampleRate);
      }
    },
    function (chunk) {
      //convert to normal array so we can concatenate
      var _chunk = typedToArray(chunk);
      buffer = buffer.concat(_chunk);
      //if we're long enough, splice the frame, and extract features on it
      while (buffer.length >= FRAME_SIZE) {
        extractFeatures(buffer.slice(0, FRAME_SIZE));
        buffer.splice(0, HOP_SIZE);
        if (!opt.options.p) process.stdout.write("-");
        frameCount++;
      }
    },
    function (data) {
      //check if there's still something left in our buffer
      if (buffer.length) {
        //zero pad the buffer at the end so we get a full frame (needed for successful spectral analysis)
        for (let i = buffer.length; i < 2 * FRAME_SIZE - HOP_SIZE; i++) {
          buffer.push(0);
        }
        //extract features for zero-padded frame
        while (buffer.length >= FRAME_SIZE) {
          extractFeatures(buffer.slice(0, FRAME_SIZE));
          buffer.splice(0, HOP_SIZE);
          if (!opt.options.p) process.stdout.write("-");
          frameCount++;
        }
      }

      // only print out information if piping flag is disabled.
      if (!opt.options.p) {
        process.stdout.write("-|\nExtraction finished.\n\n");
        console.log(frameCount + " frames analysed.\n");
      }

      // if output to file is enabled.
      if (opt.options.o) {
        if (outputFormat == "json") {
          process.stdout.write("Writing to " + opt.options.o + "...\n");
          output(JSON.stringify(features, null, 4));
        } else if (outputFormat == "csv") {
          process.stdout.write("Writing to " + opt.options.o + "...\n");
          for (let i = 0; i < featuresToExtract.length; i++) {
            output(featuresToExtract[i].toString());
            output(i == featuresToExtract.length - 1 ? "" : ",");
          }

          output("\n");
          for (let i = 0; i < frameCount; i++) {
            for (let j = 0; j < featuresToExtract.length; j++) {
              const feature = features[featuresToExtract[j]];
              if (typeof feature[i] === "object") {
                for (let f = 0; f < Object.keys(feature[i]).length; f++)
                  output(feature[i][f] + ",");
                output(j == featuresToExtract.length - 1 ? "" : ",");
              } else {
                output(feature[i].toString());
                output(j == featuresToExtract.length - 1 ? "" : ",");
              }
            }
            output("\n");
          }
        }
        console.log("Done.");
        wstream.end();
        console.log("");
      } else {
        // if there is no output flag, print to console.
        for (let j = 0; j < featuresToExtract.length; j++) {
          output(
            "\n*********" + featuresToExtract[j].toString() + "*********\n\n"
          );

          for (let i = 0; i < frameCount; i++) {
            var feature = features[featuresToExtract[j]];
            if (typeof feature[i] === "object") {
              var keys = Object.keys(feature[i]);
              for (let f = 0; f < keys.length; f++) {
                output(feature[i][keys[f]] + "");
                output(f == keys.length - 1 ? "\n" : ",");
              }
            } else {
              output(feature[i].toString());
              output("\n");
            }
          }
          output("\n");
        }
      }
      //get averages
      for (let j = 0; j < featuresToExtract.length; j++) {
        //check if this feature returns arrays
        if (typeof features[featuresToExtract[j]][0] != "object")
          //if not, calculate average
          console.log(
            "Average " +
              featuresToExtract[j] +
              ": " +
              features[featuresToExtract[j]].reduce(function (
                previousValue,
                currentValue
              ) {
                return previousValue + currentValue;
              }) /
                features[featuresToExtract[j]].length
          );
      }
    }
  );

  wl.open(opt.argv[0]);
})();
