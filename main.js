// Meyda Javascript DSP library 
var Meyda = function(audioContext,callback,bufferSize=256){
	var node = audioContext.createScriptProcessor(bufferSize, 1, 1);
	node.onaudioprocess = function(e) {
		// type float32Array
		var input = e.inputBuffer.getChannelData(0);

		// Convert from float32Array to Array
		input = Array.prototype.slice.call(input);
		callback(Math.sqrt(input.reduce(function(last,current){
			return Math.pow(current,2);
		},0)/bufferSize))
	}
	return node;
}