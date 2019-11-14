export default `
// import PROCESSOR_NAME from './MeydaAnalyzerWorkletNode';
const PROCESSOR_NAME='meydaanalyzer'
// If I understand correctly, process will be called for each web audio render quantum
// https://webaudio.github.io/web-audio-api/#render-quantum
// https://webaudio.github.io/web-audio-api/#dom-audioworkletprocessor-process
// We'll need to buffer things ourselves here if we wish to let users set buffer size, which I think we do

registerProcessor(PROCESSOR_NAME, class extends AudioWorkletProcessor {
  constructor(options) {
    super();

    this._inputs = [];

    this.port.onmessage = function(message) {
      if (message.data.type === 'requestExtractedFeatures') {
        // Here is where we would extract the audio features
        // I stopped here because it required a lot of build work to have this file be a real JS
        // file that is bundled, so it can import Meyda (not that we want two copies of Meyda...)
        // Hope to get back to this soon.
        const features = {};

        this.port.postMessage({type: 'receiveExtractedFeatures', features});
      }
    }
  }

  process(inputs, outputs, parameters) {
    this._inputs = inputs;
    return false;
  }
});

`;