---
layout: default
---

## What is an Audio Feature?

Often, observing and analysing an audio signal as a waveform doesn't provide us a lot of information about its contents. An audio feature is a measurement of a particular characteristic of an audio signal, and it gives us insight into what the signal contains. Audio features can be measured by running an algorithm on an audio signal that will return a number, or a set of numbers that quantify the characteristic that the specific algorithm is intended to measure. Meyda implements a selection of standardized audio features that are used widely across a variety of music computing scenarios.

Bear in mind that by default, Meyda.extract applies a windowing function to the incoming signal using the hanning windowing function by default. If you compare the results of Meyda's feature extraction to that of another library for the same signal, make sure that the same windowing is being applied, or the features will likely differ. To disable windowing in Meyda.extract, set Meyda.windowingFunction to 'rect'.

_Following is a list of supported features with their explanations. Unless stated otherwise, extraction algorithms have been adapted from the [yaafe](http://yaafe.sourceforge.net) library._

<br>

## Time-domain features

### RMS

`rms`

- _Description_: The root mean square of the waveform, that corresponds to its loudness. Corresponds to the ‘Energy’ feature in YAAFE, adapted from Loy’s Musimathics [1].
- _What Is It Used For_: Getting a rough idea about the loudness of a signal.
- _Range_: RMS is a positive floating point number, bound only by the length and volume of the input signal. For more information, check out [the wikipedia entry](https://en.wikipedia.org/wiki/Root_mean_square).

To use RMS in applications where you expect a ceiling on each audio feature, we suggest that you measure examples of audio that you will run feature extraction on, identify a reasonable "maximum" to clamp your max to, and apply the Math.min function to take either the current value of rms, or your maximum threshold, whichever is lower.

### ZCR

`zcr`

- _Description_: The number of times that the signal crosses the zero value in the buffer.
- _What Is It Used For_: Helps differentiating between percussive and pitched sounds. Percussive sounds will have a random ZCR across buffers, where pitched sounds will return a more constant value.
- _Range_: 0 - ((buffer size / 2) - 1). In Meyda, the default buffer size (`bufferSize`) is 512 and therefore the default ZCR range is `0 - 255`.

### Energy

`energy`

- _Description_: The infinite integral of the squared signal. According to Lathi [2].
- _What Is It Used For_: This is another indicator to the loudness of the signal.
- _Range_: 0 - `bufferSize`, where `0.0` is very quiet and `bufferSize` is very loud.

<br>

## Spectral Features

### AmplitudeSpectrum

`amplitudeSpectrum`

- _Description_: This is also known as the magnitude spectrum. By calculating the Fast Fourier Transform (FFT), we get the signal represented in the frequency domain. The output is an array, where each index is a frequency bin (i.e. containing information about a range of frequencies) containing a complex value (real and imaginary). The amplitude spectrum takes this complex array and computes the amplitude of each index. The result is the distribution of frequencies in the signal along with their corresponding strength. If you want to learn more about Fourier Transform, and the differences between time-domain to frequency-domain analysis, [this article][mathworks-fourier] is a good place to start.
- _What Is It Used For_: Very useful for any sort of audio analysis. In fact, many of the features extracted in Meyda are based on this :).
- _Range_: An array half the size of the FFT, containing information about frequencies between 0 - half of the sampling rate. In Meyda the default sampling rate (`sampleRate`) is 44100Hz and the FFT size is equal to the buffer size (`bufferSize`) - with a default of 512.

### Power Spectrum

`powerSpectrum`

- _Description_: This is the `amplitudeSpectrum` squared.
- _What Is It Used For_: This better emphasizes the differences between frequency bins, compared to the amplitude spectrum.
- _Range_: An array half the size of the FFT, containing information about between frequencies 0 - half of the sampling rate. In Meyda the default sampling rate (`sampleRate`) is 44100Hz and the FFT size is equal to the buffer size (`bufferSize`) - with a default of 512.

### Spectral Centroid

`spectralCentroid`

- _Description_: An indicator of the "brightness" of a given sound, representing the spectral centre of gravity. If you were to take the spectrum, make a wooden block out of it and try to balance it on your finger (across the X axis), the spectral centroid would be the frequency that your finger "touches" when it successfully balances.
- _What Is It Used For_: As mentioned, it's quantifying the "brightness" of a sound. This can be used for example to classify a bass guitar (low spectral centroid) from a trumpet (high spectral centroid).
- _Range_: 0 - half of the FFT size. In Meyda the FFT size is equal to the buffer size (`bufferSize`) - with a default of 512.

### Spectral Flatness

`spectralFlatness`

- _Description_: The flatness of the spectrum. It is computed using the ratio between the geometric and arithmetic means.
- _What Is It Used For_: Determining how noisy a sound is. For example a pure sine wave will have a flatness that approaches `0.0`, and white noise will have a flatness that approaches `1.0`.
- _Range_: `0.0 - 1.0` where `0.0` is not flat and `1.0` is very flat.

### Spectral Flux

`spectralFlux`

- _Description_: A measure of how quickly the spectrum of a signal is changing. It is calculated by computing the difference between the current spectrum and that of the previous frame.
- _What Is It Used For_: Often corresponds to perceptual "roughness" of a sound. Can be used for example, to determine the timbre of a sound, and onset detection.
- _Range_: Starts at `0.0`. The upper bound is equal to the square root of the buffer size.

### Spectral Slope

`spectralSlope`

- _Description_: A measure of how ‘inclined’ the shape of the spectrum is. Calculated by performing linear regression on the amplitude spectrum.
- _What Is It Used For_: Can be used to differentiate between different voice qualities, such as hissing, breathing and regular speech. Closely relates to spectral centroid and spectral rolloff.
- _Range_: `0.0 - 1.0`

### Spectral Rolloff

`spectralRolloff`

- _Description_: The frequency below which is contained 99% of the energy of the spectrum.
- _What Is It Used For_: Can be used to approximate the maximum frequency in a signal.
- _Range_: 0 - half of the sampling rate. In Meyda the default sampling rate (`sampleRate`) is 44100Hz.

### Spectral Spread

`spectralSpread`

- _Description_: Indicates how spread the frequency content is across the spectrum. Corresponds with the frequency bandwidth.
- _What Is It Used For_: Can be used to differentiate between noisy (high spectral spread) and pitched sounds (low spectral spread).
- _Range_: 0 - half of the FFT size. In Meyda the FFT size is equal to the buffer size (`bufferSize`) - with a default of 512.

### Spectral Skewness

`spectralSkewness`

- _Description_: Indicates whether or not the spectrum is skewed towards a particular range of values, relative to its mean.
- _What Is It Used For_: Often used to get an idea about the timbre of a sound.
- _Range_: Could be negative, positive, or 0. Where 0 is symmetric about the mean, negative indicates that the frequency content is skewed towards the right of the mean, and positive indicates that the frequency content is skewed towards the left of the mean.

### Spectral Kurtosis

`spectralKurtosis`

- _Description_: An indicator to how pointy the spectrum is. Can be viewed as the opposite of Spectral Flatness.
- _What Is It Used For_: Often used to indicate "pitchiness / tonality" of a sound.
- _Range_: `0.0 - 1.0`, where `0.0` is not tonal, and `1.0` is very tonal.

### Chroma

`chroma`

- _Description_: Calculates the how much of each chromatic pitch class (C, C♯, D, D♯, E, F, F♯, G, G♯, A, A♯, B) exists in the signal.
- _What Is It Used For_: Often used to analyse the harmonic content of recorded music, such as in chord or key detection.
- _Range_: `0.0 - 1.0` for each pitch class.

<br>

## Perceptual features

### Loudness

`loudness`

- _Description_: Humans' perception of frequency is non-linear. The [Bark Scale][wikipedia-bark] was developed in order to have a scale on which equal distances correspond to equal distances of frequency perception. This feature outputs an object with two values:
  - The loudness of the input sound on each step (often referred to as bands) of this scale (`.specific`). There are 24 bands overall.
  - Total Loudness (`.total`), which is a sum of the 24 `.specific` loudness coefficients.
- _What Is It Used For_: Can be used to construct filters that better correspond with the human perception of loudness.
- _Range_: The loudness feature extractor uses a normalised spectrum to calculate the individual bark band energies, but the energies themselves are not normalised afterwards. If we were to normalize to the loudest possible sound, we would squash the range such that quiet values lose fidelity. Therefore, we leave normalization of this feature to the consumer of the value, since normalization approach depends on the use case. Realtime audio visualisers, for example, may choose to store the "loudest yet seen" value and normalize to that, whereas systems that are extracting audio features over a large corpus of audio will likely need a shared reference point for normalization, and should pick one suitable for their use case and dataset. Make sure you remember your normalization value and method though! We recommend experimenting and seeing what works for your use case. If you have ideas for how to improve the loudness feature, or any others, please [let us know].

### Perceptual Spread

`perceptualSpread`

- _Description_: Computes the spread of the `.specific` loudness coefficients, over the bark scale.
- _What Is It Used For_: An indicator of how "rich / full" a sound will be perceived.
- _Range_: `0.0 - 1.0` where `0.0` is not "rich" and `1.0` is very "rich".

### Perceptual Sharpness

`perceptualSharpness`

- _Description_: Perceived "sharpness" of a sound, based the Bark loudness coefficients.
- _What Is It Used For_: Detecting if an input sound is perceived as "sharp". Can be used, for example, for differentiating between snare-drum and bass-drum sounds.
- _Range_: `0.0 - 1.0` where `0.0` is not "sharp" (e.g. bass-drum) and `1.0` very sharp (e.g. snare-drum).

### Mel-Frequency Cepstral Coefficients

`mfcc`

- _Description_: As humans don't interpret pitch in a linear manner, various scales of frequencies were devised to represent the way humans hear the distances between pitches. The [Mel scale][wikipedia-mel] is one of them, and it is now widely used for voice-related applications. The Meyda implementation was inspired by Huang [3], Davis [4], Grierson [5] and the [librosa](https://github.com/bmcfee/librosa) library.
- _What Is It Used For_: Often used to perform voice activity detection (VAD) prior to automatic speech recognition (ASR).
- _Range_: An array of values representing the intensity for each Mel band. The default size of the array is 13, but is configureable via `numberOfMFCCCoefficients`.

<br>

## Utility extractors

### Complex Spectrum

`complexSpectrum`

- _Description_: An array of complex values (`ComplexArray`) containing both the real and the imaginary parts of the FFT.
- _What Is It Used For_: To create the `amplitudeSpectrum`. It is also used to do further signal processing, as it contains information about both the frequency the phase of the signal.
- _Range_: An array half the size of the FFT, containing information about frequencies 0 - half of the sampling rate, and their corresponding phase values. In Meyda the default sampling rate (`sampleRate`) is 44100Hz and the FFT size is equal to the buffer size (`bufferSize`) - with a default of 512.

### Buffer

`buffer`

- _Description_: This is the raw audio that you get when reading an input from a microphone, a wav file, or any other input audio. It is encoded as a `Float32Array`.
- _What Is It Used For_: All of the time-domain features in Meyda are extracted from this buffer. You can also use that to visualise the audio waveform.
- _Range_: An array of size `bufferSize`, where each value can range between `-1.0 - 1.0`.

<br>

## Windowing functions

Windowing functions are used during the conversion of a signal from the time domain (i.e. air pressure over time) to the frequency domain (the phase and intensity of each sine wave that comprises the signal); a prerequisite for many of the audio features described above. Windowing functions generate an envelope of numbers between 0 and 1, and multiply these numbers pointwise with each sample in the signal buffer, making the samples at the middle of the buffer relatively louder, and making the samples at either end of the buffer relatively quieter. This smooths out the result of the conversion to the frequency domain, which makes the final audio features more consistent and less jittery.

Meyda supports 4 windowing functions, each with different characteristics. For more information on windowing, please consult [this article][wikipedia-windowing]. By default, Meyda applies the hanning window, not the rectangular window, to signals before converting them into the frequency domain.

### Hanning

`Meyda.windowing(signalToBeWindowed, "hanning");`

### Hamming

`Meyda.windowing(signalToBeWindowed, "hamming");`

### Blackman

`Meyda.windowing(signalToBeWindowed, "blackman");`

### Sine

`Meyda.windowing(signalToBeWindowed, "sine");`

### Rectangular (no window)

`Meyda.windowing(signalToBeWindowed, "rect");`

<br>
<br>

---

[1] G. Loy, Musimathics: _The Mathematical Foundations of Music_, Volume 1. The MIT Press, 2006.

[2] B. P. Lathi, _Modern Digital and Analog Communication Systems_ 3e Osece. Oxford University Press, 3rd ed., 1998.

[3] X. Huang, A. Acero, and H.-W. Hon, _Spoken Language Processing: A Guide to Theory, Algorithm, and System Development._ Upper Saddle River, NJ, USA: Prentice Hall PTR, 1st ed., 2001.

[4] S. Davis and P. Mermelstein, “Comparison of parametric representations for monosyllabic word recognition in continuously spoken sentences,” _Acoustics, Speech and Signal Processing, IEEE Transactions on_, vol. 28, pp. 357–366, Aug 1980.

[5] M. Grierson, “Maximilian: A cross platform c++ audio synthesis library for artists learning to program.,” in _Proceedings of International Computer Music Conference,_ 2010.

[wikipedia-windowing]: https://en.wikipedia.org/wiki/Window_function
[wikipedia-mel]: https://en.wikipedia.org/wiki/Mel_scale
[wikipedia-bark]: https://en.wikipedia.org/wiki/Bark_scale
[mathworks-fourier]: https://www.mathworks.com/help/signal/examples/practical-introduction-to-frequency-domain-analysis.html
[let us know]: https://github.com/meyda/meyda/issues
