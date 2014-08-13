// Meyda Javascript DSP library
var featureExtractors = {
	"rms": function(input,bufferSize){
		return Math.sqrt(input.reduce(function(last,current){
			return Math.pow(current,2);
		},0)/bufferSize)
	}
}

var Meyda = function(audioContext,callback,feature,bufferSize=256){
	var node = audioContext.createScriptProcessor(bufferSize, 1, 1);
	node.onaudioprocess = function(e) {
		// type float32Array
		var input = e.inputBuffer.getChannelData(0);

		// Convert from float32Array to Array
		input = Array.prototype.slice.call(input);
		callback(featureExtractors[feature](input,bufferSize));
	}
	return node;
}