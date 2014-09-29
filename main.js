// Meyda Javascript DSP library
var featureExtractors = {
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
	"spectrum": function(bufferSize, m) {
		var s = new Float32Array(bufferSize);
		m.analyser.getFloatFrequencyData(s);
		return s;
	},
	"spectralSlope": function(bufferSize, m) {
		//get spectrum
		var s = new Float32Array(bufferSize);
		m.analyser.getFloatFrequencyData(s);
		//linear regression
		var x = 0.0, y = 0.0, xy = 0.0, x2 = 0.0;
		for (var i = 0; i < s.length; i++) {
			y += s[i];
			xy += s[i] * i;
			x2 += i*i;
		};

		x = s.length/2;
		y /= s.length;
		xy /= s.length;
		x2 /= s.length;

		return (x*y - xy)/(x*x - x2);
	}
}

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

	//create nodes
	self.analyser = audioContext.createAnalyser();
	self.analyser.fftSize = bufferSize;

	self.get = function(feature) {
		if(typeof feature === "object"){
			var results = new Array();
			for (var x = 0; x < feature.length; x++){
				results.push(featureExtractors[feature[x]](bufferSize, self));
			}
			return results;
		}
		else if (typeof feature === "string"){
			return featureExtractors[feature](bufferSize, self);
		}
		else{
			throw "Invalid Feature Format";
		}
	}
	source.connect(self.analyser);
	return self;
}
