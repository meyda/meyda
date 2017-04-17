(function () {
  'use strict';

  const bufferSize = 1024;
  let Audio = require('./audio');
  let a = new Audio(bufferSize);

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

  var renderer = new THREE.WebGLRenderer({ canvas: document.querySelector("canvas") });

  function resize() {
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = 'auto';

    var resolution = renderer.domElement.clientWidth / 16 * 10;
    renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);

    renderer.setSize(resolution * aspectRatio, resolution);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = 'auto';

    camera.aspect = (resolution * aspectRatio) / resolution;
    camera.updateProjectionMatrix();
  }

  resize();
  window.addEventListener('resize', resize);

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
    }
  }

  let bufferLineGeometry = new THREE.BufferGeometry();
  let bufferLine = new THREE.Line(bufferLineGeometry, material);
  {
    let positions = new Float32Array(bufferSize * 3);
    bufferLineGeometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
    bufferLineGeometry.setDrawRange(0, bufferSize);

    positions = bufferLine.geometry.attributes.position.array;
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
          positions[index++] = 10.7 + (8 * Math.log10(j/ffts[i].length));
          positions[index++] = -5 + 2 * ffts[i][j];
          positions[index++] = -15 - i;
        }

        lines.children[i].geometry.attributes.position.needsUpdate = true;
      }

      // Render Spectral Centroid Arrow
      if (features.spectralCentroid) {
        // SpectralCentroid is an awesome variable name
        // We're really just updating the x axis
        centroidArrow.position.set(10.7 + (8 * Math.log10(features.spectralCentroid / (bufferSize / 2))), -6, -15);
      }

      // Render Spectral Rolloff Arrow
      if (features.spectralRolloff) {
        // We're really just updating the x axis
        var rolloff = (features.spectralRolloff / 22050);
        rolloffArrow.position.set(10.7 + (8 * Math.log10(rolloff)), -6, -15);
      }
      // Render RMS Arrow
      if (features.rms) {
        // We're really just updating the y axis
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
