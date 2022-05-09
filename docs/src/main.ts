import Audio from "./audio";
import {
  Scene,
  PerspectiveCamera,
  LineBasicMaterial,
  WebGLRenderer,
  DirectionalLight,
  Vector3,
  ArrowHelper,
  Group,
  BufferAttribute,
  BufferGeometry,
  Line,
} from "three";

const scale = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "G#", "A", "Bb", "B"];
const bufferSize = 1024;
const a = new Audio(bufferSize);

const aspectRatio = 16 / 10;
const scene = new Scene();
const camera = new PerspectiveCamera(40, aspectRatio, 0.1, 1000);

const initializeFFTs = function (number, pointCount) {
  const ffts: number[][] = [];
  for (let i = 0; i < number; i++) {
    ffts.push(
      // Array.apply(null, Array(pointCount)).map(Number.prototype.valueOf, 0)
      Array(pointCount).fill(0)
    );
  }

  return ffts;
};

const material = new LineBasicMaterial({
  color: 0x00ff00,
});

// const yellowMaterial = new LineBasicMaterial({
//   color: 0x00ffff,
// });

const ffts = initializeFFTs(20, bufferSize);
// const buffer = null;

const canvas = document.querySelector("canvas");
if (!canvas) {
  throw new Error("Canvas element not found");
}
const renderer = new WebGLRenderer({
  canvas,
});

function resize() {
  renderer.domElement.style.width = "100%";
  renderer.domElement.style.height = "auto";

  const resolution = (renderer.domElement.clientWidth / 16) * 10;
  renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);

  renderer.setSize(resolution * aspectRatio, resolution);
  renderer.domElement.style.width = "100%";
  renderer.domElement.style.height = "auto";

  camera.aspect = (resolution * aspectRatio) / resolution;
  camera.updateProjectionMatrix();
}

resize();
window.addEventListener("resize", resize);

const directionalLight = new DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(0, 1, 1);
scene.add(directionalLight);

camera.position.z = 5;

// Unchanging variables
const length = 1;
const hex = 0xffff00;
const dir = new Vector3(0, 1, 0);
const rightDir = new Vector3(1, 0, 0);
const origin = new Vector3(1, -6, -15);

// Variables we update
const centroidArrow = new ArrowHelper(dir, origin, length, hex);
const rolloffArrow = new ArrowHelper(dir, origin, length, 0x0000ff);
const rmsArrow = new ArrowHelper(rightDir, origin, length, 0xff00ff);
const lines = new Group(); // Lets create a seperate group for our lines
// let loudnessLines = new Group();
scene.add(centroidArrow);
scene.add(rolloffArrow);
scene.add(rmsArrow);

// Render Spectrogram
for (let i = 0; i < ffts.length; i++) {
  if (ffts[i]) {
    const geometry = new BufferGeometry(); // May be a way to reuse this

    let positions: ArrayLike<number> = new Float32Array(ffts[i].length * 3);

    geometry.addAttribute("position", new BufferAttribute(positions, 3));
    geometry.setDrawRange(0, ffts[i].length);

    const line = new Line(geometry, material);
    lines.add(line);

    positions = line.geometry.attributes.position.array;
  }
}

const bufferLineGeometry = new BufferGeometry();
const bufferLine = new Line(bufferLineGeometry, material);
{
  let positions: ArrayLike<number> = new Float32Array(bufferSize * 3);
  bufferLineGeometry.addAttribute(
    "position",
    new BufferAttribute(positions, 3)
  );
  bufferLineGeometry.setDrawRange(0, bufferSize);

  positions = bufferLine.geometry.attributes.position.array;
}
scene.add(bufferLine);
scene.add(lines);

// scene.add(loudnessLines);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let features: { [key: string]: any } | undefined = undefined;
const chromaWrapper = document.querySelector("#chroma");
const mfccWrapper = document.querySelector("#mfcc");

function render() {
  features = a.get([
    "amplitudeSpectrum",
    "spectralCentroid",
    "spectralRolloff",
    "loudness",
    "rms",
    "chroma",
    "mfcc",
  ]);
  if (features) {
    if (chromaWrapper && features.chroma) {
      chromaWrapper.innerHTML = features.chroma.reduce(
        (acc, v, i) =>
          `${acc}
          <div class="chroma-band" style="background-color: rgba(0,${Math.round(
            255 * v
          )},0,1)">${scale[i]}</div>`,
        ""
      );
    }

    if (mfccWrapper && features.mfcc) {
      mfccWrapper.innerHTML = features.mfcc.reduce(
        (acc, v, i) =>
          `${acc}
          <div class="mfcc-band" style="background-color: rgba(0,${
            Math.round(v + 25) * 5
          },0,1)">${i}</div>`,
        ""
      );
    }

    ffts.pop();
    ffts.unshift(features.amplitudeSpectrum);
    const windowedSignalBuffer = a.meyda._m.signal;

    for (let i = 0; i < ffts.length; i++) {
      // @ts-ignore
      const positions = lines.children[i].geometry.attributes.position.array;
      let index = 0;

      for (let j = 0; j < ffts[i].length * 3; j++) {
        positions[index++] = 10.7 + 8 * Math.log10(j / ffts[i].length);
        positions[index++] = -5 + 0.1 * ffts[i][j];
        positions[index++] = -15 - i;
      }

      // @ts-ignore
      lines.children[i].geometry.attributes.position.needsUpdate = true;
    }

    // Render Spectral Centroid Arrow
    if (features.spectralCentroid) {
      // SpectralCentroid is an awesome variable name
      // We're really just updating the x axis
      centroidArrow.position.set(
        10.7 + 8 * Math.log10(features.spectralCentroid / (bufferSize / 2)),
        -6,
        -15
      );
    }

    // Render Spectral Rolloff Arrow
    if (features.spectralRolloff) {
      // We're really just updating the x axis
      const rolloff = features.spectralRolloff / 22050;
      rolloffArrow.position.set(10.7 + 8 * Math.log10(rolloff), -6, -15);
    }
    // Render RMS Arrow
    if (features.rms) {
      // We're really just updating the y axis
      rmsArrow.position.set(-11, -5 + 10 * features.rms, -15);
    }

    if (windowedSignalBuffer) {
      // Render Signal Buffer
      const positions = bufferLine.geometry.attributes.position.array;
      let index = 0;
      for (let i = 0; i < bufferSize; i++) {
        // @ts-ignore
        positions[index++] = -11 + (22 * i) / bufferSize;
        // @ts-ignore
        positions[index++] = 4 + windowedSignalBuffer[i] * 5;
        // @ts-ignore
        positions[index++] = -25;
      }
      bufferLine.geometry.attributes.position.needsUpdate = true;
    }

    // // Render loudness
    // if (features.loudness && features.loudness.specific) {
    //   for (let i = 0; i < features.loudness.specific.length; i++) {
    //     let geometry = new Geometry();
    //     geometry.vertices.push(new Vector3(
    //       -11 + 22 * i / features.loudness.specific.length,
    //       -6 + features.loudness.specific[i] * 3,
    //       -15
    //     ));
    //     geometry.vertices.push(new Vector3(
    //       -11 + 22 * i / features.loudness.specific.length + 22 /
    //       features.loudness.specific.length,
    //       -6 + features.loudness.specific[i] * 3,
    //       -15
    //     ));
    //     loudnessLines.add(new Line(geometry, yellowMaterial));
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
