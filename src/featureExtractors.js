import rms from 'extractors/rms';
import energy from 'extractors/energy';
import spectralSlope from 'extractors/spectralSlope';
import spectralCentroid from 'extractors/spectralCentroid';
import spectralRolloff from 'extractors/spectralRolloff';
import spectralFlatness from 'extractors/spectralFlatness';
import spectralSpread from 'extractors/spectralSpread';
import spectralSkewness from 'extractors/spectralSkewness';
import spectralKurtosis from 'extractors/spectralKurtosis';
import zcr from 'extractors/zcr';
import loudness from 'extractors/loudness';
import perceptualSpread from 'extractors/perceptualSpread';
import perceptualSharpness from 'extractors/perceptualSharpness';
import mfcc from 'extractors/mfcc';

export default {
  "buffer" : function(bufferSize,m){
    return m.signal;
  },
  "rms": rms,
  "energy": energy,
  "complexSpectrum": function(bufferSize, m) {
    return m.complexSpectrum;
  },
  "spectralSlope": spectralSlope,
  "spectralCentroid": spectralCentroid,
  "spectralRolloff": spectralRolloff,
  "spectralFlatness": spectralFlatness,
  "spectralSpread": spectralSpread,
  "spectralSkewness": spectralSkewness,
  "spectralKurtosis": spectralKurtosis,
  "amplitudeSpectrum": function(bufferSize, m){
    return m.ampSpectrum;
  },
  "zcr": zcr,
  "loudness": loudness,
  "perceptualSpread": perceptualSpread,
  "perceptualSharpness": perceptualSharpness,
  "mfcc": mfcc
}
