---
layout: default
---

## What is an Audio Feature?

An audio feature is a measurement of a particular characteristic of an audio signal. Audio features can be measured by running an algorithm on an audio signal that will return a number, or a set of numbers that quantify the characteristic that the specific algorithm is intended to measure. Meyda implements a selection of standardized audio features that are used widely across a variety of music computing scenarios.

*Following is a list of supported features with their explanations. Unless stated otherwise, extraction algorithms have been adapted from the [yaafe](http://yaafe.sourceforge.net) library.*

## Time-domain features

### RMS
`rms`

The root mean square of the waveform calculated in the time domain to indicate its loudness. Corresponds to the ‘Energy’ feature in YAAFE, adapted from Loy’s Musimathics [1].

### Energy
`energy`

The infinite integral of the squared signal. According to Lathi [2].

### ZCR
`zcr`

The number of times that the signal crosses the zero value in the buffer. Corresponds to ZCR in jAudio.

## Spectral Features

### AmplitudeSpectrum
`amplitudeSpectrum`

Frequency domain amplitude spectrum, a transformation from the complex FFT.

### Power Spectrum
`powerSpectrum`

Frequency domain power spectrum, a transformation from the complex FFT.

### Spectral Centroid
`spectralCentroid`

An indicator of the brightness of a given spectrum, represents the spectral centre of gravity.

### Spectral Flatness
`spectralFlatness`

The flatness of the spectrum as represented by the ratio between the geometric and arithmetic means. It is an indicator of the ‘noisiness’ of a sound.

### Spectral Flux
`spectralFlux`

A measure of the difference between the current spectrum and that of the previous frame. Often corresponds to perceptual roughness.

### Spectral Slope
`spectralSlope`

A measure of how ‘inclined’ the shape of the spectrum is. Calculated by performing linear regression on the amplitude spectrum.

### Spectral Rolloff
`spectralRolloff`

The frequency below which is contained 99% of the energy of the spectrum.

### Spectral Spread
`spectralSpread`

Indicates the "fullness" of the spectrum.

### Spectral Skewness
`spectralSkewness`

Indicates whether or not the spectrum is skewed towards a particular range of values.

### Spectral Kurtosis
`spectralKurtosis`

The "pointedness" of a spectrum, can be used to indicate "pitchiness".

### Chroma
`chroma`

Calculates the spectral energy of the signal for each chromatic pitch class (C, C♯, D, D♯, E, F, F♯, G, G♯, A, A♯, B). Often used to analyse the harmonic content of recorded music, such as in chord or key detection.

## Perceptual features

### Loudness
`loudness`

The loudness of the spectrum as perceived by a human, using Bark bands. Outputs an object consisting of Specific Loudness ( `.specific` – calculated for each Bark band) and Total Loudness ( `.total` – a sum of the specific loudness coefficients).

### Perceptual Spread
`perceptualSpread`

How "full" a human will perceive the sound to be.

### Perceptual Sharpness
`perceptualSharpness`

Perceived sharpness of the loudness Bark coefficients.

### Mel-Frequency Cepstral Coefficients
`mfcc`

A widely used metric for describing timbral characteristics based on the Mel scale. Implemented according to Huang [3], Davis [4], Grierson [5] and the [librosa](https://github.com/bmcfee/librosa) library.

<br>
<br>

## Utility extractors

### Complex Spectrum
`complexSpectrum`

A `ComplexArray` object carrying both real and imaginary parts of the FFT.

### Buffer
`buffer`

A simple `Float32Array` of sample values

<br>
<br>

## Windowing functions

Windowing functions are used during the conversion of a signal from the time domain (i.e. air pressure over time) to the frequency domain (the phase and intensity of each sine wave that comprises the signal); a prerequisite for many of the audio features described above. Windowing functions generate an envelope of numbers between 0 and 1, and multiply these numbers pointwise with each sample in the signal buffer, making the samples at the middle of the buffer relatively louder, and making the samples at either end of the buffer relatively quieter. This smooths out the result of the conversion to the frequency domain, which makes the final audio features more consistent and less jittery.

Meyda supports 4 windowing functions, each with different characteristics. For more information on windowing, please consult [this article][wikipedia-windowing]

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

***

[1] G. Loy, Musimathics: *The Mathematical Foundations of Music*, Volume 1. The MIT Press, 2006.

[2] B. P. Lathi, *Modern Digital and Analog Communication Systems* 3e Osece. Oxford University Press, 3rd ed., 1998.

[3] X. Huang, A. Acero, and H.-W. Hon, *Spoken Language Processing: A Guide to Theory, Algorithm, and System Development.* Upper Saddle River, NJ, USA: Prentice Hall PTR, 1st ed., 2001.

[4] S. Davis and P. Mermelstein, “Comparison of parametric representations for monosyllabic word recognition in continuously spoken sentences,” *Acoustics, Speech and Signal Processing, IEEE Transactions on*, vol. 28, pp. 357–366, Aug 1980.

[5] M. Grierson, “Maximilian: A cross platform c++ audio synthesis library for artists learning to program.,” in *Proceedings of International Computer Music Conference,* 2010.

[windowing]: https://en.wikipedia.org/wiki/Window_function
