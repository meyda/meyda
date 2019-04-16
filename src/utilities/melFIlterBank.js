import {freqToMel, melToFreq} from './utilities';

export function createMelFilterBank(numFilters, sampleRate, bufferSize) {
    //the +2 is the upper and lower limits
    let melValues = new Float32Array(numFilters + 2);
    let melValuesInFreq = new Float32Array(numFilters + 2);

    //Generate limits in Hz - from 0 to the nyquist.
    let lowerLimitFreq = 0;
    let upperLimitFreq = sampleRate / 2;

    //Convert the limits to Mel
    let lowerLimitMel = freqToMel(lowerLimitFreq);
    let upperLimitMel = freqToMel(upperLimitFreq);

    //Find the range
    let range = upperLimitMel - lowerLimitMel;

    //Find the range as part of the linear interpolation
    let valueToAdd = range / (numFilters + 1);

    let fftBinsOfFreq = Array(numFilters + 2);

    for (let i = 0; i < melValues.length; i++) {
        // Initialising the mel frequencies
        // They're a linear interpolation between the lower and upper limits.
        melValues[i] = i * valueToAdd;

        // Convert back to Hz
        melValuesInFreq[i] = melToFreq(melValues[i]);

        // Find the corresponding bins
        fftBinsOfFreq[i] = Math.floor((bufferSize + 1) *
            melValuesInFreq[i] / sampleRate);
    }

    var filterBank = Array(numFilters);
    for (let j = 0; j < filterBank.length; j++) {
        // Create a two dimensional array of size numFilters * (buffersize/2)+1
        // pre-populating the arrays with 0s.
        filterBank[j] = Array.apply(
            null,
            new Array((bufferSize / 2) + 1)).map(Number.prototype.valueOf, 0);
        createSlopes(fftBinsOfFreq, filterBank, j);
    }

    return filterBank;
}

function createSlopes(fftBinsOfFreq, filterBank, startIndex){
    //creating the lower and upper slopes for each bin
    for (let i = fftBinsOfFreq[startIndex]; i < fftBinsOfFreq[startIndex + 1]; i++) {
        filterBank[startIndex][i] = (i - fftBinsOfFreq[startIndex]) /
            (fftBinsOfFreq[startIndex + 1] - fftBinsOfFreq[startIndex]);
    }

    for (let i = fftBinsOfFreq[startIndex + 1]; i < fftBinsOfFreq[startIndex + 2]; i++) {
        filterBank[startIndex][i] = (fftBinsOfFreq[startIndex + 2] - i) /
            (fftBinsOfFreq[startIndex + 2] - fftBinsOfFreq[startIndex + 1]);
    }
}
