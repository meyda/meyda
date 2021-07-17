var util = require("../dist/node/utilities");

describe("isPowerOfTwo", () => {
  test("should validate all powers of two", (done) => {
    for (var i = 0; i < 1000; i++) {
      const result = util.isPowerOfTwo(Math.pow(2, i));
      if (result !== true) {
        done(new Error("isPowerOfTwo failed for " + i));
      }
    }

    done();
  });

  test("should fail for non-powers of two", (done) => {
    expect(util.isPowerOfTwo(3)).toBe(false);
    expect(util.isPowerOfTwo(348)).toBe(false);
    expect(util.isPowerOfTwo(29384)).toBe(false);
    expect(util.isPowerOfTwo(3489410)).toBe(false);
    done();
  });
});

describe("error", () => {
  test("throws an error with the correct message", (done) => {
    var message = "Test Error Message";
    expect(function () {
      util.error(message);
    }).toThrow();

    done();
  });
});

describe("pointwiseBufferMult", () => {
  test("multiplies two arrays correctly", (done) => {
    expect(util.pointwiseBufferMult([4, 5, 6], [0.5, 2, 2])).toEqual([
      2, 10, 12,
    ]);
    done();
  });

  test("handles differently sized arrays correctly", (done) => {
    expect(util.pointwiseBufferMult([4, 0.25, 0.7], [0.25, 2])).toEqual([
      1, 0.5,
    ]);
    done();
  });
});

describe("applyWindow", () => {
  test("applies a windowing function to a buffer", (done) => {
    expect(util.applyWindow([1, 4, 6], "hanning")).toEqual([0, 4, 0]);
    done();
  });
});

describe("frame", () => {
  test("returns the expected number of frames for hop size < buffer size", () => {
    const frames = util.frame(new Array(2048).fill(0), 1024, 512);
    expect(frames.length).toEqual(3);
  });

  test("returns the expected number of frames for hop size === buffer size", () => {
    const frames = util.frame(new Array(2048).fill(0), 1024, 1024);
    expect(frames.length).toEqual(2);
  });

  test("returns the expected number of frames where buffer size isn't a hop size multiple", () => {
    const frames = util.frame(new Array(2048).fill(0), 1024, 500);
    expect(frames.length).toEqual(3);
  });
});
