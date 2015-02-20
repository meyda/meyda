#meyda

is a javascript audio feature extraction library designed for and implemented in the [Web Audio API](https://github.com/WebAudio/web-audio-api "Web Audio API"). We wrote a paper about it, which is available [here](http://doc.gold.ac.uk/~mu202hr/publications/RawlinsonSegalFiala_WAC2015.pdf).

[hughrawlinson](https://github.com/hughrawlinson "Hugh Rawlinson") | [nevosegal](https://github.com/nevosegal "Nevo Segal") | [jakubfiala](https://github.com/jakubfiala "Jakub Fiala")

###Currently supported features
#####(inspired by the [yaafe](http://yaafe.sourceforge.net "yaafe") library)

+ rms
+ energy
+ zcr
+ complexSpectrum
+ amplitudeSpectrum
+ powerSpectrum
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

For a detailed description of the above features (and other functions in Meyda), see the [docs.md](https://github.com/hughrawlinson/meyda/blob/master/docs.md "docs.md") file.

###Setup

_Supported Browsers: Chrome, Firefox, Opera. Safari works, unless you're using a MediaElementSource._

Download [meyda.min.js](https://github.com/hughrawlinson/meyda/blob/master/meyda.min.js "meyda.min.js") and include it within the `<head>` tag your HTML.

```html
<script type="text/javascript" src="meyda.min.js"></script>
```

In your javascript, initialize Meyda with the desired buffer size as follows:
```js
// get context
window.AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();

// create source node (this could be any kind of Web Audio Buffer source or a Media Element/Media Stream source)
// in Safari, use a buffer source instead
var tune = new Audio('audio/guitar.mp3');
window.source = context.createMediaElementSource(tune);

// instantiate new meyda with buffer size of 512 (default is 256)
var meyda = new Meyda(context,source,512);
```

Use the `get` function to extract a desired feature in real time
```js
var rootMeanSquare = meyda.get("rms");
```
You can also pass an array of strings to get multiple features at a time
```js
var myFeatures = meyda.get(["rms", "loudness", "spectralCentroid"]);
```

Alternatively, you can use snychronized buffer-by-buffer extraction by specifying a callback when constructing Meyda
```js
//instantiate new meyda with callback
var meyda = new Meyda(context, source, 512, function(output){
	myFeatures = output;
});

//commence extraction with specified features
meyda.start(["zcr", "spectralSlope"]);

//stop extraction whenever we want (e.g. after 3 seconds)
setTimeout(function() {
	meyda.stop();
}, 3000);

```

You can obtain information about the extractors' output by querying the `featureInfo` object
`meyda.featureInfo['zcr'].type;`
The return type of features can be either 'Number', 'Array', or 'multipleArrays', and the object definition can be found in `meyda.js`.

###Acknowledgements

This library is using the [jsfft](https://github.com/dntj/jsfft "jsfft") implementation by [Nick Jones](https://github.com/dntj "Nick Jones") released under the MIT License.
The authors would like to thank [Rebecca Fiebrink](https://twitter.com/RebeccaFiebrink "Rebecca Fiebrink") for essential guidance and support.


