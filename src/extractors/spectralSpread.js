import * as util from './extractorUtilities';

export default function(){
	console.log(typeof arguments[0].ampSpectrum);
	if(typeof arguments[0].ampSpectrum !== "object"){
		throw new TypeError;
	}
	var ampspec = arguments[0].ampSpectrum;
	return Math.sqrt(util.mu(2,ampspec)-Math.pow(util.mu(1,ampspec),2));
}
