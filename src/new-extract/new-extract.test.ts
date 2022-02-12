import { configureMeyda, configureMeydaWithExtractors, curryMeyda } from ".";
import { MeydaAudioFeature, MeydaSignal } from "../main";

const DUMMY_SIGNAL = new Float32Array(512);
const features = ["chroma", "zcr", "loudness"] as const;

describe("the dynamically generated result map type", () => {
  test("is returned by the extractor created with `configureMeyda`", () => {
    // `configureMeyda` should return a function that takes a set of audio
    // features as either a string or a list of strings, plus a MeydaSignal.
    // That function should return a map keyed by the specific audio features
    // that are requested, with the corresponding values for each specific
    // feature extractor.
    const extract = configureMeyda();
    const result = extract(features, DUMMY_SIGNAL);

    // I'm conflicted about these tests. I want to assert the result type of
    // the call to the extractor without necessarily knowing the type of the
    // underlying extractors.
    expect(result.chroma.constructor).toBe(Float32Array);
    expect(result.loudness.specific).toBe(Float32Array);
    expect(typeof result.loudness.total).toBe("number");
    expect(typeof result.zcr).toBe("number");

    // The spirit of this assertion is to check that the result type doesn't
    // contain properties based on feature extractors other than what we
    // passed in as features. But, the result type would always be assignable
    // to a type that contains additional properties. And we don't want this
    // test to be aware of every single feature extractor, and their return
    // type. So, I'll settle for just checking that rms doesn't exist on the
    // result.

    // @ts-expect-error
    expect(typeof result.rms).toBe("undefined");
  });

  test("is correct when the features argument is a single element", () => {
    const extract = configureMeyda();
    const result = extract("chroma", DUMMY_SIGNAL);

    expect(result.chroma.constructor).toBe(Float32Array);
    // @ts-expect-error
    result.rms;
  });

  // test("is correct when the call to extract is wrapped in a function", () => {
  //   const extract = configureMeyda();

  //   function myExtractor(buffer: Parameters<typeof extract>[1]) {
  //     return extract(features, buffer);
  //   }

  //   let r = myExtractor(DUMMY_SIGNAL);
  //   // @ts-expect-error
  //   r.rms;
  // });
  test("is a list when the signal parameter is a list", () => {
    // This supports multichannel use cases, and is critical to support at
    // this level, since in order to handle multichannel, Meyda needs to store
    // the history of each channel.

    // Alternatively, we could use this interface to suport a multichannel
    // wrapper construct.

    const extract = configureMeyda();

    let r = extract(features, [DUMMY_SIGNAL, DUMMY_SIGNAL]);
    // @ts-expect-error
    r.rms;
  });
  test("is a list when the signal parameter is a list and features is single", () => {
    // This supports multichannel use cases, and is critical to support at
    // this level, since in order to handle multichannel, Meyda needs to store
    // the history of each channel.

    // Alternatively, we could use this interface to suport a multichannel
    // wrapper construct.

    const extract = configureMeyda();

    let r = extract("mfcc", [DUMMY_SIGNAL, DUMMY_SIGNAL]);
    // @ts-expect-error
    r.rms;
    expect(r).toHaveLength(2);
    expect(r[0].mfcc[0]).not.toBeUndefined();
    expect(r[1].mfcc[0]).not.toBeUndefined();
  });
});

describe("multichannel-support", () => {
  it("returns an array of the appropriate result type", () => {
    const extract = configureMeyda();
    const result = extract("zcr", [DUMMY_SIGNAL, DUMMY_SIGNAL]);
    expect(result[0].zcr).toBe(0);
    expect(result[1].zcr).toBe(0);
    expect(result.length).toBe(2);
  });
  it("returns a single MeydaResult for a single input signal", () => {
    const extract = configureMeyda();
    const result = extract("zcr", DUMMY_SIGNAL);
    expect(result.zcr).toBe(0);
  });
});

describe.skip("configureMeydaWithExtractors", () => {
  // test("is not refined when the features are not a const type", () => {
  //   // In this case we would ideally want the result to have type
  //   // Partial<MeydaResult<MeydaAudioFeature>> rather than have NonNullable
  //   // fields. As it stands, the type is something like { [T in
  //   // MeydaAudioFeature]: any} (any is actually the specific result type of the
  //   // correspinding audio feature). If the features parameter is
  //   // MeydaAudioFeature[], not const, that type expands and contains every pair
  //   // of feature extractor and the corresponding result. If the expansion is
  //   // triggered, we need the object to be Partial so that the caller has to
  //   // check the values. If the features parameter is const with specific known
  //   // values of MeydaAudioFeature, the type is expanded properly to known key
  //   // value pairs of the audio feature key and corresponding specific result
  //   // type.
  //   const features: MeydaAudioFeature[] = ["zcr"];
  //   const myExtractor = configureMeydaWithExtractors(features);
  //   let r = myExtractor(DUMMY_SIGNAL);
  //   // The test is that this should be allowed
  //   r.complexSpectrum;
  // });
  test("is correct when we use `configureMeydaWithExtractors", () => {
    const myExtractor = configureMeydaWithExtractors(features);
    let r = myExtractor(DUMMY_SIGNAL);
    // @ts-expect-error
    r.rms;
  });
  test.skip("is a list when the signal parameter is a list", () => {
    // This supports multichannel use cases, and is critical to support at
    // this level, since in order to handle multichannel, Meyda needs to store
    // the history of each channel.

    // Alternatively, we could use this interface to suport a multichannel
    // wrapper construct.

    const myExtractor = configureMeydaWithExtractors(features);

    // DELETE
    // @ts-expect-error
    let r = myExtractor([DUMMY_SIGNAL, DUMMY_SIGNAL]);
    // @ts-expect-error
    r.rms;
  });
});

describe.skip("curryMeyda", () => {
  test("is correct when the internal `curryMeyda` function wraps the extractor", () => {
    const extract = configureMeyda();
    const myExtractor = curryMeyda(features, extract);
    let r = myExtractor(DUMMY_SIGNAL);
    // @ts-expect-error
    r.rms;
  });
  test("is correct when the internal `curryMeyda` function wraps the extractor", () => {
    const extract = configureMeyda();
    const myExtractor = curryMeyda("zcr", extract);
    let r = myExtractor(DUMMY_SIGNAL);
    // @ts-expect-error
    r.rms;
  });
  test("is correct when the internal `curryMeyda` function wraps the extractor", () => {
    const extract = configureMeyda();
    const myExtractor = curryMeyda(features, extract);
    let r = myExtractor([DUMMY_SIGNAL]);
    // @ts-expect-error
    r.rms;
  });
  test("is correct when the internal `curryMeyda` function wraps the extractor", () => {
    const extract = configureMeyda();
    const myExtractor = curryMeyda(features, extract);
    let r = myExtractor([DUMMY_SIGNAL]);
    // @ts-expect-error
    r.rms;
  });
});

describe.skip("configureMeydaWithExtractors", () => {
  test("is correct when the internal `curryMeyda` function wraps the extractor", () => {
    const extract = configureMeydaWithExtractors(features);
    let r = extract(DUMMY_SIGNAL);
    // @ts-expect-error
    r.rms;
  });
  test("is correct when the internal `curryMeyda` function wraps the extractor", () => {
    const extract = configureMeydaWithExtractors("zcr");
    let r = extract(DUMMY_SIGNAL);
    // @ts-expect-error
    r.rms;
  });
  test("is correct when the internal `curryMeyda` function wraps the extractor", () => {
    const extract = configureMeydaWithExtractors(features);
    let r = extract([DUMMY_SIGNAL]);
    // @ts-expect-error
    r.rms;
  });
  test("is correct when the internal `curryMeyda` function wraps the extractor", () => {
    const extract = configureMeydaWithExtractors("zcr");
    let r = extract([DUMMY_SIGNAL]);
    // @ts-expect-error
    r.rms;
  });
});

describe.skip("configureMeydaWithExtractors", () => {
  test("is correct when the internal `curryMeyda` function wraps the extractor", () => {
    const testFeatures: MeydaAudioFeature[] = [...features];
    const extract = configureMeydaWithExtractors(testFeatures);
    let r = extract(DUMMY_SIGNAL);
    // @ts-expect-error
    r.rms;
  });
  test("is correct when the internal `curryMeyda` function wraps the extractor", () => {
    const extract = configureMeydaWithExtractors("zcr" as MeydaAudioFeature);
    let r = extract(DUMMY_SIGNAL);
    // @ts-expect-error
    r.rms;
  });
  test("is correct when the internal `curryMeyda` function wraps the extractor", () => {
    const extract = configureMeydaWithExtractors(features);
    let r = extract([DUMMY_SIGNAL]);
    // @ts-expect-error
    r.rms;
  });
  test("is correct when the internal `curryMeyda` function wraps the extractor", () => {
    const extract = configureMeydaWithExtractors("zcr");
    let r = extract([DUMMY_SIGNAL]);
    // @ts-expect-error
    r.rms;
  });

  test("", () => {
    const testFeatures: MeydaAudioFeature[] = ["zcr" as MeydaAudioFeature];
    // const testFeatures: ("zcr" | "rms" | "loudness")[] = ["zcr", "rms"];
    testFeatures.push("loudness");

    const extract = configureMeyda();
    const r = extract(testFeatures, DUMMY_SIGNAL);
    extract(testFeatures, DUMMY_SIGNAL);
    extract(testFeatures, DUMMY_SIGNAL);
    extract(testFeatures, DUMMY_SIGNAL);
    extract(testFeatures, DUMMY_SIGNAL);
  });
});
