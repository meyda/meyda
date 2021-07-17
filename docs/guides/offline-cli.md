---
layout: default
---

In this guide, we'll learn how to use Meyda's command line interface to perform
offline audio feature extraction on a file on disk.

The difference between online and offline audio feature extraction is that while
online audio feature extraction happens in "real time", while audio is being
generated (possibly from a microphone, or other input device), offline audio
feature extraction can be run when the audio is already generated. As a result,
it can run much faster than real time, because it doesn't need to wait for the
audio to be generated, and can run through an audio signal much faster than a
human could listen to it.

Why might it be useful to perform offline audio feature extraction on a file on
disk? One straightforward use case is if you imagine that you have a large bank
of audio samples, and you need to know the audio features of each one, so that
you can build a web app that plots these samples based on their audio features.
You wouldn't want to load each sample over the wire and then run offline audio
feature extraction on each one, because that would take a lot of time, delay the
loading of your page for your user, and waste a lot of their bandwidth. Instead,
you could run offline audio feature extraction in advance, save the results, and
load the results into your web page each time. That would be much faster.

To call Meyda's command line interface, we first need to install the Meyda
package globally, using npm.

```sh
$ npm install --global meyda
```

Once that command has run, the Meyda executable should be available on your
path. You can test this by running `meyda --help` as shown below. You should
expect the same usage information to print to your console before `meyda` exits.

```
$ meyda --help
Usage: node meyda

      --o[=OUTPUT_FILE]         Path to output file (optional, if not specified prints to console
      --bs[=BUFFER_SIZE]        Buffer size in samples (optional, default is 512)
      --hs[=HOP_SIZE]           Hop size in samples (optional, defaults to matching buffer size)
      --w[=WINDOWING_FUNCTION]  Windowing function (optional, default is hanning)
      --format[=FORMAT_TYPE]    Type of output file (optional, default is csv)
  -p                            Disables some of the logging and outputs data to stdout, useful for piping
  -h, --help                    Display help
```

Meyda's command line interface only supports wav files, but you can use any of a
variety of free utilities to convert audio from your source format into wav. We
recommend [ffmpeg][ffmpeg-audio-conversion]. Meyda only supports feature
extraction on a single channel. When Meyda receives a multi-channel signal, it
will run feature extraction on the first channel. If you need to get the audio
features of a multi-channel audio file, you can use ffmpeg to [split a
multi-channel file into multiple single-channel files][ffmpeg-channel-split].

Lets run Meyda on a file.

```
$ meyda [input audio file] [audio features]
```

When all is said and done, Meyda should have printed a list of audio features,
one per buffer of audio in your file. What happens under the hood is that when
Meyda extracts audio features on a file, it chops the file up into many arrays
called buffers, each of the same length (this length is called the "buffer size"
). Then, it runs the feature extraction on each of these buffers, and prints the
results to your terminal. At the end of the results, it prints the average
value for the audio feature across all of the buffers. Here is some example
output:

```
$ meyda $AUDIO_FILE zcr rms
...
0.09969931883890712
0.09855015035449391
0.034916217344244806
0.10669681790881183
0.08063935874077789
0.12053331333721143
0.00011213407113325301

Average zcr: 143.96319018404907
Average rms: 0.04044172219461247
```

In our sample plot website use-case described above, this is the stage at which
you run Meyda against each of your audio files, and store the results in a
format that's useful to you, perhaps in a database, or as a static file. You
might use a bash loop to run meyda against every file in your collection, like
so:

```
for AUDIO_FILE in $( ls ./samples_directory ); do
  meyda $AUDIO_FILE zcr rms >> ./results_directory/$AUDIO_FILE_features.txt
done;
```

Is offline audio feature extraction only possible using Meyda's command line
interface? No. For one thing, many other libraries and tools can run audio
feature extraction, such as [YAAFE][yaafe] a c library and [librosa][librosa], a
python library. Meyda's audio feature extractors can be run on arbitrary signals
in Node.js or in the browser, and Meyda is fully compatible with the Web Audio
API's [offline audio context][offlineaudiocontext].

Great! Now you know how to, and why you might want to use Meyda's command line
interface to run offline audio feature extraction against audio files. You've
learned the difference between online and offline feature extraction, and you've
learned about some situations in which offline feature extraction can be useful.
You've even learned about some other audio feature extraction libraries that may
be useful to you.

Next, why don't you check out our [audio feature reference]
[audio-feature-reference] to learn about the various audio features that Meyda
can extract?

[librosa]: https://librosa.github.io/
[yaafe]: https://github.com/Yaafe/Yaafe
[offlineaudiocontext]: https://developer.mozilla.org/en-US/docs/Web/API/OfflineAudioContext
[ffmpeg-audio-conversion]: https://www.howtoforge.com/tutorial/ffmpeg-audio-conversion/
[ffmpeg-channel-split]: https://superuser.com/questions/685910/ffmpeg-stereo-channels-into-two-mono-channels
[audio-feature-reference]: /audio-features
