const windowing = require("../dist/node/windowing");

const blackman128 = require("./data/blackman128.json");
const blackman256 = require("./data/blackman256.json");
const blackman512 = require("./data/blackman512.json");
const blackman1024 = require("./data/blackman1024.json");
const blackman2048 = require("./data/blackman2048.json");
const hanning128 = require("./data/hanning128.json");
const hanning256 = require("./data/hanning256.json");
const hanning512 = require("./data/hanning512.json");
const hanning1024 = require("./data/hanning1024.json");
const hanning2048 = require("./data/hanning2048.json");
const hamming128 = require("./data/hamming128.json");
const hamming256 = require("./data/hamming256.json");
const hamming512 = require("./data/hamming512.json");
const hamming1024 = require("./data/hamming1024.json");
const hamming2048 = require("./data/hamming2048.json");
const sine128 = require("./data/sine128.json");
const sine256 = require("./data/sine256.json");
const sine512 = require("./data/sine512.json");
const sine1024 = require("./data/sine1024.json");
const sine2048 = require("./data/sine2048.json");

describe("windowing", () => {
  test("should generate a correct 128 bin blackman window", (done) => {
    expect(windowing.blackman(128)).toEqual(Float32Array.from(blackman128));
    done();
  });

  test("should generate a correct 256 bin blackman window", (done) => {
    expect(windowing.blackman(256)).toEqual(Float32Array.from(blackman256));
    done();
  });

  test("should generate a correct 512 bin blackman window", (done) => {
    expect(windowing.blackman(512)).toEqual(Float32Array.from(blackman512));
    done();
  });

  test("should generate a correct 1024 bin blackman window", (done) => {
    expect(windowing.blackman(1024)).toEqual(Float32Array.from(blackman1024));
    done();
  });

  test("should generate a correct 2048 bin blackman window", (done) => {
    expect(windowing.blackman(2048)).toEqual(Float32Array.from(blackman2048));
    done();
  });

  test("should generate a correct 128 bin hanning window", (done) => {
    expect(windowing.hanning(128)).toEqual(Float32Array.from(hanning128));
    done();
  });

  test("should generate a correct 256 bin hanning window", (done) => {
    expect(windowing.hanning(256)).toEqual(Float32Array.from(hanning256));
    done();
  });

  test("should generate a correct 512 bin hanning window", (done) => {
    expect(windowing.hanning(512)).toEqual(Float32Array.from(hanning512));
    done();
  });

  test("should generate a correct 1024 bin hanning window", (done) => {
    expect(windowing.hanning(1024)).toEqual(Float32Array.from(hanning1024));
    done();
  });

  test("should generate a correct 2048 bin hanning window", (done) => {
    expect(windowing.hanning(2048)).toEqual(Float32Array.from(hanning2048));
    done();
  });

  test("should generate a correct 128 bin hamming window", (done) => {
    expect(windowing.hamming(128)).toEqual(Float32Array.from(hamming128));
    done();
  });

  test("should generate a correct 256 bin hamming window", (done) => {
    expect(windowing.hamming(256)).toEqual(Float32Array.from(hamming256));
    done();
  });

  test("should generate a correct 512 bin hamming window", (done) => {
    expect(windowing.hamming(512)).toEqual(Float32Array.from(hamming512));
    done();
  });

  test("should generate a correct 1024 bin hamming window", (done) => {
    expect(windowing.hamming(1024)).toEqual(Float32Array.from(hamming1024));
    done();
  });

  test("should generate a correct 2048 bin hamming window", (done) => {
    expect(windowing.hamming(2048)).toEqual(Float32Array.from(hamming2048));
    done();
  });

  test("should generate a correct 128 bin sine window", (done) => {
    expect(windowing.sine(128)).toEqual(Float32Array.from(sine128));
    done();
  });

  test("should generate a correct 256 bin sine window", (done) => {
    expect(windowing.sine(256)).toEqual(Float32Array.from(sine256));
    done();
  });

  test("should generate a correct 512 bin sine window", (done) => {
    expect(windowing.sine(512)).toEqual(Float32Array.from(sine512));
    done();
  });

  test("should generate a correct 1024 bin sine window", (done) => {
    expect(windowing.sine(1024)).toEqual(Float32Array.from(sine1024));
    done();
  });

  test("should generate a correct 2048 bin sine window", (done) => {
    expect(windowing.sine(2048)).toEqual(Float32Array.from(sine2048));
    done();
  });
});
