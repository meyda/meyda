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
		"rms": function(bufferSize, m){
			var timeData = new Float32Array(bufferSize);
			var rms = 0;
			m.analyser.getFloatTimeDomainData(timeData);
			for(var i = 0 ; i < timeData.length ; i++){
				rms += Math.pow(timeData[i],2);
			}
			rms = Math.sqrt(rms);
			return rms;
		},
		"energy": function(bufferSize, m) {
			var timeData = new Float32Array(bufferSize);
			var energy = 0;
			m.analyser.getFloatTimeDomainData(timeData);
			for(var i = 0 ; i < timeData.length ; i++){
				energy += Math.pow(Math.abs(timeData[i]),2);
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
			var magspec = m.featureExtractors.ampRatioSpectrum(bufferSize, m, spectrum);
			var numerator = 0;
			var denominator = 0;
			for(var i = 0; i < bufferSize-1; i++){
				numerator += magspec[i]*i*audioContext.sampleRate/bufferSize
				denominator += i*audioContext.sampleRate/bufferSize
			}
			return numerator/denominator;
		},
		"amplitudeSpectrum": function(bufferSize, m, spectrum){
			var ampRatioSpectrum = new Float32Array(bufferSize);
			for (var i = 0; i < spectrum.length; i++) {
				ampRatioSpectrum[i] =  Math.pow(10,spectrum[i]/20);

			}
			return ampRatioSpectrum;
		}
	}

	//create nodes
	self.analyser = audioContext.createAnalyser();
	self.analyser.fftSize = bufferSize;

	self.get = function(feature) {

		var spectrum = new Float32Array(bufferSize);
		self.analyser.getFloatFrequencyData(spectrum);

		if(typeof feature === "object"){
			var results = new Array();
			for (var x = 0; x < feature.length; x++){
				results.push(self.featureExtractors[feature[x]](bufferSize, self, spectrum));
			}
			return results;
		}
		else if (typeof feature === "string"){
			return self.featureExtractors[feature](bufferSize, self, spectrum);
		}
		else{
			throw "Invalid Feature Format";
		}
	}
	source.connect(self.analyser);
	return self;
}
