var fs = require("fs");

// Setup
var featureExtractors = require("../dist/node/featureExtractors");

describe("featureExtractors", () => {
  test("should provide all of the feature extractors", () => {
    var featureExtractorsProvided = fs.readdirSync("./dist/node/extractors");
    featureExtractorsProvided = featureExtractorsProvided.map(function (value) {
      return value.substr(0, value.lastIndexOf(".")) || value;
    });

    featureExtractorsProvided.push("buffer");
    featureExtractorsProvided.push("complexSpectrum");
    featureExtractorsProvided.push("amplitudeSpectrum");
    featureExtractorsProvided.splice(
      featureExtractorsProvided.indexOf("extractorUtilities"),
      1
    );

    expect(new Set(Object.keys(featureExtractors))).toEqual(
      new Set(featureExtractorsProvided)
    );
  });
});
