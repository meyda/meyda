// Meyda Javascript DSP library
function Meyda(callback,feature,bufferSize=256){
	var node = audioContext.createScriptProcessor(bufferSize, 1, 1);
    node.onaudioprocess = function(e) {
        var input = e.inputBuffer.getChannelData(0);
        var output = e.outputBuffer.getChannelData(0);
        
    }
    return node;
}