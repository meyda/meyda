export default function(){
	if(typeof arguments[0].ampSpectrum !== "object"){
		throw new TypeError;
	}
	var ampspec = arguments[0].ampSpectrum;
	var numerator = 0;
	var denominator = 0;
	for(var i = 0; i < ampspec.length;i++){
		numerator += Math.log(ampspec[i]);
		denominator += ampspec[i];
	}
	return Math.exp(numerator/ampspec.length)*ampspec.length/denominator;
}
