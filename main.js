// Meyda Javascript DSP library
function Meyda(audioContext,callback,bufferSize=256){
	var node = audioContext.createScriptProcessor(bufferSize, 1, 1);
    node.onaudioprocess = function(e) {
        var input = e.inputBuffer.getChannelData(0);
        var output = e.outputBuffer.getChannelData(0);
        var tally = 0;
        for (var x = 0; x < input.length; x++){
        	tally+=Math.pow(input[x],2);
        }
        callback(Math.sqrt(1/bufferSize*tally))
    }
    return node;
}