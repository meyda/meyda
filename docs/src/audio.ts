/* globals webkitAudioContext, Meyda */
declare global {
  function webkitGetUserMedia(
    constraints?: MediaStreamConstraints
  ): Promise<MediaStream>;
  const webkitAudioContext: BaseAudioContext;
  interface Window {
    webkitAudioContext: BaseAudioContext;
    Meyda: any;
  }
}

var _this: any;
type AudioThis = {
  context: AudioContext;
  elvis: HTMLMediaElement;
  meyda: any;
};
const Audio = function (this: AudioThis, bufferSize: number) {
  if (
    window.hasOwnProperty("webkitAudioContext") &&
    !window.hasOwnProperty("AudioContext")
  ) {
    window.AudioContext = webkitAudioContext;
  }

  if (
    navigator.hasOwnProperty("webkitGetUserMedia") &&
    !navigator.hasOwnProperty("getUserMedia")
  ) {
    navigator.getUserMedia = globalThis.webkitGetUserMedia;
    if (!AudioContext.prototype.hasOwnProperty("createScriptProcessor")) {
      AudioContext.prototype.createScriptProcessor =
        // @ts-ignore
        AudioContext.prototype.createJavaScriptNode;
    }
  }

  this.context = new AudioContext();

  let elvis = document.getElementById("elvisSong") as HTMLMediaElement;
  let stream = this.context.createMediaElementSource(elvis);
  stream.connect(this.context.destination);

  this.meyda = window.Meyda.createMeydaAnalyzer({
    audioContext: this.context,
    source: stream,
    bufferSize: bufferSize,
    windowingFunction: "blackman",
  });
  _this = this;
  this.initializeMicrophoneSampling();
};

Audio.prototype.initializeMicrophoneSampling = function () {
  var errorCallback = function (err: any) {
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
    navigator.getUserMedia =
      // @ts-ignore
      navigator.webkitGetUserMedia ||
      navigator.getUserMedia ||
      navigator.mediaDevices.getUserMedia;
    var constraints = {
      video: false,
      audio: true,
    };
    var successCallback = function successCallback(mediaStream: MediaStream) {
      var audioControl = document.getElementById("audioControl");
      if (audioControl) {
        audioControl.style.display = "none";
      }
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
        navigator.getUserMedia(
          {
            audio: true,
          },
          successCallback,
          function (e) {
            errorCallback(error);
          }
        );
      });
  } catch (e) {
    errorCallback(e);
  }
};

Audio.prototype.get = function (features: string) {
  _this.context.resume();
  return _this.meyda.get(features);
};

export default Audio;
