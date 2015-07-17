import * as util from './extractorUtilities';

export default function(){
	if(typeof arguments[0].ampSpectrum !== "object"){
		throw new TypeError;
	}
	var ampspec = arguments[0].ampSpectrum;
	var mu1 = util.mu(1,ampspec);
	var mu2 = util.mu(2,ampspec);
	var mu3 = util.mu(3,ampspec);
	var numerator = 2*Math.pow(mu1,3)-3*mu1*mu2+mu3;
	var denominator = Math.pow(Math.sqrt(mu2-Math.pow(mu1,2)),3);
	return numerator/denominator;
}
