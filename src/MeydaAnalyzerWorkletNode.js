export const PROCESSOR_NAME = 'meydaanalyzer';
import MEYDA_WORKLET_PROCESSOR from './MeydaAnalyzerWorkletProcessor';

class MeydaAnalyzerWorkletNode extends AudioWorkletNode {
  constructor({
    audioContext
  }, Meyda) {
    super(audioContext, PROCESSOR_NAME, {
      numberOfInputs: 1,
      numberOfOutputs: 0,
      channelCount: 1,
    });

    this.port.onmessage = event => {
      if (event.data.type === 'receiveExtractedFeatures') {
        
        this.port.postMessage({extractedFeatures:this._extractedFeatures});
        this._extractedFeatures = event.data.features;
      }
    };

  }

  get(featureList) {
    // This method will fire off a new request for a feature extraction, and return whatever is *currently* stored
    // That's pretty unfortunate for things that need the realtime features, but given the nature of
    // requestAnimationFrame and postMessage, I haven't quite found a clever way out of it just yet.
    // I imagine we'll do something like always post the features for every buffer, but I need to
    // look into the thread model of audio worklet first to understand the performance impact
    this.port.postMessage({type: 'requestExtractedFeatures', featureList})
    return this._extractedFeatures;
  }
}

export default function createMeydaAnalyzerWorkletNode(options, Meyda) {
  const { audioContext } = options;

  const blob = new Blob([ MEYDA_WORKLET_PROCESSOR ], { type: 'application/javascript; charset=utf-8' });
  const url = URL.createObjectURL(blob);

  return new Promise((resolve, reject) => {
    audioContext.audioWorklet.addModule(url).then(() => {
      resolve(new MeydaAnalyzerWorkletNode(options, Meyda));
    }).catch(console.log);
  });
}