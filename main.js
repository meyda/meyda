// Meyda Javascript DSP library
var featureExtractors = {
	"rms": function(bufferSize, _analyser){
		var timeData = new Float32Array(bufferSize);
		_analyser.getFloatTimeDomainData(timeData);
		return Math.sqrt(timeData.reduce(function(last,current){
			return Math.pow(current,2);
		},0)/bufferSize)
	},
	"energy": function(bufferSize, _analyser) {
		var timeData = new Float32Array(bufferSize);
		_analyser.getFloatTimeDomainData(timeData);
		return timeData.reduce(function(prev, cur) {
			return prev + Math.pow(Math.abs(cur),2);
		}, 0);
	},
	"spectrum": function(bufferSize, _analyser) {
		var s = new Uint8Array(bufferSize);
		_analyser.getByteFrequencyData(s);
		return s;
	},
	"spectralSlope": function(bufferSize, _analyser) {
		//get spectrum

		var s = new Uint8Array(bufferSize);
		_analyser.getByteFrequencyData(s);
		//linear regression
		var x, y, xy, x2;

		// y = s.meanValue();
		x = s.length/2;

		xy = 0.0;

		for (var i = 0; i < s.length; i++) {

			y+=s[i];
			xy += s[i] * i;
		};

		y /= s.length;
		xy /= s.length;

		x2 = 0.0;
		for(var i = 0; i < s.length; i++){
			x2 += i*i;
		}

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


	//create nodes
	var analyser = audioContext.createAnalyser();
	analyser.fftSize = bufferSize;

	this.get = function(feature) {
		if(typeof feature === "object"){
			for (var x = 0; x < feature.length; x++){
				return featureExtractors[feature[x]](bufferSize, analyser);
			}
		}
		else if (typeof feature === "string"){
			return featureExtractors[feature](bufferSize, analyser);
		}
		else{
			throw "Invalid Feature Format";
		}
	}

	/*this.getSpectrum = function(){
		var s = new Uint8Array(bufferSize);
		analyser.getByteFrequencyData(s);
		console.log(s);
		return s;
	}*/

	//business
	/*processor.onaudioprocess = function(e) {
		// type float32Array
		var input = e.inputBuffer.getChannelData(0);
		// Convert from float32Array to Array
		input = Array.prototype.slice.call(input);

		if(typeof feature === "object"){
			for (var x = 0; x < feature.length; x++){
				callback(featureExtractors[feature[x]](input, bufferSize, analyser));
			}
		}
		else if (typeof feature === "string"){
			callback(featureExtractors[feature](input, bufferSize, analyser));
		}
		else{
			throw "Invalid Feature Format";
		}
	}*/
	source.connect(analyser);
	return this;
}
