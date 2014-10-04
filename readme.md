#meyda

is a javascript audio feature extraction library designed for and implemented in the [Web Audio API](https://github.com/WebAudio/web-audio-api "Web Audio API").

[hughrawlinson](https://github.com/hughrawlinson "Hugh Rawlinson") | [nevosegal](https://github.com/nevosegal "Nevo Segal") | [jakubfiala](https://github.com/jakubfiala "Jakub Fiala")

###Currently supported features
#####(inspired by the [yaafe](http://yaafe.sourceforge.net "yaafe") library)

+ rms
+ energy
+ zcr
+ spectrum
+ powerSpectrum
+ amplitudeSpectrum
+ spectralCentroid
+ spectralFlatness
+ spectralSlope
+ spectralRolloff
+ spectralSpread
+ spectralSkewness
+ spectralKurtosis
+ loudness
	- specific
	- total
+ perceptualSpread
+ perceptualSharpness
+ mfcc

###Setup

_Meyda is under active development and is *not yet ready for production*_

Download [meyda.js](https://github.com/hughrawlinson/meyda/blob/master/main.js "meyda.js") and include it within the `<head>` tag your HTML.

In your javascript, initialize Meyda with the desired buffer size as follows:
```js
// get context
window.AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();

// create source node (this could be any kind of Media source or a Web Audio Buffer source)
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
var myFeatures = m.get(["rms", "loudness", "spectralCentroid"]);
```



