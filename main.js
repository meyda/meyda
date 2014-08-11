// Meyda Javascript DSP library 
var Medya = function(audioContext,callback,bufferSize=256){
	var node = audioContext.createScriptProcessor(bufferSize, 1, 1);
	node.onaudioprocess = function(e) {
		var input = e.inputBuffer.getChannelData(0);
		var output = e.outputBuffer.getChannelData(0);
		console.log("isArray"+input.isArray())
		callback(Math.sqrt(input.reduce(function(last,current){
			return Math.pow(current,2);
		},0)/bufferSize))
	}
	return node;
}