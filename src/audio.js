(function () {
  var _this;
  const Audio = function (bufferSize) {
    this.context = new AudioContext();

    this.synthesizer = {};
    this.synthesizer.osc1 = this.context.createOscillator();
    this.synthesizer.osc1.type = 'sawtooth';
    this.synthesizer.osc1.start();

    this.meyda = Meyda.createMeydaAnalyzer({
      audioContext: this.context,
      source: this.synthesizer.osc1,
      bufferSize: bufferSize,
      windowingFunction: 'blackman',
    });
    _this = this;
  };

  Audio.prototype.setWaveformType = function (type) {
    _this.synthesizer.osc1.type = type;
  };

  Audio.prototype.initializeMicrophoneSampling = function () {
    console.groupCollapsed('Initializing Microphone Sampling');
    navigator.getUserMedia = navigator.webkitGetUserMedia ||
      navigator.getUserMedia;
    var constraints = { video: false, audio: true };
    var successCallback = function (mediaStream) {
      console.log('User allowed microphone access.');
      console.log('Initializing AudioNode from MediaStream');
      var source = _this.context.createMediaStreamSource(mediaStream);
      console.log('Setting Meyda Source to Microphone');
      _this.meyda.setSource(source);
      console.log('Disconnecting synthesizer');
      self.synthesizer.osc1.disconnect();
      console.groupEnd();
    };

    var errorCallback = function (err) {
      console.err('Error: ', err);
      console.groupEnd();
    };

    try {
      console.log('Asking for permission...');
      navigator.getUserMedia(
        constraints,
        successCallback,
        errorCallback
      );
    }
    catch (e) {
      var p = navigator.mediaDevices.getUserMedia(constraints);
      p.then(successCallback);
      p.catch(errorCallback);
    }
  };

  Audio.prototype.get = function (features) {
    return _this.meyda.get(features);
  };

  module.exports = Audio;
})();
