import * as Meyda from "meyda";
var _this;
const Audio = function (bufferSize) {
  if (
    Object.prototype.hasOwnProperty.call(window, "webkitAudioContext") &&
    !Object.prototype.hasOwnProperty.call(window, "AudioContext")
  ) {
    // @ts-ignore
    window.AudioContext = webkitAudioContext;
  }

  if (
    Object.prototype.hasOwnProperty.call(navigator, "webkitGetUserMedia") &&
    !Object.prototype.hasOwnProperty.call(navigator, "getUserMedia")
  ) {
    // @ts-ignore
    navigator.getUserMedia = webkitGetUserMedia;
    if (
      !Object.prototype.hasOwnProperty.call(
        AudioContext.prototype,
        "createScriptProcessor"
      )
    ) {
      AudioContext.prototype.createScriptProcessor =
        // @ts-ignore
        AudioContext.prototype.createJavaScriptNode;
    }
  }

  this.context = new AudioContext();

  let elvis = document.getElementById("elvisSong");
  let stream = this.context.createMediaElementSource(elvis);
  stream.connect(this.context.destination);

  this.meyda = Meyda.createMeydaAnalyzer({
    audioContext: this.context,
    source: stream,
    bufferSize: bufferSize,
    windowingFunction: "blackman",
  });
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  _this = this;
  this.initializeMicrophoneSampling();
};

Audio.prototype.initializeMicrophoneSampling = function () {
  var errorCallback = function () {
    // We should fallback to an audio file here, but that's difficult on mobile
    if (_this.context.state === "suspended") {
      var resume = function () {
        _this.context.resume();

        setTimeout(function () {
          if (_this.context.state === "running") {
            document.body.removeEventListener("touchend", resume, false);
          }
        }, 0);
      };

      document.body.addEventListener("touchend", resume, false);
    }
  };

  try {
    const getUserMedia =
      // @ts-ignore
      navigator.webkitGetUserMedia ||
      // @ts-ignore
      navigator.getUserMedia ||
      navigator.mediaDevices.getUserMedia;
    var constraints = {
      video: false,
      audio: true,
    };
    var successCallback = function successCallback(mediaStream) {
      document.getElementById("audioControl")!.style.display = "none";
      console.log("User allowed microphone access.");
      console.log("Initializing AudioNode from MediaStream");
      var source = _this.context.createMediaStreamSource(mediaStream);
      console.log("Setting Meyda Source to Microphone");
      _this.meyda.setSource(source);
      console.groupEnd();
    };

    console.log("Asking for permission...");
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
      })
      .then(successCallback)
      .catch(function (error) {
        console.log(error);
        getUserMedia(
          {
            audio: true,
          },
          successCallback,
          function (e) {
            errorCallback();
          }
        );
      });
  } catch (e) {
    errorCallback();
  }
};

Audio.prototype.get = function (features) {
  _this.context.resume();
  return _this.meyda.get(features);
};

export default Audio;
