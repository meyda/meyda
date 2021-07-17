---
layout: default
---

This tutorial will guide you through the steps of using Meyda to analyze audio
in the context of the [Web Audio API][webaudioapi]. The Web Audio API is a set
of tools available in most major browsers that let you build immersive audio
experiences in the web.

If you run into any difficulties, please help us out by [reporting an issue]
[new-issue] so that we can clarify this document for everyone.

Today we'll build a website that plays an audio file, and shows the user the
level (how loud the sound is) of the audio as it plays. Lets get started!

## 1. Create a website project using your favorite tool

Meyda works with standard Web APIs, and bundles all of its very minimal
dependencies, so you can use it with your favorite tools. If you're looking for
a quick and easy tool to build and host a website for free, we recommend
[glitch.com][glitch]. If you have an existing tool you'd prefer, please go ahead
and use it, you'll be able to import Meyda in the standard way for your project.

If you're using glitch, log in and click "new project", then "hello webpage".
You'll be greeted with a fresh new website that's already live for you on the
internet!

## 2. Add a HTML 5 Audio element to play your audio

You'll need some audio to visualize! If you don't already have your favorite mp3
handy, you can download a royalty free sound clip from [Freesound.org]
[freesound].

Include it in your HTML by pasting the following snippet into the body of your
`index.html`:

```html
<audio
  controls
  loop
  crossorigin="anonymous"
  id="audio"
  src="[THE URL TO YOUR AUDIO FILE]"
></audio>
```

When you load your website, you should now see an audio player that plays your
audio.

## 3. Create a Web Audio "Audio Context", and play your audio through Web Audio

Next, switch to your `script.js` (or wherever you're keeping your Javascript
code). In order for Meyda to hear your audio, you'll need to plug it in to the
Web Audio API. First, we create a Web Audio Context. This is like a box that all
of your audio lives in. We create an audio context like this:

```js
const audioContext = new AudioContext();
```

Now we need to have the audio context take control of your HTML Audio Element.

```js
// Select the Audio Element from the DOM
const htmlAudioElement = document.getElementById("audio");
// Create an "Audio Node" from the Audio Element
const source = audioContext.createMediaElementSource(htmlAudioElement);
// Connect the Audio Node to your speakers. Now that the audio lives in the
// Audio Context, you have to explicitly connect it to the speakers in order to
// hear it
source.connect(audioContext.destination);
```

Try reloading the website again just to make sure that you can still hear the
audio.

## 4. Create a Meyda Analyzer, and tell it to listen to your audio

Here's where Meyda gets involved! Now that audio is flowing between nodes in the
Audio Context box, we need to create a Meyda Analyzer to listen to the audio
and compute the level. Let's look at the code.

```js
if (typeof Meyda === "undefined") {
  console.log("Meyda could not be found! Have you included it?");
} else {
  const analyzer = Meyda.createMeydaAnalyzer({
    audioContext: audioContext,
    source: source,
    bufferSize: 512,
    featureExtractors: ["rms"],
    callback: (features) => {
      console.log(features);
    },
  });
  analyzer.start();
}
```

That was a lot! Lets step through it bit by bit to see what it's doing.

If Meyda isn't available in Javascript, lets log it so that we know what's going
on. Usually this is caused by Meyda not being included correctly. If you're
using Glitch, make sure you've installed Meyda by pasting
`<script src="https://unpkg.com/meyda/dist/web/meyda.min.js"></script>` into
your HTML. In most other projects, make sure you've installed Meyda using npm,
and imported or required it into your Javascript file.

```js
if (typeof Meyda === "undefined") {
  console.log("Meyda could not be found! Have you included it?");
}
```

Otherwise, we'll create a Meyda Analyzer and tell it to listen to our Audio
Source Node.

```js
// Create the Meyda Analyzer
const analyzer = Meyda.createMeydaAnalyzer({
  // Pass in the AudioContext so that Meyda knows which AudioContext Box to work with
  audioContext: audioContext,
  // Source is the audio node that is playing your audio. It could be any node,
  // but in this case, it's the MediaElementSourceNode corresponding to your
  // HTML 5 Audio Element with your audio in it.
  source: source,
  // Buffer Size tells Meyda how often to check the audio feature, and is
  // measured in Audio Samples. Usually there are 44100 Audio Samples in 1
  // second, which means in this case Meyda will calculate the level about 86
  // (44100/512) times per second.
  bufferSize: 512,
  // Here we're telling Meyda which audio features to calculate. While Meyda can
  // calculate a variety of audio features, in this case we only want to know
  // the "rms" (root mean square) of the audio signal, which corresponds to its
  // level
  featureExtractors: ["rms"],
  // Finally, we provide a function which Meyda will call every time it
  // calculates a new level. This function will be called around 86 times per
  // second.
  callback: (features) => {
    console.log(features);
  },
});
```

Now that Meyda is hooked up to our Audio Source, we tell it to start calculating
the level like this:

```js
analyzer.start();
```

When you run this code and play the audio in your HTML Audio Element, you should
hear the audio, and see the level being printed to your browser console.

## 5. Show the audio analysis that Meyda returns to your user

Only one more step! Now that Meyda is calculating the level of your audio in
real time, you can show the level in your web app. While there are plenty of
ways to visualize things, one of the simplest ways is to set the value of an
html input element of type "range". Range is great because it displays as a
slider in your web page. Lets add one in to our HTML:

```html
<label for="level">level</label>
<input
  type="range"
  id="levelRange"
  name="level"
  min="0.0"
  max="1.0"
  step="0.001"
/>
```

The level (root mean square) audio feature ranges between 0 and 1, so we set
these as the min and max values of our range. Level is a continuous audio
feature (as opposed to having a discrete set of possible values), so we set the
step size of our range element to be very small, so that we don't lose too much
precision when displaying it.

Now that our HTML is in place, lets connect our Javascript.

We've got to store a reference to our input element in our Javascript file, so
we'll store it in a variable at the top of our file. If you get lost and don't
know where to paste the code, don't worry - you can check out the finished code
at the end of the tutorial.

```js
const levelRangeElement = document.getElementById("levelRange");
```

Finally, inside Meyda's callback (where you log the level), you should set the
value of the range element to the value of the level that Meyda reported.

```js
levelRangeElement.value = features.rms;
```

---

Well done! You built a website that shows the user the level of the audio
that's playing!

Have a look at our complete implementation of this site hosted on Glitch.com

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">
  <iframe src="https://glitch.com/embed/#!/embed/meyda-tutorial?path=script.js&previewSize=42" alt="meyda-tutorial on glitch" style="height: 100%; width: 100%; border: 0;"></iframe>
</div>

Here are a few things you might like to try next:

1. Learn more about audio features
2. Learn more about Web Audio
3. Learn how to use Meyda in Node.js
4. Learn how to choose Meyda's parameters for your use case

[webaudioapi]: https://github.com/WebAudio/web-audio-api
[glitch]: https://glitch.com/
[freesound]: https://freesound.org
[new-issue]: https://github.com/meyda/meyda/issues/new
