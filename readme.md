#meyda

is an audio feature extraction library designed for and implemented in the [Web Audio API](https://github.com/WebAudio/web-audio-api "Web Audio API").


###Currently supported features
####(inspired by the [yaafe](http://yaafe.sourceforge.net "yaafe") library)

+ rms
+ energy
+ magnitudeSpectrum
+ amplitudeSpectrum
+ loudness
+ perceptual spread
+ spectral centroid
+ spectral flatness
+ spectral slope

##Setup

Download the [production version of meyda.js](https://github.com/hughrawlinson/meyda "not working yet") and include it within the `<head>` tag your HTML.

In your javascript, initialize Meyda with the desired buffer size as follows:
```js
//get context
window.AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();

// create souce node (this could be any kind of Media source or a Web Audio Buffer source)
window.source = context.createMediaElementSource( tune );

// instantiate new meyda with buffer size of 256
var m = new Meyda(context,source,256);
```

Use the `get` function to extract a desired feature in real time
```js
var rootMeanSquare = m.get("rms");
```
You can also pass an array of strings to get multiple features at a time
```js
var myFeatures = m.get(["rms", "loudness", "spectral centroid"]);
```



