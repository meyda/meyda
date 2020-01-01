/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


(function () {
  var _this;
  var Audio = function Audio(bufferSize) {
    if (window.hasOwnProperty('webkitAudioContext') && !window.hasOwnProperty('AudioContext')) {
      window.AudioContext = webkitAudioContext;
    }

    // if (navigator.hasOwnProperty('webkitGetUserMedia') &&
    //   !navigator.hasOwnProperty('getUserMedia')) {
    //     navigator.getUserMedia = webkitGetUserMedia;
    //     if (!AudioContext.prototype.hasOwnProperty('createScriptProcessor')) {
    //       AudioContext.prototype.createScriptProcessor = AudioContext.prototype.createJavaScriptNode;
    //     }
    //   }

    this.context = new AudioContext();

    var elvis = document.getElementById('elvisSong');
    var stream = this.context.createMediaElementSource(elvis);
    stream.connect(this.context.destination);

    this.meyda = Meyda.createMeydaAnalyzer({
      audioContext: this.context,
      source: stream,
      bufferSize: bufferSize,
      windowingFunction: 'blackman'
    });
    _this = this;
    this.initializeMicrophoneSampling();
  };

  Audio.prototype.getSampleRate = function getSampleRate() {
    return this.context.sampleRate;
  };

  Audio.prototype.initializeMicrophoneSampling = function () {
    var errorCallback = function errorCallback(err) {
      // We should fallback to an audio file here, but that's difficult on mobile
      if (_this.context.state === 'suspended') {
        var resume = function resume() {
          _this.context.resume();

          setTimeout(function () {
            if (_this.context.state === 'running') {
              document.body.removeEventListener('touchend', resume, false);
            }
          }, 0);
        };

        document.body.addEventListener('touchend', resume, false);
      };
    };

    try {
      // navigator.getUserMedia = navigator.webkitGetUserMedia ||
      //   navigator.getUserMedia || navigator.mediaDevices.getUserMedia;
      var constraints = { video: false, audio: true };
      var successCallback = function successCallback(mediaStream) {
        document.getElementById('audioControl').style.display = 'none';
        console.log('User allowed microphone access.');
        console.log('Initializing AudioNode from MediaStream');
        // var source = _this.context.createMediaStreamSource(mediaStream);
        var source = _this.context.createOscillator();
        source.frequency.value = 4 * 23.4375;
        source.start();
        console.log('Setting Meyda Source to Microphone');
        _this.meyda.setSource(source);
        console.groupEnd();
      };
      //TODO Delete this
      successCallback();
      return;

      console.log('Asking for permission...');
      // let getUserMediaPromise = navigator.mediaDevices.getUserMedia(
      //   constraints,
      //   successCallback,
      //   errorCallback
      navigator.mediaDevices.enumerateDevices().then(function (devices) {
        var device = devices.filter(function (_ref) {
          var kind = _ref.kind;
          return kind === "audioinput";
        }).filter(function (_ref2) {
          var label = _ref2.label;
          return label === "Scarlett 2i2 USB";
        })[0];
        var getUserMediaPromise = navigator.mediaDevices.getUserMedia({
          audio: {
            deviceId: {
              exact: devices[4].deviceId
            }
          }
        });
        if (getUserMediaPromise) {
          getUserMediaPromise.then(successCallback);
          getUserMediaPromise.catch(errorCallback);
        }
      });
      // ).then(successCallback).cathc(errorCallback);
    } catch (e) {
      errorCallback();
    }
  };

  Audio.prototype.get = function (features) {
    _this.context.resume();
    return _this.meyda.get(features);
  };

  module.exports = Audio;
})();

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(3);

// real to complex fft
var fft = function fft(signal) {

  var complexSignal = {};

  if (signal.real === undefined || signal.imag === undefined) {
    complexSignal = utils.constructComplexArray(signal);
  } else {
    complexSignal.real = signal.real.slice();
    complexSignal.imag = signal.imag.slice();
  }

  var N = complexSignal.real.length;
  var logN = Math.log2(N);

  if (Math.round(logN) != logN) throw new Error('Input size must be a power of 2.');

  if (complexSignal.real.length != complexSignal.imag.length) {
    throw new Error('Real and imaginary components must have the same length.');
  }

  var bitReversedIndices = utils.bitReverseArray(N);

  // sort array
  var ordered = {
    'real': [],
    'imag': []
  };

  for (var i = 0; i < N; i++) {
    ordered.real[bitReversedIndices[i]] = complexSignal.real[i];
    ordered.imag[bitReversedIndices[i]] = complexSignal.imag[i];
  }

  for (var _i = 0; _i < N; _i++) {
    complexSignal.real[_i] = ordered.real[_i];
    complexSignal.imag[_i] = ordered.imag[_i];
  }
  // iterate over the number of stages
  for (var n = 1; n <= logN; n++) {
    var currN = Math.pow(2, n);

    // find twiddle factors
    for (var k = 0; k < currN / 2; k++) {
      var twiddle = utils.euler(k, currN);

      // on each block of FT, implement the butterfly diagram
      for (var m = 0; m < N / currN; m++) {
        var currEvenIndex = currN * m + k;
        var currOddIndex = currN * m + k + currN / 2;

        var currEvenIndexSample = {
          'real': complexSignal.real[currEvenIndex],
          'imag': complexSignal.imag[currEvenIndex]
        };
        var currOddIndexSample = {
          'real': complexSignal.real[currOddIndex],
          'imag': complexSignal.imag[currOddIndex]
        };

        var odd = utils.multiply(twiddle, currOddIndexSample);

        var subtractionResult = utils.subtract(currEvenIndexSample, odd);
        complexSignal.real[currOddIndex] = subtractionResult.real;
        complexSignal.imag[currOddIndex] = subtractionResult.imag;

        var additionResult = utils.add(odd, currEvenIndexSample);
        complexSignal.real[currEvenIndex] = additionResult.real;
        complexSignal.imag[currEvenIndex] = additionResult.imag;
      }
    }
  }

  return complexSignal;
};

// complex to real ifft
var ifft = function ifft(signal) {

  if (signal.real === undefined || signal.imag === undefined) {
    throw new Error("IFFT only accepts a complex input.");
  }

  var N = signal.real.length;

  var complexSignal = {
    'real': [],
    'imag': []
  };

  //take complex conjugate in order to be able to use the regular FFT for IFFT
  for (var i = 0; i < N; i++) {
    var currentSample = {
      'real': signal.real[i],
      'imag': signal.imag[i]
    };

    var conjugateSample = utils.conj(currentSample);
    complexSignal.real[i] = conjugateSample.real;
    complexSignal.imag[i] = conjugateSample.imag;
  }

  //compute
  var X = fft(complexSignal);

  //normalize
  complexSignal.real = X.real.map(function (val) {
    return val / N;
  });

  complexSignal.imag = X.imag.map(function (val) {
    return val / N;
  });

  return complexSignal;
};

module.exports = {
  fft: fft,
  ifft: ifft
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


(function () {
  'use strict';

  var _require = __webpack_require__(1),
      fft = _require.fft,
      ifft = _require.ifft;

  var scale = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'G#', 'A', 'Bb', 'B'];
  var bufferSize = 1024;
  var Audio = __webpack_require__(0);
  var a = new Audio(bufferSize);
  var highestDetectableMidiNote = 103;
  var highestDetectableFrequency = Math.pow(2, (highestDetectableMidiNote - 69) / 12) * 440;
  var sampleRate = a.getSampleRate();
  var highestDetectablePeriod = Math.ceil(sampleRate / highestDetectableFrequency);
  console.log(highestDetectableFrequency);
  console.log(highestDetectablePeriod);

  var aspectRatio = 16 / 10;
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(40, aspectRatio, 0.1, 1000);

  var initializeFFTs = function initializeFFTs(number, pointCount) {
    var ffts = [];
    for (var i = 0; i < number; i++) {
      ffts.push(Array.apply(null, Array(pointCount)).map(Number.prototype.valueOf, 0));
    }

    return ffts;
  };

  var material = new THREE.LineBasicMaterial({
    color: 0x00ff00
  });

  var yellowMaterial = new THREE.LineBasicMaterial({
    color: 0x00ffff
  });

  var ffts = initializeFFTs(20, bufferSize);
  var buffer = null;

  var renderer = new THREE.WebGLRenderer({ canvas: document.querySelector("canvas") });

  function resize() {
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = 'auto';

    var resolution = renderer.domElement.clientWidth / 16 * 10;
    renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);

    renderer.setSize(resolution * aspectRatio, resolution);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = 'auto';

    camera.aspect = resolution * aspectRatio / resolution;
    camera.updateProjectionMatrix();
  }

  resize();
  window.addEventListener('resize', resize);

  var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(0, 1, 1);
  scene.add(directionalLight);

  camera.position.z = 5;

  // Unchanging variables
  var length = 1;
  var hex = 0xffff00;
  var dir = new THREE.Vector3(0, 1, 0);
  var rightDir = new THREE.Vector3(1, 0, 0);
  var origin = new THREE.Vector3(1, -6, -15);

  // Variables we update
  var centroidArrow = new THREE.ArrowHelper(dir, origin, length, hex);
  var rolloffArrow = new THREE.ArrowHelper(dir, origin, length, 0x0000ff);
  var rmsArrow = new THREE.ArrowHelper(rightDir, origin, length, 0xff00ff);
  var lines = new THREE.Group(); // Lets create a seperate group for our lines
  // let loudnessLines = new THREE.Group();
  scene.add(centroidArrow);
  scene.add(rolloffArrow);
  scene.add(rmsArrow);

  // Render Spectrogram
  for (var i = 0; i < ffts.length; i++) {
    if (ffts[i]) {
      var geometry = new THREE.BufferGeometry(); // May be a way to reuse this

      var positions = new Float32Array(ffts[i].length * 3);

      geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setDrawRange(0, ffts[i].length);

      var line = new THREE.Line(geometry, material);
      lines.add(line);

      positions = line.geometry.attributes.position.array;
    }
  }

  var bufferLineGeometry = new THREE.BufferGeometry();
  var bufferLine = new THREE.Line(bufferLineGeometry, material);
  {
    var _positions = new Float32Array(bufferSize * 3);
    bufferLineGeometry.addAttribute('position', new THREE.BufferAttribute(_positions, 3));
    bufferLineGeometry.setDrawRange(0, bufferSize);

    _positions = bufferLine.geometry.attributes.position.array;
  }
  scene.add(bufferLine);
  scene.add(lines);

  // scene.add(loudnessLines);

  var features = null;
  var chromaWrapper = document.querySelector('#chroma');
  var chromaChildren = Array.from(chromaWrapper.children);
  var mfccWrapper = document.querySelector('#mfcc');
  var mfccChildren = Array.from(mfccWrapper.children);

  // function autoCorrelation(arr) {
  //   var ac = new Float32Array(arr.length);
  //   for (var lag = 0; lag < arr.length; lag++) {
  //     var value = 0;
  //     for (var index = 0; index < arr.length - lag; index++) {
  //       let a = arr[index];
  //       let otherindex = index - lag;
  //       let b = otherindex >= 0 ? arr[otherindex] : 0;
  //       value = value + a * b;
  //     }
  //     ac[lag] = value;
  //   }
  //   return ac;
  // }

  function autoCorrelation(buffer) {
    var magnitudeSpectrum = fft(buffer);
    var powerSpectrum = {
      real: magnitudeSpectrum.real.map(function (n) {
        return Math.pow(n, 2);
      }),
      imag: magnitudeSpectrum.imag.map(function (n) {
        return Math.pow(n, 2);
      })
    };
    var ac = ifft(powerSpectrum);
    return ac.real;
  }

  function normalize(arr) {
    return arr;
    var max = Math.max.apply(Math, arr);
    var min = Math.min.apply(Math, arr);
    var magnitude = Math.max(max, Math.abs(min));
    return arr.map(function (n) {
      return n / magnitude;
    });
  }

  function renderChroma() {
    features.chroma.forEach(function (v, index) {
      chromaChildren[index].style.setProperty('--band-value', 'rgba(0,' + Math.round(255 * v) + ',0,1)');
    });
  }

  function renderMfcc() {
    features.mfcc.forEach(function (v, index) {
      mfccChildren[index].style.setProperty('--band-value', 'rgba(0,' + Math.round(v + 25) * 5 + ',0,1)');
    });
  }

  function renderFft() {
    for (var _i = 0; _i < ffts.length; _i++) {
      var positions = lines.children[_i].geometry.attributes.position.array;
      var index = 0;

      for (var j = 0; j < ffts[_i].length * 3; j++) {
        positions[index++] = 10.7 + 8 * Math.log10(j / ffts[_i].length);
        positions[index++] = -5 + 0.1 * ffts[_i][j];
        // TODO: I think we can improve performance by caching the shapes and
        // pushing them back once a frame, rather than saving and recalculating
        // the shapes from the saved FFT each time.
        positions[index++] = -15 - _i;
      }

      lines.children[_i].geometry.attributes.position.needsUpdate = true;
    }
  }

  function renderLoudness() {
    for (var i = 0; i < features.loudness.specific.length; i++) {
      var _geometry = new THREE.Geometry();
      _geometry.vertices.push(new THREE.Vector3(-11 + 22 * i / features.loudness.specific.length, -6 + features.loudness.specific[i] * 3, -15));
      _geometry.vertices.push(new THREE.Vector3(-11 + 22 * i / features.loudness.specific.length + 22 / features.loudness.specific.length, -6 + features.loudness.specific[i] * 3, -15));
      loudnessLines.add(new THREE.Line(_geometry, yellowMaterial));
      _geometry.dispose();
    }

    // for (let c = 0; c < loudnessLines.children.length; c++) {
    //   loudnessLines.remove(loudnessLines.children[c]); //forEach is slow
    // }
  }

  function renderSignalBuffer(windowedSignalBuffer) {
    var positions = bufferLine.geometry.attributes.position.array;
    var index = 0;
    for (var i = 0; i < bufferSize; i++) {
      positions[index++] = -11 + 22 * i / bufferSize;
      positions[index++] = 4 + windowedSignalBuffer[i] * 5;
      positions[index++] = -25;
    }
    bufferLine.geometry.attributes.position.needsUpdate = true;
  }

  function renderArrows() {
    // Render Spectral Centroid Arrow
    if (features.spectralCentroid) {
      // SpectralCentroid is an awesome variable name
      // We're really just updating the x axis
      centroidArrow.position.set(10.7 + 8 * Math.log10(features.spectralCentroid / (bufferSize / 2)), -6, -15);
    }

    // Render Spectral Rolloff Arrow
    if (features.spectralRolloff) {
      // We're really just updating the x axis
      var rolloff = features.spectralRolloff / 22050;
      rolloffArrow.position.set(10.7 + 8 * Math.log10(rolloff), -6, -15);
    }

    // Render RMS Arrow
    if (features.rms) {
      // We're really just updating the y axis
      rmsArrow.position.set(-11, -5 + 10 * features.rms, -15);
    }
  }

  function getFreq(autocorrelationBuffer) {
    var maxLagIndex = 0;
    var maxLag = 0;
    var firstPeakOver = false;
    for (var _i2 = highestDetectablePeriod; _i2 < autocorrelationBuffer.length / 2; _i2++) {
      if (!firstPeakOver && autocorrelationBuffer[_i2] < 0.01) {
        firstPeakOver = true;
      }
      if (firstPeakOver && autocorrelationBuffer[_i2] > maxLag) {
        maxLag = autocorrelationBuffer[_i2];
        maxLagIndex = _i2;
      }
    }

    console.log(1 / maxLagIndex * sampleRate);
  }

  function render() {
    features = a.get(['amplitudeSpectrum', 'spectralCentroid', 'spectralRolloff', 'loudness', 'rms', 'chroma', 'mfcc', 'buffer']);
    if (features) {
      if (chromaWrapper && features.chroma) {
        renderChroma();
      }

      if (mfccWrapper && features.mfcc) {
        renderMfcc();
      }

      ffts.pop();
      ffts.unshift(features.amplitudeSpectrum);
      if (features.rms > 0.05) {
        getFreq(normalize(autoCorrelation(a.meyda._m.signal)));
      }
      var windowedSignalBuffer = a.meyda._m.signal;

      renderFft();

      renderArrows();

      if (windowedSignalBuffer) {
        renderSignalBuffer(windowedSignalBuffer);
      }

      // Render loudness
      // if (features.loudness && features.loudness.specific) {
      //   renderLoudness();
      // }
    }

    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }

  render();
})();

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// memoization of the reversal of different lengths.

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var memoizedReversal = {};
var memoizedZeroBuffers = {};

var constructComplexArray = function constructComplexArray(signal) {
  var complexSignal = {};

  complexSignal.real = signal.real === undefined ? signal.slice() : signal.real.slice();

  var bufferSize = complexSignal.real.length;

  if (memoizedZeroBuffers[bufferSize] === undefined) {
    memoizedZeroBuffers[bufferSize] = Array.apply(null, Array(bufferSize)).map(Number.prototype.valueOf, 0);
  }

  complexSignal.imag = memoizedZeroBuffers[bufferSize].slice();

  return complexSignal;
};

var bitReverseArray = function bitReverseArray(N) {
  if (memoizedReversal[N] === undefined) {
    var maxBinaryLength = (N - 1).toString(2).length; //get the binary length of the largest index.
    var templateBinary = '0'.repeat(maxBinaryLength); //create a template binary of that length.
    var reversed = {};
    for (var n = 0; n < N; n++) {
      var currBinary = n.toString(2); //get binary value of current index.

      //prepend zeros from template to current binary. This makes binary values of all indices have the same length.
      currBinary = templateBinary.substr(currBinary.length) + currBinary;

      currBinary = [].concat(_toConsumableArray(currBinary)).reverse().join(''); //reverse
      reversed[n] = parseInt(currBinary, 2); //convert to decimal
    }
    memoizedReversal[N] = reversed; //save
  }
  return memoizedReversal[N];
};

// complex multiplication
var multiply = function multiply(a, b) {
  return {
    'real': a.real * b.real - a.imag * b.imag,
    'imag': a.real * b.imag + a.imag * b.real
  };
};

// complex addition
var add = function add(a, b) {
  return {
    'real': a.real + b.real,
    'imag': a.imag + b.imag
  };
};

// complex subtraction
var subtract = function subtract(a, b) {
  return {
    'real': a.real - b.real,
    'imag': a.imag - b.imag
  };
};

// euler's identity e^x = cos(x) + sin(x)
var euler = function euler(kn, N) {
  var x = -2 * Math.PI * kn / N;
  return { 'real': Math.cos(x), 'imag': Math.sin(x) };
};

// complex conjugate
var conj = function conj(a) {
  a.imag *= -1;
  return a;
};

module.exports = {
  bitReverseArray: bitReverseArray,
  multiply: multiply,
  add: add,
  subtract: subtract,
  euler: euler,
  conj: conj,
  constructComplexArray: constructComplexArray
};

/***/ })
/******/ ]);