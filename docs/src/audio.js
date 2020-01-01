(function () {
  var _this;
  const Audio = function (bufferSize) {
    if (window.hasOwnProperty('webkitAudioContext') &&
      !window.hasOwnProperty('AudioContext')) {
        window.AudioContext = webkitAudioContext;
      }

    // if (navigator.hasOwnProperty('webkitGetUserMedia') &&
    //   !navigator.hasOwnProperty('getUserMedia')) {
    //     navigator.getUserMedia = webkitGetUserMedia;
    //     if (!AudioContext.prototype.hasOwnProperty('createScriptProcessor')) {
    //       AudioContext.prototype.createScriptProcessor = AudioContext.prototype.createJavaScriptNode;
    //     }
    //   }

    this.context = new AudioContext();

    let elvis = document.getElementById('elvisSong');
    let stream = this.context.createMediaElementSource(elvis);
    stream.connect(this.context.destination);

    this.meyda = Meyda.createMeydaAnalyzer({
      audioContext: this.context,
      source: stream,
      bufferSize: bufferSize,
      windowingFunction: 'blackman',
    });
    _this = this;
    this.initializeMicrophoneSampling();
  };

  Audio.prototype.getSampleRate = function getSampleRate() {
    return this.context.sampleRate;
  }

  Audio.prototype.initializeMicrophoneSampling = function () {
    var errorCallback = function (err) {
      // We should fallback to an audio file here, but that's difficult on mobile
      if (_this.context.state === 'suspended') {
        var resume = function () {
          _this.context.resume();

          setTimeout(function () {
            if (_this.context.state === 'running') {
              document.body.removeEventListener('touchend', resume, false);
            }
          }, 0);
        };

        document.body.addEventListener('touchend', resume, false);
      };
    };

    try {
      // navigator.getUserMedia = navigator.webkitGetUserMedia ||
      //   navigator.getUserMedia || navigator.mediaDevices.getUserMedia;
      var constraints = { video: false, audio: true };
      var successCallback = function (mediaStream) {
        document.getElementById('audioControl').style.display = 'none';
        console.log('User allowed microphone access.');
        console.log('Initializing AudioNode from MediaStream');
        // var source = _this.context.createMediaStreamSource(mediaStream);
        var source = _this.context.createOscillator();
        source.frequency.value = 4*23.4375;
        source.start();
        console.log('Setting Meyda Source to Microphone');
        _this.meyda.setSource(source);
        console.groupEnd();
      };
      //TODO Delete this
      successCallback();
      return;

      console.log('Asking for permission...');
      // let getUserMediaPromise = navigator.mediaDevices.getUserMedia(
      //   constraints,
      //   successCallback,
      //   errorCallback
      navigator.mediaDevices.enumerateDevices().then(devices => {
        const device = devices
          .filter(({kind}) => kind === "audioinput")
          .filter(({label}) => label === "Scarlett 2i2 USB")[0];
        const getUserMediaPromise = navigator.mediaDevices.getUserMedia({
          audio: {
            deviceId: {
              exact: devices[4].deviceId
            }
          }
        })
      if (getUserMediaPromise) {
        getUserMediaPromise.then(successCallback);
        getUserMediaPromise.catch(errorCallback);
      }
      });
      // ).then(successCallback).cathc(errorCallback);
    }
    catch (e) {
      errorCallback();
    }
  };

  Audio.prototype.get = function (features) {
    _this.context.resume();
    return _this.meyda.get(features);
  };

  module.exports = Audio;
})();
