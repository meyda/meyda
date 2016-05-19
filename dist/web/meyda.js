(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = require('./src/dct.js');

},{"./src/dct.js":2}],2:[function(require,module,exports){
/*===========================================================================*\
 * Discrete Cosine Transform
 *
 * (c) Vail Systems. Joshua Jung and Ben Bryan. 2015
 *
 * This code is not designed to be highly optimized but as an educational
 * tool to understand the Mel-scale and its related coefficients used in
 * human speech analysis.
\*===========================================================================*/
cosMap = null;

// Builds a cosine map for the given input size. This allows multiple input sizes to be memoized automagically
// if you want to run the DCT over and over.
var memoizeCosines = function(N) {
  cosMap = cosMap || {};
  cosMap[N] = new Array(N*N);

  var PI_N = Math.PI / N;

  for (var k = 0; k < N; k++) {
    for (var n = 0; n < N; n++) {
      cosMap[N][n + (k * N)] = Math.cos(PI_N * (n + 0.5) * k);
    }
  }
};

function dct(signal, scale) {
  var L = signal.length;
  scale = scale || 2;

  if (!cosMap || !cosMap[L]) memoizeCosines(L);

  var coefficients = signal.map(function () {return 0;});

  return coefficients.map(function (__, ix) {
    return scale * signal.reduce(function (prev, cur, ix_, arr) {
      return prev + (cur * cosMap[L][ix_ + (ix * L)]);
    }, 0);
  });
};

module.exports = dct;

},{}],3:[function(require,module,exports){
'use strict';

!function(exports, undefined) {

  var
    // If the typed array is unspecified, use this.
    DefaultArrayType = Float32Array,
    // Simple math functions we need.
    sqrt = Math.sqrt,
    sqr = function(number) {return Math.pow(number, 2)},
    // Internal convenience copies of the exported functions
    isComplexArray,
    ComplexArray

  exports.isComplexArray = isComplexArray = function(obj) {
    return obj !== undefined &&
      obj.hasOwnProperty !== undefined &&
      obj.hasOwnProperty('real') &&
      obj.hasOwnProperty('imag')
  }

  exports.ComplexArray = ComplexArray = function(other, opt_array_type){
    if (isComplexArray(other)) {
      // Copy constuctor.
      this.ArrayType = other.ArrayType
      this.real = new this.ArrayType(other.real)
      this.imag = new this.ArrayType(other.imag)
    } else {
      this.ArrayType = opt_array_type || DefaultArrayType
      // other can be either an array or a number.
      this.real = new this.ArrayType(other)
      this.imag = new this.ArrayType(this.real.length)
    }

    this.length = this.real.length
  }

  ComplexArray.prototype.toString = function() {
    var components = []

    this.forEach(function(c_value, i) {
      components.push(
        '(' +
        c_value.real.toFixed(2) + ',' +
        c_value.imag.toFixed(2) +
        ')'
      )
    })

    return '[' + components.join(',') + ']'
  }

  // In-place mapper.
  ComplexArray.prototype.map = function(mapper) {
    var
      i,
      n = this.length,
      // For GC efficiency, pass a single c_value object to the mapper.
      c_value = {}

    for (i = 0; i < n; i++) {
      c_value.real = this.real[i]
      c_value.imag = this.imag[i]
      mapper(c_value, i, n)
      this.real[i] = c_value.real
      this.imag[i] = c_value.imag
    }

    return this
  }

  ComplexArray.prototype.forEach = function(iterator) {
    var
      i,
      n = this.length,
      // For consistency with .map.
      c_value = {}

    for (i = 0; i < n; i++) {
      c_value.real = this.real[i]
      c_value.imag = this.imag[i]
      iterator(c_value, i, n)
    }
  }

  ComplexArray.prototype.conjugate = function() {
    return (new ComplexArray(this)).map(function(value) {
      value.imag *= -1
    })
  }

  // Helper so we can make ArrayType objects returned have similar interfaces
  //   to ComplexArrays.
  function iterable(obj) {
    if (!obj.forEach)
      obj.forEach = function(iterator) {
        var i, n = this.length

        for (i = 0; i < n; i++)
          iterator(this[i], i, n)
      }

    return obj
  }

  ComplexArray.prototype.magnitude = function() {
    var mags = new this.ArrayType(this.length)

    this.forEach(function(value, i) {
      mags[i] = sqrt(sqr(value.real) + sqr(value.imag))
    })

    // ArrayType will not necessarily be iterable: make it so.
    return iterable(mags)
  }
}(typeof exports === 'undefined' && (this.complex_array = {}) || exports)

},{}],4:[function(require,module,exports){
'use strict';

!function(exports, complex_array) {

  var
    ComplexArray = complex_array.ComplexArray,
    // Math constants and functions we need.
    PI = Math.PI,
    SQRT1_2 = Math.SQRT1_2,
    sqrt = Math.sqrt,
    cos = Math.cos,
    sin = Math.sin

  ComplexArray.prototype.FFT = function() {
    return FFT(this, false)
  }

  exports.FFT = function(input) {
    return ensureComplexArray(input).FFT()
  }

  ComplexArray.prototype.InvFFT = function() {
    return FFT(this, true)
  }

  exports.InvFFT = function(input) {
    return ensureComplexArray(input).InvFFT()
  }

  // Applies a frequency-space filter to input, and returns the real-space
  // filtered input.
  // filterer accepts freq, i, n and modifies freq.real and freq.imag.
  ComplexArray.prototype.frequencyMap = function(filterer) {
    return this.FFT().map(filterer).InvFFT()
  }

  exports.frequencyMap = function(input, filterer) {
    return ensureComplexArray(input).frequencyMap(filterer)
  }

  function ensureComplexArray(input) {
    return complex_array.isComplexArray(input) && input ||
        new ComplexArray(input)
  }

  function FFT(input, inverse) {
    var n = input.length

    if (n & (n - 1)) {
      return FFT_Recursive(input, inverse)
    } else {
      return FFT_2_Iterative(input, inverse)
    }
  }

  function FFT_Recursive(input, inverse) {
    var
      n = input.length,
      // Counters.
      i, j,
      output,
      // Complex multiplier and its delta.
      f_r, f_i, del_f_r, del_f_i,
      // Lowest divisor and remainder.
      p, m,
      normalisation,
      recursive_result,
      _swap, _real, _imag

    if (n === 1) {
      return input
    }

    output = new ComplexArray(n, input.ArrayType)

    // Use the lowest odd factor, so we are able to use FFT_2_Iterative in the
    // recursive transforms optimally.
    p = LowestOddFactor(n)
    m = n / p
    normalisation = 1 / sqrt(p)
    recursive_result = new ComplexArray(m, input.ArrayType)

    // Loops go like O(n Σ p_i), where p_i are the prime factors of n.
    // for a power of a prime, p, this reduces to O(n p log_p n)
    for(j = 0; j < p; j++) {
      for(i = 0; i < m; i++) {
        recursive_result.real[i] = input.real[i * p + j]
        recursive_result.imag[i] = input.imag[i * p + j]
      }
      // Don't go deeper unless necessary to save allocs.
      if (m > 1) {
        recursive_result = FFT(recursive_result, inverse)
      }

      del_f_r = cos(2*PI*j/n)
      del_f_i = (inverse ? -1 : 1) * sin(2*PI*j/n)
      f_r = 1
      f_i = 0

      for(i = 0; i < n; i++) {
        _real = recursive_result.real[i % m]
        _imag = recursive_result.imag[i % m]

        output.real[i] += f_r * _real - f_i * _imag
        output.imag[i] += f_r * _imag + f_i * _real

        _swap = f_r * del_f_r - f_i * del_f_i
        f_i = f_r * del_f_i + f_i * del_f_r
        f_r = _swap
      }
    }

    // Copy back to input to match FFT_2_Iterative in-placeness
    // TODO: faster way of making this in-place?
    for(i = 0; i < n; i++) {
      input.real[i] = normalisation * output.real[i]
      input.imag[i] = normalisation * output.imag[i]
    }

    return input
  }

  function FFT_2_Iterative(input, inverse) {
    var
      n = input.length,
      // Counters.
      i, j,
      output, output_r, output_i,
      // Complex multiplier and its delta.
      f_r, f_i, del_f_r, del_f_i, temp,
      // Temporary loop variables.
      l_index, r_index,
      left_r, left_i, right_r, right_i,
      // width of each sub-array for which we're iteratively calculating FFT.
      width

    output = BitReverseComplexArray(input)
    output_r = output.real
    output_i = output.imag
    // Loops go like O(n log n):
    //   width ~ log n; i,j ~ n
    width = 1
    while (width < n) {
      del_f_r = cos(PI/width)
      del_f_i = (inverse ? -1 : 1) * sin(PI/width)
      for (i = 0; i < n/(2*width); i++) {
        f_r = 1
        f_i = 0
        for (j = 0; j < width; j++) {
          l_index = 2*i*width + j
          r_index = l_index + width

          left_r = output_r[l_index]
          left_i = output_i[l_index]
          right_r = f_r * output_r[r_index] - f_i * output_i[r_index]
          right_i = f_i * output_r[r_index] + f_r * output_i[r_index]

          output_r[l_index] = SQRT1_2 * (left_r + right_r)
          output_i[l_index] = SQRT1_2 * (left_i + right_i)
          output_r[r_index] = SQRT1_2 * (left_r - right_r)
          output_i[r_index] = SQRT1_2 * (left_i - right_i)
          temp = f_r * del_f_r - f_i * del_f_i
          f_i = f_r * del_f_i + f_i * del_f_r
          f_r = temp
        }
      }
      width <<= 1
    }

    return output
  }

  function BitReverseIndex(index, n) {
    var bitreversed_index = 0

    while (n > 1) {
      bitreversed_index <<= 1
      bitreversed_index += index & 1
      index >>= 1
      n >>= 1
    }
    return bitreversed_index
  }

  function BitReverseComplexArray(array) {
    var n = array.length,
        flips = {},
        swap,
        i

    for(i = 0; i < n; i++) {
      var r_i = BitReverseIndex(i, n)

      if (flips.hasOwnProperty(i) || flips.hasOwnProperty(r_i)) continue

      swap = array.real[r_i]
      array.real[r_i] = array.real[i]
      array.real[i] = swap

      swap = array.imag[r_i]
      array.imag[r_i] = array.imag[i]
      array.imag[i] = swap

      flips[i] = flips[r_i] = true
    }

    return array
  }

  function LowestOddFactor(n) {
    var factor = 3,
        sqrt_n = sqrt(n)

    while(factor <= sqrt_n) {
      if (n % factor === 0) return factor
      factor = factor + 2
    }
    return n
  }

}(
  typeof exports === 'undefined' && (this.fft = {}) || exports,
  typeof require === 'undefined' && (this.complex_array) ||
    require('./complex_array')
)

},{"./complex_array":3}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.default = function () {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  if (_typeof(args[0].signal) !== 'object') {
    throw new TypeError();
  }

  var energy = 0;
  for (var i = 0; i < args[0].signal.length; i++) {
    energy += Math.pow(Math.abs(args[0].signal[i]), 2);
  }

  return energy;
};

module.exports = exports['default'];

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mu = mu;
function mu(i, amplitudeSpect) {
  var numerator = 0;
  var denominator = 0;
  for (var k = 0; k < amplitudeSpect.length; k++) {
    numerator += Math.pow(k, i) * Math.abs(amplitudeSpect[k]);
    denominator += amplitudeSpect[k];
  }

  return numerator / denominator;
}

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.default = function (args) {
  if (_typeof(args.ampSpectrum) !== 'object' || _typeof(args.barkScale) !== 'object') {
    throw new TypeError();
  }

  var NUM_BARK_BANDS = 24;
  var normalisedSpectrum = args.ampSpectrum;
  var bbLimits = new Int32Array(NUM_BARK_BANDS + 1);
  var specific = new Float32Array(NUM_BARK_BANDS);

  bbLimits[0] = 0;
  var currentBandEnd = args.barkScale[normalisedSpectrum.length - 1] / NUM_BARK_BANDS;
  var currentBand = 1;
  var total = 0;
  for (var i = 0; i < normalisedSpectrum.length; i++) {
    while (args.barkScale[i] > currentBandEnd) {
      bbLimits[currentBand++] = i;
      currentBandEnd = currentBand * args.barkScale[normalisedSpectrum.length - 1] / NUM_BARK_BANDS;
    }
  }

  bbLimits[NUM_BARK_BANDS] = normalisedSpectrum.length - 1;

  // process

  for (var _i = 0; _i < NUM_BARK_BANDS; _i++) {
    var sum = 0;
    for (var j = bbLimits[_i]; j < bbLimits[_i + 1]; j++) {
      sum += normalisedSpectrum[j];
    }

    specific[_i] = Math.pow(sum, 0.23);
  }

  // get total loudness
  for (var _i2 = 0; _i2 < specific.length; _i2++) {
    total += specific[_i2];
  }

  return {
    specific: specific,
    total: total
  };
};

module.exports = exports['default'];

},{}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.default = function (args) {
  if (_typeof(args.ampSpectrum) !== 'object' || _typeof(args.melFilterBank) !== 'object') {
    throw new TypeError();
  }

  // Tutorial from:
  // http://practicalcryptography.com/miscellaneous/machine-learning
  // /guide-mel-frequency-cepstral-coefficients-mfccs/
  var powSpec = (0, _powerSpectrum2.default)(args);
  var numFilters = args.melFilterBank.length;
  var filtered = Array(numFilters);

  var loggedMelBands = new Float32Array(numFilters);

  for (var i = 0; i < loggedMelBands.length; i++) {
    filtered[i] = new Float32Array(args.bufferSize / 2);
    loggedMelBands[i] = 0;
    for (var j = 0; j < args.bufferSize / 2; j++) {
      // point-wise multiplication between power spectrum and filter banks.
      filtered[i][j] = args.melFilterBank[i][j] * powSpec[j];

      // summing up all of the coefficients into one array
      loggedMelBands[i] += filtered[i][j];
    }

    // log each coefficient unless it's 0.
    loggedMelBands[i] = loggedMelBands[i] > 0.00001 ? Math.log(loggedMelBands[i]) : 0;
  }

  // dct
  var loggedMelBandsArray = Array.prototype.slice.call(loggedMelBands);
  var mfccs = dct(loggedMelBandsArray);
  var mfccsArray = new Float32Array(mfccs);

  return mfccsArray;
};

var _powerSpectrum = require('./powerSpectrum');

var _powerSpectrum2 = _interopRequireDefault(_powerSpectrum);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dct = require('dct');

module.exports = exports['default'];

},{"./powerSpectrum":11,"dct":1}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.default = function () {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  if (_typeof(args[0].signal) !== 'object') {
    throw new TypeError();
  }

  var loudnessValue = (0, _loudness2.default)(args[0]);
  var spec = loudnessValue.specific;
  var output = 0;

  for (var i = 0; i < spec.length; i++) {
    if (i < 15) {
      output += (i + 1) * spec[i + 1];
    } else {
      output += 0.066 * Math.exp(0.171 * (i + 1));
    }
  }

  output *= 0.11 / loudnessValue.total;

  return output;
};

var _loudness = require('./loudness');

var _loudness2 = _interopRequireDefault(_loudness);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports['default'];

},{"./loudness":7}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.default = function () {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  if (_typeof(args[0].signal) !== 'object') {
    throw new TypeError();
  }

  var loudnessValue = (0, _loudness2.default)(args[0]);

  var max = 0;
  for (var i = 0; i < loudnessValue.specific.length; i++) {
    if (loudnessValue.specific[i] > max) {
      max = loudnessValue.specific[i];
    }
  }

  return Math.pow((loudnessValue.total - max) / loudnessValue.total, 2);
};

var _loudness = require('./loudness');

var _loudness2 = _interopRequireDefault(_loudness);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports['default'];

},{"./loudness":7}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.default = function () {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  if (_typeof(args[0].ampSpectrum) !== 'object') {
    throw new TypeError();
  }

  var powerSpectrum = new Float32Array(args[0].ampSpectrum.length);
  for (var i = 0; i < powerSpectrum.length; i++) {
    powerSpectrum[i] = Math.pow(args[0].ampSpectrum[i], 2);
  }

  return powerSpectrum;
};

module.exports = exports['default'];

},{}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.default = function (args) {
  if (_typeof(args.signal) !== 'object') {
    throw new TypeError();
  }

  var rms = 0;
  for (var i = 0; i < args.signal.length; i++) {
    rms += Math.pow(args.signal[i], 2);
  }

  rms = rms / args.signal.length;
  rms = Math.sqrt(rms);

  return rms;
};

module.exports = exports['default'];

},{}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.default = function () {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  if (_typeof(args[0].ampSpectrum) !== 'object') {
    throw new TypeError();
  }

  return (0, _extractorUtilities.mu)(1, args[0].ampSpectrum);
};

var _extractorUtilities = require('./extractorUtilities');

module.exports = exports['default'];

},{"./extractorUtilities":6}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.default = function () {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  if (_typeof(args[0].ampSpectrum) !== 'object') {
    throw new TypeError();
  }

  var numerator = 0;
  var denominator = 0;
  for (var i = 0; i < args[0].ampSpectrum.length; i++) {
    numerator += Math.log(args[0].ampSpectrum[i]);
    denominator += args[0].ampSpectrum[i];
  }

  return Math.exp(numerator / args[0].ampSpectrum.length) * args[0].ampSpectrum.length / denominator;
};

module.exports = exports['default'];

},{}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.default = function () {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  if (_typeof(args[0].signal) !== 'object' || _typeof(args[0].previousSignal) !== 'object') {
    throw new TypeError();
  }

  var sf = 0;
  for (var i = -(args[0].bufferSize / 2); i < args[0].signal.length / 2 - 1; i++) {
    var x = Math.abs(args[0].signal[i]) - Math.abs(args[0].previousSignal[i]);
    sf += (x + Math.abs(x)) / 2;
  }

  return sf;
};

module.exports = exports['default'];

},{}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.default = function () {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  if (_typeof(args[0].ampSpectrum) !== 'object') {
    throw new TypeError();
  }

  var ampspec = args[0].ampSpectrum;
  var mu1 = (0, _extractorUtilities.mu)(1, ampspec);
  var mu2 = (0, _extractorUtilities.mu)(2, ampspec);
  var mu3 = (0, _extractorUtilities.mu)(3, ampspec);
  var mu4 = (0, _extractorUtilities.mu)(4, ampspec);
  var numerator = -3 * Math.pow(mu1, 4) + 6 * mu1 * mu2 - 4 * mu1 * mu3 + mu4;
  var denominator = Math.pow(Math.sqrt(mu2 - Math.pow(mu1, 2)), 4);
  return numerator / denominator;
};

var _extractorUtilities = require('./extractorUtilities');

module.exports = exports['default'];

},{"./extractorUtilities":6}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.default = function () {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  if (_typeof(args[0].ampSpectrum) !== 'object') {
    throw new TypeError();
  }

  var ampspec = args[0].ampSpectrum;

  // calculate nyquist bin
  var nyqBin = args[0].sampleRate / (2 * (ampspec.length - 1));
  var ec = 0;
  for (var i = 0; i < ampspec.length; i++) {
    ec += ampspec[i];
  }

  var threshold = 0.99 * ec;
  var n = ampspec.length - 1;
  while (ec > threshold && n >= 0) {
    ec -= ampspec[n];
    --n;
  }

  return (n + 1) * nyqBin;
};

module.exports = exports['default'];

},{}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.default = function (args) {
  if (_typeof(args.ampSpectrum) !== 'object') {
    throw new TypeError();
  }

  var mu1 = (0, _extractorUtilities.mu)(1, args.ampSpectrum);
  var mu2 = (0, _extractorUtilities.mu)(2, args.ampSpectrum);
  var mu3 = (0, _extractorUtilities.mu)(3, args.ampSpectrum);
  var numerator = 2 * Math.pow(mu1, 3) - 3 * mu1 * mu2 + mu3;
  var denominator = Math.pow(Math.sqrt(mu2 - Math.pow(mu1, 2)), 3);
  return numerator / denominator;
};

var _extractorUtilities = require('./extractorUtilities');

module.exports = exports['default'];

},{"./extractorUtilities":6}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.default = function (args) {
  if (_typeof(args.ampSpectrum) !== 'object') {
    throw new TypeError();
  }

  // linear regression
  var ampSum = 0;
  var freqSum = 0;
  var freqs = new Float32Array(args.ampSpectrum.length);
  var powFreqSum = 0;
  var ampFreqSum = 0;

  for (var i = 0; i < args.ampSpectrum.length; i++) {
    ampSum += args.ampSpectrum[i];
    var curFreq = i * args.sampleRate / args.bufferSize;
    freqs[i] = curFreq;
    powFreqSum += curFreq * curFreq;
    freqSum += curFreq;
    ampFreqSum += curFreq * args.ampSpectrum[i];
  }

  return (args.ampSpectrum.length * ampFreqSum - freqSum * ampSum) / (ampSum * (powFreqSum - Math.pow(freqSum, 2)));
};

module.exports = exports['default'];

},{}],20:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.default = function (args) {
  if (_typeof(args.ampSpectrum) !== 'object') {
    throw new TypeError();
  }

  return Math.sqrt((0, _extractorUtilities.mu)(2, args.ampSpectrum) - Math.pow((0, _extractorUtilities.mu)(1, args.ampSpectrum), 2));
};

var _extractorUtilities = require('./extractorUtilities');

module.exports = exports['default'];

},{"./extractorUtilities":6}],21:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.default = function () {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  if (_typeof(args[0].signal) !== 'object') {
    throw new TypeError();
  }

  var zcr = 0;
  for (var i = 0; i < args[0].signal.length; i++) {
    if (args[0].signal[i] >= 0 && args[0].signal[i + 1] < 0 || args[0].signal[i] < 0 && args[0].signal[i + 1] >= 0) {
      zcr++;
    }
  }

  return zcr;
};

module.exports = exports['default'];

},{}],22:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _rms = require('./extractors/rms');

var _rms2 = _interopRequireDefault(_rms);

var _energy = require('./extractors/energy');

var _energy2 = _interopRequireDefault(_energy);

var _spectralSlope = require('./extractors/spectralSlope');

var _spectralSlope2 = _interopRequireDefault(_spectralSlope);

var _spectralCentroid = require('./extractors/spectralCentroid');

var _spectralCentroid2 = _interopRequireDefault(_spectralCentroid);

var _spectralRolloff = require('./extractors/spectralRolloff');

var _spectralRolloff2 = _interopRequireDefault(_spectralRolloff);

var _spectralFlatness = require('./extractors/spectralFlatness');

var _spectralFlatness2 = _interopRequireDefault(_spectralFlatness);

var _spectralSpread = require('./extractors/spectralSpread');

var _spectralSpread2 = _interopRequireDefault(_spectralSpread);

var _spectralSkewness = require('./extractors/spectralSkewness');

var _spectralSkewness2 = _interopRequireDefault(_spectralSkewness);

var _spectralKurtosis = require('./extractors/spectralKurtosis');

var _spectralKurtosis2 = _interopRequireDefault(_spectralKurtosis);

var _zcr = require('./extractors/zcr');

var _zcr2 = _interopRequireDefault(_zcr);

var _loudness = require('./extractors/loudness');

var _loudness2 = _interopRequireDefault(_loudness);

var _perceptualSpread = require('./extractors/perceptualSpread');

var _perceptualSpread2 = _interopRequireDefault(_perceptualSpread);

var _perceptualSharpness = require('./extractors/perceptualSharpness');

var _perceptualSharpness2 = _interopRequireDefault(_perceptualSharpness);

var _mfcc = require('./extractors/mfcc');

var _mfcc2 = _interopRequireDefault(_mfcc);

var _powerSpectrum = require('./extractors/powerSpectrum');

var _powerSpectrum2 = _interopRequireDefault(_powerSpectrum);

var _spectralFlux = require('./extractors/spectralFlux');

var _spectralFlux2 = _interopRequireDefault(_spectralFlux);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  buffer: function buffer(args) {
    return args.signal;
  },
  rms: _rms2.default,
  energy: _energy2.default,
  complexSpectrum: function complexSpectrum(args) {
    return args.complexSpectrum;
  },
  spectralSlope: _spectralSlope2.default,
  spectralCentroid: _spectralCentroid2.default,
  spectralRolloff: _spectralRolloff2.default,
  spectralFlatness: _spectralFlatness2.default,
  spectralSpread: _spectralSpread2.default,
  spectralSkewness: _spectralSkewness2.default,
  spectralKurtosis: _spectralKurtosis2.default,
  amplitudeSpectrum: function amplitudeSpectrum(args) {
    return args.ampSpectrum;
  },
  zcr: _zcr2.default,
  loudness: _loudness2.default,
  perceptualSpread: _perceptualSpread2.default,
  perceptualSharpness: _perceptualSharpness2.default,
  powerSpectrum: _powerSpectrum2.default,
  mfcc: _mfcc2.default,
  spectralFlux: _spectralFlux2.default
};
module.exports = exports['default'];

},{"./extractors/energy":5,"./extractors/loudness":7,"./extractors/mfcc":8,"./extractors/perceptualSharpness":9,"./extractors/perceptualSpread":10,"./extractors/powerSpectrum":11,"./extractors/rms":12,"./extractors/spectralCentroid":13,"./extractors/spectralFlatness":14,"./extractors/spectralFlux":15,"./extractors/spectralKurtosis":16,"./extractors/spectralRolloff":17,"./extractors/spectralSkewness":18,"./extractors/spectralSlope":19,"./extractors/spectralSpread":20,"./extractors/zcr":21}],23:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _utilities = require('./utilities');

var utilities = _interopRequireWildcard(_utilities);

var _featureExtractors = require('./featureExtractors');

var extractors = _interopRequireWildcard(_featureExtractors);

var _complex_array = require('jsfft/lib/complex_array');

var complexArray = _interopRequireWildcard(_complex_array);

var _meydaWa = require('./meyda-wa');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// jsfft is required by complex_array, but doesn't export anything
require('jsfft');


var prepareSignalWithSpectrum = function prepareSignalWithSpectrum(signal, windowingFunction, bufferSize) {
  var preparedSignal = {};

  if (typeof signal.buffer === 'undefined') {
    // signal is a normal array, convert to F32A
    preparedSignal.signal = utilities.arrayToTyped(signal);
  } else {
    preparedSignal.signal = signal;
  }

  preparedSignal.windowedSignal = utilities.applyWindow(preparedSignal.signal, windowingFunction);

  // create complexarray to hold the spectrum
  var data = new complexArray.ComplexArray(bufferSize);

  // map time domain
  data.map(function (value, i) {
    var v = value;
    v.real = preparedSignal.windowedSignal[i];
    return v;
  });

  // Functions shouldn't start with upper case chars, this trips our linter
  data.fft = data.FFT;
  preparedSignal.complexSpectrum = data.fft();
  preparedSignal.ampSpectrum = new Float32Array(bufferSize / 2);
  for (var i = 0; i < bufferSize / 2; i++) {
    preparedSignal.ampSpectrum[i] = Math.sqrt(Math.pow(preparedSignal.complexSpectrum.real[i], 2) + Math.pow(preparedSignal.complexSpectrum.imag[i], 2));
  }

  return preparedSignal;
};

var Meyda = {
  audioContext: null,
  spn: null,
  bufferSize: 512,
  sampleRate: 44100,
  melBands: 26,
  callback: null,
  windowingFunction: 'hanning',
  featureExtractors: extractors,
  EXTRACTION_STARTED: false,
  _featuresToExtract: [],
  windowing: utilities.applyWindow,
  // TODO: We're using this a dependency, we should use an import
  errors: {
    notPow2: new Error('Meyda: Buffer size must be a power of 2, e.g. 64 or 512'),
    featureUndef: new Error('Meyda: No features defined.'),
    invalidFeatureFmt: new Error('Meyda: Invalid feature format'),
    invalidInput: new Error('Meyda: Invalid input.'),
    noAC: new Error('Meyda: No AudioContext specified.'),
    noSource: new Error('Meyda: No source node specified.')
  },

  createMeydaAnalyzer: function createMeydaAnalyzer(options) {
    return new _meydaWa.MeydaAnalyzer(options, Meyda);
  },

  extract: function extract(feature, signal, previousSignal) {
    if (!signal) {
      throw undefined.errors.invalidInput;
    } else if ((typeof signal === 'undefined' ? 'undefined' : _typeof(signal)) !== 'object') {
      throw undefined.errors.invalidInput;
    } else if (!feature) {
      throw undefined.errors.featureUndef;
    } else if (!utilities.isPowerOfTwo(signal.length)) {
      throw undefined.errors.notPow2;
    }

    if (typeof undefined.barkScale === 'undefined' || undefined.barkScale.length !== undefined.bufferSize) {
      undefined.barkScale = utilities.createBarkScale(undefined.bufferSize, undefined.sampleRate, undefined.bufferSize);
    }

    // Recalcuate mel bank if buffer length changed
    if (typeof undefined.melFilterBank === 'undefined' || undefined.barkScale.length !== undefined.bufferSize || undefined.melFilterBank.length !== undefined.melBands) {
      undefined.melFilterBank = utilities.createMelFilterBank(undefined.melBands, undefined.sampleRate, undefined.bufferSize);
    }

    if (typeof signal.buffer === 'undefined') {
      // signal is a normal array, convert to F32A
      undefined.signal = utilities.arrayToTyped(signal);
    } else {
      undefined.signal = signal;
    }

    var preparedSignal = prepareSignalWithSpectrum(signal, undefined.windowingFunction, undefined.bufferSize);

    undefined.signal = preparedSignal.windowedSignal;
    undefined.complexSpectrum = preparedSignal.complexSpectrum;
    undefined.ampSpectrum = preparedSignal.ampSpectrum;

    if (previousSignal) {
      preparedSignal = prepareSignalWithSpectrum(previousSignal, undefined.windowingFunction, undefined.bufferSize);

      undefined.previousSignal = preparedSignal.windowedSignal;
      undefined.previousComplexSpectrum = preparedSignal.complexSpectrum;
      undefined.previousAmpSpectrum = preparedSignal.ampSpectrum;
    }

    if ((typeof feature === 'undefined' ? 'undefined' : _typeof(feature)) === 'object') {
      var results = {};
      for (var x = 0; x < feature.length; x++) {
        results[feature[x]] = undefined.featureExtractors[feature[x]]({
          ampSpectrum: undefined.ampSpectrum,
          complexSpectrum: undefined.complexSpectrum,
          signal: undefined.signal,
          bufferSize: undefined.bufferSize,
          sampleRate: undefined.sampleRate,
          barkScale: undefined.barkScale,
          melFilterBank: undefined.melFilterBank,
          previousSignal: undefined.previousSignal,
          previousAmpSpectrum: undefined.previousAmpSpectrum,
          previousComplexSpectrum: undefined.previousComplexSpectrum
        });
      }

      return results;
    } else if (typeof feature === 'string') {
      return undefined.featureExtractors[feature]({
        ampSpectrum: undefined.ampSpectrum,
        complexSpectrum: undefined.complexSpectrum,
        signal: undefined.signal,
        bufferSize: undefined.bufferSize,
        sampleRate: undefined.sampleRate,
        barkScale: undefined.barkScale,
        melFilterBank: undefined.melFilterBank,
        previousSignal: undefined.previousSignal,
        previousAmpSpectrum: undefined.previousAmpSpectrum,
        previousComplexSpectrum: undefined.previousComplexSpectrum
      });
    }
    throw undefined.errors.invalidFeatureFmt;
  }
};

exports.default = Meyda;


if (typeof window !== 'undefined') window.Meyda = Meyda;
module.exports = exports['default'];

},{"./featureExtractors":22,"./meyda-wa":24,"./utilities":25,"jsfft":4,"jsfft/lib/complex_array":3}],24:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MeydaAnalyzer = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utilities = require('./utilities');

var utilities = _interopRequireWildcard(_utilities);

var _featureExtractors = require('./featureExtractors');

var featureExtractors = _interopRequireWildcard(_featureExtractors);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MeydaAnalyzer = exports.MeydaAnalyzer = function () {
  function MeydaAnalyzer(options, _this) {
    var _this2 = this;

    _classCallCheck(this, MeydaAnalyzer);

    this.meyda = _this;
    if (!options.audioContext) {
      throw this.meyda.errors.noAC;
    } else if (options.bufferSize && !utilities.isPowerOfTwo(options.bufferSize)) {
      throw this.meyda.errors.notPow2;
    } else if (!options.source) {
      throw this.meyda.errors.noSource;
    }

    this.meyda.audioContext = options.audioContext;

    // TODO: validate options
    this.meyda.bufferSize = options.bufferSize || this.meyda.bufferSize || 256;
    this.meyda.sampleRate = options.sampleRate || this.meyda.audioContext.sampleRate || 44100;
    this.meyda.callback = options.callback;
    this.meyda.windowingFunction = options.windowingFunction || 'hanning';
    this.meyda.featureExtractors = featureExtractors;
    this.meyda.EXTRACTION_STARTED = options.startImmediately || false;

    // Create nodes
    this.meyda.spn = this.meyda.audioContext.createScriptProcessor(this.meyda.bufferSize, 1, 1);
    this.meyda.spn.connect(this.meyda.audioContext.destination);

    this.meyda.featuresToExtract = options.featureExtractors || [];

    // Always recalculate BS and MFB when a new Meyda analyzer is created.
    this.meyda.barkScale = utilities.createBarkScale(this.meyda.bufferSize, this.meyda.sampleRate, this.meyda.bufferSize);
    this.meyda.melFilterBank = utilities.createMelFilterBank(this.meyda.melBands, this.meyda.sampleRate, this.meyda.bufferSize);

    this.meyda.inputData = null;
    this.meyda.previousInputData = null;

    this.setSource(options.source);

    this.meyda.spn.onaudioprocess = function (e) {
      if (_this2.meyda.inputData !== null) {
        _this2.meyda.previousInputData = _this2.meyda.inputData;
      }

      _this2.meyda.inputData = e.inputBuffer.getChannelData(0);

      var features = _this2.meyda.extract(_this2.meyda.featuresToExtract, _this2.meyda.inputData, _this2.meyda.previousInputData);

      // Call callback if applicable
      if (typeof _this2.meyda.callback === 'function' && _this2.meyda.EXTRACTION_STARTED) {
        _this2.meyda.callback(features);
      }
    };
  }

  _createClass(MeydaAnalyzer, [{
    key: 'start',
    value: function start(features) {
      this.meyda.featuresToExtract = features || this.meyda.featuresToExtract;
      this.meyda.EXTRACTION_STARTED = true;
    }
  }, {
    key: 'stop',
    value: function stop() {
      this.meyda.EXTRACTION_STARTED = false;
    }
  }, {
    key: 'setSource',
    value: function setSource(source) {
      source.connect(this.meyda.spn);
    }
  }, {
    key: 'get',
    value: function get(features) {
      if (this.meyda.inputData) {
        return this.meyda.extract(features || this.meyda.featuresToExtract, this.meyda.inputData, this.meyda.previousInputData);
      }
      return null;
    }
  }]);

  return MeydaAnalyzer;
}();

},{"./featureExtractors":22,"./utilities":25}],25:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isPowerOfTwo = isPowerOfTwo;
exports.error = error;
exports.pointwiseBufferMult = pointwiseBufferMult;
exports.applyWindow = applyWindow;
exports.createBarkScale = createBarkScale;
exports.typedToArray = typedToArray;
exports.arrayToTyped = arrayToTyped;
exports.normalize = normalize;
exports.normalizeToOne = normalizeToOne;
exports.mean = mean;
exports.melToFreq = melToFreq;
exports.freqToMel = freqToMel;
exports.createMelFilterBank = createMelFilterBank;

var _windowing = require('./windowing');

var windowing = _interopRequireWildcard(_windowing);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var windows = {};

function isPowerOfTwo(_num) {
  var num = _num;
  while (num % 2 === 0 && num > 1) {
    num /= 2;
  }

  return num === 1;
}

function error(message) {
  throw new Error('Meyda:  ' + message);
}

function pointwiseBufferMult(a, b) {
  var c = [];
  for (var i = 0; i < Math.min(a.length, b.length); i++) {
    c[i] = a[i] * b[i];
  }

  return c;
}

function applyWindow(_signal, _windowname) {
  var windowname = _windowname;
  var signal = _signal;
  if (windowname !== 'rect') {
    if (windowname === '' || !windowname) windowname = 'hanning';
    if (!windows[windowname]) windows[windowname] = {};

    if (!windows[windowname][signal.length]) {
      try {
        windows[windowname][signal.length] = windowing[windowname](signal.length);
      } catch (e) {
        throw new Error('Invalid windowing function');
      }
    }

    signal = pointwiseBufferMult(signal, windows[windowname][signal.length]);
  }

  return signal;
}

function createBarkScale(length, sampleRate, bufferSize) {
  var barkScale = new Float32Array(length);

  for (var i = 0; i < barkScale.length; i++) {
    barkScale[i] = i * sampleRate / bufferSize;
    barkScale[i] = 13 * Math.atan(barkScale[i] / 1315.8) + 3.5 * Math.atan(Math.pow(barkScale[i] / 7518, 2));
  }

  return barkScale;
}

function typedToArray(t) {
  // utility to convert typed arrays to normal arrays
  return Array.prototype.slice.call(t);
}

function arrayToTyped(t) {
  // utility to convert arrays to typed F32 arrays
  return Float32Array.from(t);
}

function normalize(a, range) {
  return a.map(function (n) {
    return n / range;
  });
}

function normalizeToOne(a) {
  var max = Math.max.apply(null, a);

  return normalize(a, max);
}

function mean(a) {
  return a.reduce(function (prev, cur) {
    return prev + cur;
  }) / a.length;
}

function melToFreq(melValue) {
  return 700 * (Math.exp(melValue / 1125) - 1);
}

function freqToMel(freqValue) {
  return 1125 * Math.log(1 + freqValue / 700);
}

function createMelFilterBank(numFilters, sampleRate, bufferSize) {
  // the +2 is the upper and lower limits
  var melValues = new Float32Array(numFilters + 2);
  var melValuesInFreq = new Float32Array(numFilters + 2);

  // Generate limits in Hz - from 0 to the nyquist.
  var lowerLimitFreq = 0;
  var upperLimitFreq = sampleRate / 2;

  // Convert the limits to Mel
  var lowerLimitMel = freqToMel(lowerLimitFreq);
  var upperLimitMel = freqToMel(upperLimitFreq);

  // Find the range
  var range = upperLimitMel - lowerLimitMel;

  // Find the range as part of the linear interpolation
  var valueToAdd = range / (numFilters + 1);

  var fftBinsOfFreq = Array(numFilters + 2);

  for (var i = 0; i < melValues.length; i++) {
    // Initialising the mel frequencies
    // They're a linear interpolation between the lower and upper limits.
    melValues[i] = i * valueToAdd;

    // Convert back to Hz
    melValuesInFreq[i] = melToFreq(melValues[i]);

    // Find the corresponding bins
    fftBinsOfFreq[i] = Math.floor((bufferSize + 1) * melValuesInFreq[i] / sampleRate);
  }

  var filterBank = Array(numFilters);
  for (var j = 0; j < filterBank.length; j++) {
    // Create a two dimensional array of size numFilters * (buffersize/2)+1
    // pre-populating the arrays with 0s.
    filterBank[j] = Array.apply(null, new Array(bufferSize / 2 + 1)).map(Number.prototype.valueOf, 0);

    // creating the lower and upper slopes for each bin
    for (var _i = fftBinsOfFreq[j]; _i < fftBinsOfFreq[j + 1]; _i++) {
      filterBank[j][_i] = (_i - fftBinsOfFreq[j]) / (fftBinsOfFreq[j + 1] - fftBinsOfFreq[j]);
    }

    for (var _i2 = fftBinsOfFreq[j + 1]; _i2 < fftBinsOfFreq[j + 2]; _i2++) {
      filterBank[j][_i2] = (fftBinsOfFreq[j + 2] - _i2) / (fftBinsOfFreq[j + 2] - fftBinsOfFreq[j + 1]);
    }
  }

  return filterBank;
}

},{"./windowing":26}],26:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.blackman = blackman;
exports.sine = sine;
exports.hanning = hanning;
exports.hamming = hamming;
function blackman(size) {
  var blackmanBuffer = new Float32Array(size);
  var coeff1 = 2 * Math.PI / (size - 1);
  var coeff2 = 2 * coeff1;

  // According to http://uk.mathworks.com/help/signal/ref/blackman.html
  // first half of the window
  for (var i = 0; i < size / 2; i++) {
    blackmanBuffer[i] = 0.42 - 0.5 * Math.cos(i * coeff1) + 0.08 * Math.cos(i * coeff2);
  }

  // second half of the window
  for (var _i = size / 2; _i > 0; _i--) {
    blackmanBuffer[size - _i] = blackmanBuffer[_i - 1];
  }

  return blackmanBuffer;
}

function sine(size) {
  var coeff = Math.PI / (size - 1);
  var sineBuffer = new Float32Array(size);

  for (var i = 0; i < size; i++) {
    sineBuffer[i] = Math.sin(coeff * i);
  }

  return sineBuffer;
}

function hanning(size) {
  var hanningBuffer = new Float32Array(size);
  for (var i = 0; i < size; i++) {
    // According to the R documentation
    // http://ugrad.stat.ubc.ca/R/library/e1071/html/hanning.window.html
    hanningBuffer[i] = 0.5 - 0.5 * Math.cos(2 * Math.PI * i / (size - 1));
  }

  return hanningBuffer;
}

function hamming(size) {
  var hammingBuffer = new Float32Array(size);
  for (var i = 0; i < size; i++) {
    // According to http://uk.mathworks.com/help/signal/ref/hamming.html
    hammingBuffer[i] = 0.54 - 0.46 * Math.cos(2 * Math.PI * (i / size - 1));
  }

  return hammingBuffer;
}

},{}]},{},[23]);
