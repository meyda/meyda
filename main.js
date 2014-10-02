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
	"normalisedSpectrum": function(bufferSize, m, spectrum){
		var ampRatioSpectrum = new Float32Array(bufferSize/2);
		for (var i = 0; i < spectrum.length; i++) {
			ampRatioSpectrum[i] =  Math.pow(10,spectrum[i]/20);

		}
		return ampRatioSpectrum;
	},
	"loudness": function(bufferSize, m, spectrum){

		var barkScale = Float32Array(bufferSize);
		var NUM_BARK_BANDS = 20;
		var output = Float32Array(NUM_BARK_BANDS);
		var normalisedSpectrum = m.featureExtractors["normalisedSpectrum"](bufferSize, m, spectrum);

		for(var i = 0; i < barkScale.length; i++){
			barkScale[i] = i*m.audioContext.sampleRate/(bufferSize);
			barkScale[i] = 13*Math.atan(barkScale[i]/1315.8) + 3.5* Math.atan(Math.pow(barkScale[i]/7518,2));
		}

		// console.log("bark: ", barkScale);
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
		// console.log("bbLimits", bbLimits);
		bbLimits[NUM_BARK_BANDS] = bufferSize-1;
		
		for (var i = 1; i <= NUM_BARK_BANDS; i++){
			var sum = 0;
			for (var j = bbLimits[i-1] ; j < bbLimits[i] ; j++) {
				if (i=19){
					console.log("spec",normalisedSpectrum[j]);
				}
				
				sum += normalisedSpectrum[j];
			}
			// console.log("end bblimit",bbLimits[i]);
			output[i-1] = Math.pow(sum,0.23);
		}
		return output;
	}
}

	//create nodes
	self.analyser = audioContext.createAnalyser();
	self.analyser.fftSize = bufferSize;
	self.audioContext = audioContext;

	self.get = function(feature) {

		var spectrum = new Float32Array(bufferSize/2);
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
