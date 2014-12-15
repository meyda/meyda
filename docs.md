#meyda

Here's some additional information on how to use Meyda.

###Windowing

You can change the internal windowing function by setting `meyda.windowingFunction`.
You can also use the windowing functions externally by calling e.g. `meyda.hamming(array)` on a `Float32Array`.
Currently supported windows are:
+ `hanning`
+ `hamming`

###Feature Extractors List and Description

Following is the comprehensive list of all feature extraction functions available in Meyda,
with their descriptions and output types. Sources are indicated where applicable.

##Utility Extractors
###"buffer"
+ *description:* raw signal data
+ *returns:* Float32Array

###"complexSpectrum"
+ *description:* Complex spectrum
+ *returns:* a ComplexArray containing two Number arrays, "real" and "imag"(imaginary) parts of the FFT output

##Time Domain
###"rms"
+ *description:* The root mean square of the waveform calculated in the time domain to indicate its loudness.
+ *source:* Gareth Loy. 2006. Musimathics: The Mathematical Foundations of Music, Volume 1. The MIT Press.
+ *returns:* Number

###"energy"
+ *description:* The infinite integral of the squared signal.
+ *source:* B. P. Lathi. 1998. Modern Digital and Analog Communication Systems 3e Osece (3rd ed.). Oxford University Press.
+ *returns:* Number

###"zcr"
+ *description:* Zero Crossings Rate – the number of times that the signal crosses the zero value in the buffer.
+ *source:* jAudio
+ *returns:* Number

##Frequency Domain
###"amplitudeSpectrum"
+ *description:* Frequency domain amplitude spectrum, a transformation from the complex FFT.
+ *source:* yaafe
+ *returns:* Float32Array

###"powerSpectrum"
+ *description:* Frequency domain power spectrum, a transformation from the complex FFT.
+ *source:* yaafe
+ *returns:* Float32Array

###"spectralCentroid"
+ *description:* An indicator of the brightness of a given spectrum, represents the spectral centre of gravity.
+ *source:* yaafe
+ *returns:* Number

###"spectralFlatness"
+ *description:* The flatness of the spectrum as represented by the ratio between the geometric and arithmetic means. It is an indicator of the 'noisiness' of a sound.
+ *source:* yaafe
+ *returns:* Number

###"spectralSlope"
+ *description:* A measure of how 'inclined' the shape of the spectrum is. Calculated by performing linear regression on the amplitude spectrum.
+ *source:* yaafe
+ *returns:* Number

###"spectralRolloff"
+ *description:* The frequency below which is contained 85% of the energy of the spectrum.
+ *source:* yaafe
+ *returns:* Number

###"spectralSpread"
+ *description:* Indicates the 'fullness' of the spectrum.
+ *source:* yaafe
+ *returns:* Number

###"spectralSkewness"
+ *description:* Indicates whether or not the spectrum is skewed towards a particular range of values.
+ *source:* yaafe
+ *returns:* Number

###"spectralKurtosis"
+ *description:* The 'pointedness' of a spectrum, can be used to indicate 'pitchiness'.
+ *source:* yaafe
+ *returns:* Number

###"mfcc"
+ *description:* Mel-frequency Cepstral Coefficients: A widely used metric for describing timbral characteristics based on the Mel scale.
+ *sources:*
	- M. Grierson, “Maximilian: A cross platform c++ audio synthesis library for artists learning to program.,” in Proceedings of International Computer Music Conference, 2010
	- Davis, S.; Mermelstein, P., "Comparison of parametric representations for monosyllabic word recognition in continuously spoken sentences," Acoustics, Speech and Signal Processing, IEEE Transactions on , vol.28, no.4, pp.357,366, Aug 1980
	- Xuedong Huang, Alex Acero, Hsiao-Wuen Hon. 2001. Spoken Language Processing: A Guide to Theory, Algorithm, and System Development (1st ed.). Prentice Hall PTR, Upper Saddle River, NJ, USA.
	– the [librosa](https://github.com/bmcfee/librosa "librosa") AFE library
+ *returns:* Number

##Perceptual
###"loudness"
+ *description:* The loudness of the spectrum as perceived by a human, using Bark bands. Outputs an object consisting of Specific Loudness (calculated for each Bark band) and Total Loudness (a sum of the specific loudness coefficients).
+ *source:* yaafe
+ *returns:* Number

###"perceptualSpread"
+ *description:* How 'full' a human will perceive the sound to be.
+ *source:* yaafe
+ *returns:* Number

###"perceptualSharpness"
+ *description:* Perceived sharpness of the loudness Bark coefficients.
+ *source:* yaafe
+ *returns:* Number

