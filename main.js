// Meyda Javascript DSP library
var featureExtractors = {
	"rms": function(input,bufferSize){
		return Math.sqrt(input.reduce(function(last,current){
			return Math.pow(current,2);
		},0)/bufferSize)
	},
	"energy": function(input, bufferSize) {
		return input.reduce(function(prev, cur) {
			return prev + Math.pow(Math.abs(cur),2);
		}, 0);
	}
}

var Meyda = function(audioContext,callback,feature,bufferSize){
	var node = audioContext.createScriptProcessor(bufferSize, 1, 1);
	node.onaudioprocess = function(e) {
		// type float32Array
		var input = e.inputBuffer.getChannelData(0);

		// Convert from float32Array to Array
		input = Array.prototype.slice.call(input);
		if(typeof feature === "object"){
			for (var x = 0; x < feature.length; x++){
				callback(featureExtractors[feature[x]](input,bufferSize));
			}
		}
		else if (typeof feature === "string"){
			callback(featureExtractors[feature](input,bufferSize));
		}
		else{
			throw "Invalid Feature Format";
		}
	}
	return node;
}
