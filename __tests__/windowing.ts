import * as windowing from "../dist/node/windowing";

import blackman128 from "./data/blackman128.json";
import blackman256 from "./data/blackman256.json";
import blackman512 from "./data/blackman512.json";
import blackman1024 from "./data/blackman1024.json";
import blackman2048 from "./data/blackman2048.json";
import hanning128 from "./data/hanning128.json";
import hanning256 from "./data/hanning256.json";
import hanning512 from "./data/hanning512.json";
import hanning1024 from "./data/hanning1024.json";
import hanning2048 from "./data/hanning2048.json";
import hamming128 from "./data/hamming128.json";
import hamming256 from "./data/hamming256.json";
import hamming512 from "./data/hamming512.json";
import hamming1024 from "./data/hamming1024.json";
import hamming2048 from "./data/hamming2048.json";
import sine128 from "./data/sine128.json";
import sine256 from "./data/sine256.json";
import sine512 from "./data/sine512.json";
import sine1024 from "./data/sine1024.json";
import sine2048 from "./data/sine2048.json";

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
