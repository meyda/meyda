import { configureMeyda } from "./new-extract";

const extract = configureMeyda();
const result = extract(["chroma", "zcr", "loudness"], []);

function myExtractor(buffer: Parameters<typeof extract>[1]) {
  return extract(["chroma", "zcr", "loudness"], buffer);
}

result.loudness;

let r = myExtractor([new Float32Array(512), new Float32Array(512)]);
