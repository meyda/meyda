import * as util from './extractorUtilities';

export default function(){
	if(typeof arguments[0].ampSpectrum !== "object"){
		throw new TypeError;
	}
	return util.mu(1,arguments[0].ampSpectrum);
}
