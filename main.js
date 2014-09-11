// Meyda Javascript DSP library
var featureExtractors = {
	"rms": function(input, bufferSize, _analyser){
		return Math.sqrt(input.reduce(function(last,current){
			return Math.pow(current,2);
		},0)/bufferSize)
	},
	"energy": function(input, bufferSize, _analyser) {
		return input.reduce(function(prev, cur) {
			return prev + Math.pow(Math.abs(cur),2);
		}, 0);
	},
	"spectrum": function(input, bufferSize, _analyser) {
		var s = new Float32Array;
		_analyser.getFloatFrequencyData(s);
		return s;
	}

}

var Meyda = function(audioContext,callback,feature,bufferSize){
	var processor = audioContext.createScriptProcessor(bufferSize, 1, 1);
	var analyser = audioContext.createAnalyser();
	analyser.fftSize = bufferSize;
	processor.onaudioprocess = function(e) {
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
	}
	analyser.connect(processor);
	return analyser;
}
