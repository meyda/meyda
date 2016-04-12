(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function () {
  var _this;
  const Audio = function (bufferSize) {
    this.context = new AudioContext();

    this.synthesizer = {};
    this.synthesizer.out = this.context.createGain();

    this.meyda = Meyda.createMeydaAnalyzer({
      audioContext: this.context,
      source: this.synthesizer.out,
      bufferSize: bufferSize,
      windowingFunction: 'blackman',
    });
    _this = this;
    this.initializeMicrophoneSampling();
  };

  Audio.prototype.initializeMicrophoneSampling = function () {
    console.groupCollapsed('Initializing Microphone Sampling');
    navigator.getUserMedia = navigator.webkitGetUserMedia ||
      navigator.getUserMedia;
    var constraints = { video: false, audio: true };
    var successCallback = function (mediaStream) {
      console.log('User allowed microphone access.');
      console.log('Initializing AudioNode from MediaStream');
      var source = _this.context.createMediaStreamSource(mediaStream);
      console.log('Setting Meyda Source to Microphone');
      _this.meyda.setSource(source);
      console.groupEnd();
    };

    var errorCallback = function (err) {
      // We should fallback to an audio file here, but that's difficult on mobile
      console.err('Error: ', err);
      console.groupEnd();
    };

    try {
      console.log('Asking for permission...');
      navigator.getUserMedia(
        constraints,
        successCallback,
        errorCallback
      );
    }
    catch (e) {
      var p = navigator.mediaDevices.getUserMedia(constraints);
      p.then(successCallback);
      p.catch(errorCallback);
    }
  };

  Audio.prototype.get = function (features) {
    return _this.meyda.get(features);
  };

  module.exports = Audio;
})();

},{}],2:[function(require,module,exports){
(function () {
  'use strict';
  const bufferSize = 1024;
  let Audio = require('./audio');
  let a = new Audio(bufferSize);

  var resolution = document.querySelector('hr').offsetWidth/16*10;
  var aspectRatio = 16 / 10;
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(40, aspectRatio, 0.1, 1000);

  var initializeFFTs = function (number, pointCount) {
    var ffts = [];
    for (var i = 0; i < number; i++) {
      ffts.push(Array.apply(null, Array(pointCount)).map(
        Number.prototype.valueOf, 0
      ));
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

  var renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
  renderer.setSize(resolution * aspectRatio, resolution);
  window.addEventListener('resize', function(){
    let canvasWidth = document.querySelector('hr').offsetWidth;
    resolution = canvasWidth/16*10;
    renderer.setSize(resolution * aspectRatio, resolution);
    renderer.domElement.height = resolution;
    renderer.domElement.width = canvasWidth;
  });
  document.querySelector('#showcase').appendChild(renderer.domElement);

  var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(0, 1, 1);
  scene.add(directionalLight);

  camera.position.z = 5;

  // Unchanging variables
  const length = 1;
  const hex = 0xffff00;
  const dir = new THREE.Vector3(0, 1, 0);
  const rightDir = new THREE.Vector3(1, 0, 0);
  const origin = new THREE.Vector3(1, -6, -15);

  // Variables we update
  let centroidArrow = new THREE.ArrowHelper(dir, origin, length, hex);
  let rolloffArrow = new THREE.ArrowHelper(dir, origin, length, 0x0000ff);
  let rmsArrow = new THREE.ArrowHelper(rightDir, origin, length, 0xff00ff);
  let lines = new THREE.Group(); // Lets create a seperate group for our lines
  // let loudnessLines = new THREE.Group();
  scene.add(centroidArrow);
  scene.add(rolloffArrow);
  scene.add(rmsArrow);

  // Render Spectrogram
  for (let i = 0; i < ffts.length; i++) {
    if (ffts[i]) {
      let geometry = new THREE.BufferGeometry(); // May be a way to reuse this

      let positions = new Float32Array(ffts[i].length * 3);

      geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setDrawRange(0, ffts[i].length);

      let line = new THREE.Line(geometry, material);
      lines.add(line);

      positions = line.geometry.attributes.position.array;
      let index = 0;

      for (let j = 0; j < ffts[i].length; j++) {
        positions[index++] = -11 + (22 * j / ffts[i].length);
        positions[index++] = -5 + ffts[i][j];
        positions[index++] = -15 - i;
      }
    }
  }

  let bufferLineGeometry = new THREE.BufferGeometry();
  let bufferLine = new THREE.Line(bufferLineGeometry, material);
  {
    let positions = new Float32Array(bufferSize*3);
    bufferLineGeometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
    bufferLineGeometry.setDrawRange(0, bufferSize);
    positions = bufferLine.geometry.attributes.position.array;
    let index = 0;
    for (let i = 0; i < bufferSize; i++){
      positions[index++] = -11 + 22 * i / bufferSize;
      positions[index++] = 4;
      positions[index++] = -25;
    }
  }
  scene.add(bufferLine);
  scene.add(lines);

  // scene.add(loudnessLines);

  let features = null;

  function render() {
    features = a.get([
      'amplitudeSpectrum',
      'spectralCentroid',
      'spectralRolloff',
      'loudness',
      'rms',
    ]);
    if (features) {
      ffts.pop();
      ffts.unshift(features.amplitudeSpectrum);
      const windowedSignalBuffer = a.meyda._m.signal;

      for (let i = 0; i < ffts.length; i++) {
        var positions = lines.children[i].geometry.attributes.position.array;
        var index = 0;

        for (var j = 0; j < ffts[i].length*3; j++) {
          positions[index++] = -11 + (22 * j / ffts[i].length);
          positions[index++] = -5 + ffts[i][j];
          positions[index++] = -15 - i;
        }

        lines.children[i].geometry.attributes.position.needsUpdate = true;
      }

      // Render Spectral Centroid Arrow
      if (features.spectralCentroid) {
        // SpectralCentroid is an awesome variable name
        // We're really just updating the x axis
        centroidArrow.position.set(-11 +
          (22 * features.spectralCentroid / bufferSize / 2), -6, -15);
      }

      // Render Spectral Rolloff Arrow
      if (features.spectralRolloff) {
        // We're really just updating the x axis
        rolloffArrow.position.set(
          -11 + (features.spectralRolloff / 44100 * 22), -6, -15);
      }
      // Render RMS Arrow
      if (features.rms) {
        // We're really just updating the x axis
        rmsArrow.position.set(-11, -5 + (10 * features.rms), -15);
      }

      if (windowedSignalBuffer) {
        // Render Signal Buffer
        let positions = bufferLine.geometry.attributes.position.array;
        let index = 0;
        for (var i = 0; i < bufferSize; i++){
          positions[index++] = -11 + 22 * i / bufferSize;
          positions[index++] = 4 + (windowedSignalBuffer[i] * 5);
          positions[index++] = -25;
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

},{"./audio":1}]},{},[2]);
