var fs = require("fs");

// Setup
var featureExtractors = require("../dist/node/featureExtractors");

describe("featureExtractors", () => {
  test("should provide all of the feature extractors", () => {
    var featureExtractorsProvided = fs.readdirSync("./dist/node/extractors", {
      withFileTypes: true,
    });
    featureExtractorsProvided = featureExtractorsProvided
      .filter((value) => value.isFile())
      .map(function ({ name }) {
        return name.substr(0, name.lastIndexOf(".")) || name;
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
