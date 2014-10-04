// Meyda Javascript DSP library

var Meyda = function(audioContext,source,bufferSize){
	//add some utilities to array prototype
	Float32Array.prototype.meanValue = function() {
		var sum = 0;
		for(var i = 0; i < this.length; i++){
		    sum += parseInt(this[i], 10);
		}

		return sum/this.length;
	};

	var self = this;

	self.featureExtractors = {
		"rms": function(bufferSize, m, spectrum, signal){
			var rms = 0;
			for(var i = 0 ; i < signal.length ; i++){
				rms += Math.pow(signal[i],2);
			}
			rms = Math.sqrt(rms);
			return rms;
		},
		"energy": function(bufferSize, m, spectrum, signal) {
			var energy = 0;
			for(var i = 0 ; i < signal.length ; i++){
				energy += Math.pow(Math.abs(signal[i]),2);
			}
			return energy;
		},
		"spectrum": function(bufferSize, m, spectrum) {
			return spectrum;
		},
		"spectralSlope": function(bufferSize, m, spectrum) {
			//linear regression
			var x = 0.0, y = 0.0, xy = 0.0, x2 = 0.0;
			for (var i = 0; i < spectrum.length; i++) {
				y += spectrum[i];
				xy += spectrum[i] * i;
				x2 += i*i;
			};

			x = spectrum.length/2;
			y /= spectrum.length;
			xy /= spectrum.length;
			x2 /= spectrum.length;

			return (x*y - xy)/(x*x - x2);
		},
		"spectralCentroid": function(bufferSize, m, spectrum){
			var magspec = m.featureExtractors.amplitudeSpectrum(bufferSize, m, spectrum);
			var numerator = 0;
			var denominator = 0;
			for(var i = 0; i < bufferSize-1; i++){
				numerator += magspec[i]*i*audioContext.sampleRate/bufferSize
				denominator += i*audioContext.sampleRate/bufferSize
			}
			return numerator/denominator;
		},
		"spectralRolloff": function(bufferSize, m, spectrum){
			var magspec = m.featureExtractors.amplitudeSpectrum(bufferSize, m, spectrum);
			var ec = 0;
			for(var i = 0; i < magspec.length; i++){
				ec += magspec[i];
			}
			var threshold = 0.99 * ec;
			var n = magspec.length - 1;
			while(ec > threshold && n >= 0){
				ec -= magspec[n];
            	n--;
			}
			return ec;
		},
		"spectralFlatness": function(bufferSize, m, spectrum){
			var powspec = m.featureExtractors.powerSpectrum(bufferSize, m, spectrum);
			var numerator = 0;
			var denominator = 0;
			for(var i = 0; i < powspec.length-1;i++){
				numerator += Math.log(powspec[i]);
				denominator += powspec[i];
			}
			return Math.exp((1/powspec.length)*numerator)/((1/powspec.length)*denominator);
		},
		"amplitudeSpectrum": function(bufferSize, m, spectrum){
			var ampRatioSpectrum = new Float32Array(spectrum.length);
			for (var i = 0; i < spectrum.length; i++) {
				ampRatioSpectrum[i] =  Math.pow(10,spectrum[i]/20);

			}
			return ampRatioSpectrum;
		},
		"zcr": function(bufferSize, m, spectrum, signal){
			var zcr = 0;
			for(var i = 0; i < signal.length; i++){
				if((signal[i] >= 0 && signal[i+1] < 0) || (signal[i] < 0 && signal[i+1] >= 0)){
					zcr++;
				}
			}
			return zcr;
		},
		"powerSpectrum": function(bufferSize, m, spectrum){
			var powerRatioSpectrum = new Float32Array(spectrum.length);
			for (var i = 0; i < spectrum.length; i++) {
				powerRatioSpectrum[i] =  Math.pow(10,spectrum[i]/10);

			}
			return powerRatioSpectrum;
		},
		"loudness": function(bufferSize, m, spectrum){

			var barkScale = Float32Array(bufferSize);
			var NUM_BARK_BANDS = 24;
			var spec = Float32Array(NUM_BARK_BANDS);
			var tot = 0;
			var normalisedSpectrum = m.featureExtractors["normalisedSpectrum"](bufferSize, m, spectrum);

			for(var i = 0; i < barkScale.length; i++){
				barkScale[i] = i*m.audioContext.sampleRate/(bufferSize);
				barkScale[i] = 13*Math.atan(barkScale[i]/1315.8) + 3.5* Math.atan(Math.pow(barkScale[i]/7518,2));
			}

			var bbLimits = [0];
			var currentBandEnd = barkScale[bufferSize-1]/NUM_BARK_BANDS;
			var currentBand = 1;
			for(var i = 0; i<bufferSize; i++){
				while(barkScale[i] > currentBandEnd){
					bbLimits[currentBand] = i;
					currentBand++;
					currentBandEnd = (currentBand*barkScale[bufferSize-1])/NUM_BARK_BANDS;
				}
			}

			bbLimits[NUM_BARK_BANDS] = bufferSize-1;

			for (var i = 1; i <= NUM_BARK_BANDS; i++){
				var sum = 0;
				for (var j = bbLimits[i-1] ; j < bbLimits[i] ; j++) {

					sum += normalisedSpectrum[j];
				}
				spec[i] = Math.pow(sum,0.23);
			}

			for (var i = 0; i < spec.length; i++){
				tot += spec[i];
			}


			return {
				specific: spec,
				total: tot
			};
		},
		"perceptualSpread": function(bufferSize, m, spectrum) {
			var loudness = m.featureExtractors["loudness"](bufferSize, m, spectrum);

			var max = 0;
			for (var i=0; i<loudness.specific.length; i++) {
				if (loudness.specific[i] > max) {
					max = loudness.specific[i];
				}
			}

			var spread = Math.pow((loudness.total - max)/loudness.total, 2);

			return spread;
		},
		"perceptualSharpness": function(bufferSize,m,spectrum) {
			var loudness = m.featureExtractors["loudness"](bufferSize, m, spectrum);
			var spec = loudness.specific;
			var output = 0;

			for (var i = 0; i < spec.length; i++) {
				if (i < 15) {
					output += (i+1) * spec[i+1];
				}
				else {
					output += 0.066 * Math.exp(0.171 * (i+1));
				}
			};
			output *= 0.11/loudness.total;

			return output;
		},
		"mfcc": function(bufferSize, m, spectrum){
			var freqToMel = function(freqValue){
				var melValue = 1125*Math.log(1+(freqValue/700));
				return melValue
			};
			var melToFreq = function(melValue){
				var freqValue = 700*(Math.exp(melValue/1125)-1);
				return freqValue;
			};
			var numFilters = 26; //26 filters is standard
			var melValues = Float32Array(numFilters);
			var melValuesInFreq = Float32Array(numFilters);
			var lowerLimitFreq = 50;
			var upperLimitFreq = audioContext.sampleRate/2;
			var lowerLimitMel = freqToMel(lowerLimitFreq);
			var upperLimitMel = freqToMel(upperLimitFreq);

			melValues[0] = lowerLimitMel;
			melValues[melValues.length-1] = upperLimitMel;

			var range = upperLimitMel-lowerLimitMel;
			var valueToAdd = range/(numFilters-2);

			for(var i = 1; i < melValues.length-1; i++){
				melValues[i] = i*valueToAdd;
			}

			var fftBinsOfFreq = Array(numFilters);
			for (var i = 0; i < melValues.length; i++) {
				melValuesInFreq[i] = melToFreq(melValues[i]);
				fftBinsOfFreq[i] = Math.floor((bufferSize+1)*melValuesInFreq[i]/audioContext.sampleRate);
			};

			return fftBinsOfFreq;
		}
	}
	//create nodes
	self.analyser = audioContext.createAnalyser();
	self.analyser.fftSize = bufferSize;
	self.audioContext = audioContext;

	self.get = function(feature) {

		var spectrum = new Float32Array(bufferSize/2);
		self.analyser.getFloatFrequencyData(spectrum);

		var signal = new Float32Array(bufferSize);
		self.analyser.getFloatTimeDomainData(signal);

		if(typeof feature === "object"){
			var results = new Array();
			for (var x = 0; x < feature.length; x++){
				results.push(self.featureExtractors[feature[x]](bufferSize, self, spectrum, signal));
			}
			return results;
		}
		else if (typeof feature === "string"){
			return self.featureExtractors[feature](bufferSize, self, spectrum, signal);
		}
		else{
			throw "Invalid Feature Format";
		}
	}
	source.connect(self.analyser);
	return self;
}
