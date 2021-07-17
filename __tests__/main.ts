var meyda = require("../dist/node/main");
// trick ts into treating this file as a module
export {};

describe("main", () => {
  test("should call an extractor when asked to", (done) => {
    done();
  });

  test("list feature extractors", () => {
    const availableFeatureExtractors = meyda.listAvailableFeatureExtractors();
    expect(Array.isArray(availableFeatureExtractors));
    availableFeatureExtractors.forEach((extractor) => {
      expect(typeof extractor).toBe("string");
    });
  });
});
