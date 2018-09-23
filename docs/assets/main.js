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
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
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

    if (navigator.hasOwnProperty('webkitGetUserMedia') && !navigator.hasOwnProperty('getUserMedia')) {
      navigator.getUserMedia = webkitGetUserMedia;
      if (!AudioContext.prototype.hasOwnProperty('createScriptProcessor')) {
        AudioContext.prototype.createScriptProcessor = AudioContext.prototype.createJavaScriptNode;
      }
    }

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
      navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.getUserMedia || navigator.mediaDevices.getUserMedia;
      var constraints = { video: false, audio: true };
      var successCallback = function successCallback(mediaStream) {
        document.getElementById('audioControl').style.display = 'none';
        console.log('User allowed microphone access.');
        console.log('Initializing AudioNode from MediaStream');
        var source = _this.context.createMediaStreamSource(mediaStream);
        console.log('Setting Meyda Source to Microphone');
        _this.meyda.setSource(source);
        console.groupEnd();
      };

      console.log('Asking for permission...');
      var getUserMediaPromise = navigator.getUserMedia(constraints, successCallback, errorCallback);
      if (getUserMediaPromise) {
        p.then(successCallback);
        p.catch(errorCallback);
      }
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


(function () {
  'use strict';

  var scale = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'G#', 'A', 'Bb', 'B'];
  var bufferSize = 1024;
  var Audio = __webpack_require__(0);
  var a = new Audio(bufferSize);

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
  var mfccWrapper = document.querySelector('#mfcc');

  function render() {
    features = a.get(['amplitudeSpectrum', 'spectralCentroid', 'spectralRolloff', 'loudness', 'rms', 'chroma', 'mfcc']);
    if (features) {
      if (chromaWrapper && features.chroma) {
        chromaWrapper.innerHTML = features.chroma.reduce(function (acc, v, i) {
          return acc + '\n          <div class="chroma-band" style="background-color: rgba(0,' + Math.round(255 * v) + ',0,1)">' + scale[i] + '</div>';
        }, '');
      }

      if (mfccWrapper && features.mfcc) {
        mfccWrapper.innerHTML = features.mfcc.reduce(function (acc, v, i) {
          return acc + '\n          <div class="mfcc-band" style="background-color: rgba(0,' + Math.round(v + 25) * 5 + ',0,1)">' + i + '</div>';
        }, '');
      }

      ffts.pop();
      ffts.unshift(features.amplitudeSpectrum);
      var windowedSignalBuffer = a.meyda._m.signal;

      for (var _i = 0; _i < ffts.length; _i++) {
        var positions = lines.children[_i].geometry.attributes.position.array;
        var index = 0;

        for (var j = 0; j < ffts[_i].length * 3; j++) {
          positions[index++] = 10.7 + 8 * Math.log10(j / ffts[_i].length);
          positions[index++] = -5 + 0.1 * ffts[_i][j];
          positions[index++] = -15 - _i;
        }

        lines.children[_i].geometry.attributes.position.needsUpdate = true;
      }

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

      if (windowedSignalBuffer) {
        // Render Signal Buffer
        var _positions2 = bufferLine.geometry.attributes.position.array;
        var _index = 0;
        for (var i = 0; i < bufferSize; i++) {
          _positions2[_index++] = -11 + 22 * i / bufferSize;
          _positions2[_index++] = 4 + windowedSignalBuffer[i] * 5;
          _positions2[_index++] = -25;
        }
        bufferLine.geometry.attributes.position.needsUpdate = true;
      }

      // // Render loudness
      // if (features.loudness && features.loudness.specific) {
      //   for (var i = 0; i < features.loudness.specific.length; i++) {
      //     let geometry = new THREE.Geometry();
      //     geometry.vertices.push(new THREE.Vector3(
      //       -11 + 22 * i / features.loudness.specific.length,
      //       -6 + features.loudness.specific[i] * 3,
      //       -15
      //     ));
      //     geometry.vertices.push(new THREE.Vector3(
      //       -11 + 22 * i / features.loudness.specific.length + 22 /
      //       features.loudness.specific.length,
      //       -6 + features.loudness.specific[i] * 3,
      //       -15
      //     ));
      //     loudnessLines.add(new THREE.Line(geometry, yellowMaterial));
      //     geometry.dispose();
      //   }
      // }

      // for (let c = 0; c < loudnessLines.children.length; c++) {
      //   loudnessLines.remove(loudnessLines.children[c]); //forEach is slow
      // }
    }

    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }

  render();
})();

/***/ })
/******/ ]);