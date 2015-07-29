(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
//
// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
//
// Originally from narwhal.js (http://narwhaljs.org)
// Copyright (c) 2009 Thomas Robinson <280north.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

// when used in node, this will actually load the util module we depend on
// versus loading the builtin util module as happens otherwise
// this is a bug in node module loading as far as I am concerned
var util = require('util/');

var pSlice = Array.prototype.slice;
var hasOwn = Object.prototype.hasOwnProperty;

// 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.

var assert = module.exports = ok;

// 2. The AssertionError is defined in assert.
// new assert.AssertionError({ message: message,
//                             actual: actual,
//                             expected: expected })

assert.AssertionError = function AssertionError(options) {
  this.name = 'AssertionError';
  this.actual = options.actual;
  this.expected = options.expected;
  this.operator = options.operator;
  if (options.message) {
    this.message = options.message;
    this.generatedMessage = false;
  } else {
    this.message = getMessage(this);
    this.generatedMessage = true;
  }
  var stackStartFunction = options.stackStartFunction || fail;

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, stackStartFunction);
  }
  else {
    // non v8 browsers so we can have a stacktrace
    var err = new Error();
    if (err.stack) {
      var out = err.stack;

      // try to strip useless frames
      var fn_name = stackStartFunction.name;
      var idx = out.indexOf('\n' + fn_name);
      if (idx >= 0) {
        // once we have located the function frame
        // we need to strip out everything before it (and its line)
        var next_line = out.indexOf('\n', idx + 1);
        out = out.substring(next_line + 1);
      }

      this.stack = out;
    }
  }
};

// assert.AssertionError instanceof Error
util.inherits(assert.AssertionError, Error);

function replacer(key, value) {
  if (util.isUndefined(value)) {
    return '' + value;
  }
  if (util.isNumber(value) && !isFinite(value)) {
    return value.toString();
  }
  if (util.isFunction(value) || util.isRegExp(value)) {
    return value.toString();
  }
  return value;
}

function truncate(s, n) {
  if (util.isString(s)) {
    return s.length < n ? s : s.slice(0, n);
  } else {
    return s;
  }
}

function getMessage(self) {
  return truncate(JSON.stringify(self.actual, replacer), 128) + ' ' +
         self.operator + ' ' +
         truncate(JSON.stringify(self.expected, replacer), 128);
}

// At present only the three keys mentioned above are used and
// understood by the spec. Implementations or sub modules can pass
// other keys to the AssertionError's constructor - they will be
// ignored.

// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.

function fail(actual, expected, message, operator, stackStartFunction) {
  throw new assert.AssertionError({
    message: message,
    actual: actual,
    expected: expected,
    operator: operator,
    stackStartFunction: stackStartFunction
  });
}

// EXTENSION! allows for well behaved errors defined elsewhere.
assert.fail = fail;

// 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, !!guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.

function ok(value, message) {
  if (!value) fail(value, true, message, '==', assert.ok);
}
assert.ok = ok;

// 5. The equality assertion tests shallow, coercive equality with
// ==.
// assert.equal(actual, expected, message_opt);

assert.equal = function equal(actual, expected, message) {
  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
};

// 6. The non-equality assertion tests for whether two objects are not equal
// with != assert.notEqual(actual, expected, message_opt);

assert.notEqual = function notEqual(actual, expected, message) {
  if (actual == expected) {
    fail(actual, expected, message, '!=', assert.notEqual);
  }
};

// 7. The equivalence assertion tests a deep equality relation.
// assert.deepEqual(actual, expected, message_opt);

assert.deepEqual = function deepEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected)) {
    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
  }
};

function _deepEqual(actual, expected) {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;

  } else if (util.isBuffer(actual) && util.isBuffer(expected)) {
    if (actual.length != expected.length) return false;

    for (var i = 0; i < actual.length; i++) {
      if (actual[i] !== expected[i]) return false;
    }

    return true;

  // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.
  } else if (util.isDate(actual) && util.isDate(expected)) {
    return actual.getTime() === expected.getTime();

  // 7.3 If the expected value is a RegExp object, the actual value is
  // equivalent if it is also a RegExp object with the same source and
  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
  } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
    return actual.source === expected.source &&
           actual.global === expected.global &&
           actual.multiline === expected.multiline &&
           actual.lastIndex === expected.lastIndex &&
           actual.ignoreCase === expected.ignoreCase;

  // 7.4. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if (!util.isObject(actual) && !util.isObject(expected)) {
    return actual == expected;

  // 7.5 For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else {
    return objEquiv(actual, expected);
  }
}

function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function objEquiv(a, b) {
  if (util.isNullOrUndefined(a) || util.isNullOrUndefined(b))
    return false;
  // an identical 'prototype' property.
  if (a.prototype !== b.prototype) return false;
  // if one is a primitive, the other must be same
  if (util.isPrimitive(a) || util.isPrimitive(b)) {
    return a === b;
  }
  var aIsArgs = isArguments(a),
      bIsArgs = isArguments(b);
  if ((aIsArgs && !bIsArgs) || (!aIsArgs && bIsArgs))
    return false;
  if (aIsArgs) {
    a = pSlice.call(a);
    b = pSlice.call(b);
    return _deepEqual(a, b);
  }
  var ka = objectKeys(a),
      kb = objectKeys(b),
      key, i;
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length != kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] != kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!_deepEqual(a[key], b[key])) return false;
  }
  return true;
}

// 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);

assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
  if (_deepEqual(actual, expected)) {
    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
  }
};

// 9. The strict equality assertion tests strict equality, as determined by ===.
// assert.strictEqual(actual, expected, message_opt);

assert.strictEqual = function strictEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(actual, expected, message, '===', assert.strictEqual);
  }
};

// 10. The strict non-equality assertion tests for strict inequality, as
// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
  if (actual === expected) {
    fail(actual, expected, message, '!==', assert.notStrictEqual);
  }
};

function expectedException(actual, expected) {
  if (!actual || !expected) {
    return false;
  }

  if (Object.prototype.toString.call(expected) == '[object RegExp]') {
    return expected.test(actual);
  } else if (actual instanceof expected) {
    return true;
  } else if (expected.call({}, actual) === true) {
    return true;
  }

  return false;
}

function _throws(shouldThrow, block, expected, message) {
  var actual;

  if (util.isString(expected)) {
    message = expected;
    expected = null;
  }

  try {
    block();
  } catch (e) {
    actual = e;
  }

  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
            (message ? ' ' + message : '.');

  if (shouldThrow && !actual) {
    fail(actual, expected, 'Missing expected exception' + message);
  }

  if (!shouldThrow && expectedException(actual, expected)) {
    fail(actual, expected, 'Got unwanted exception' + message);
  }

  if ((shouldThrow && actual && expected &&
      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
    throw actual;
  }
}

// 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);

assert.throws = function(block, /*optional*/error, /*optional*/message) {
  _throws.apply(this, [true].concat(pSlice.call(arguments)));
};

// EXTENSION! This is annoying to write outside this module.
assert.doesNotThrow = function(block, /*optional*/message) {
  _throws.apply(this, [false].concat(pSlice.call(arguments)));
};

assert.ifError = function(err) { if (err) {throw err;}};

var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    if (hasOwn.call(obj, key)) keys.push(key);
  }
  return keys;
};

},{"util/":5}],2:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],3:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            currentQueue[queueIndex].run();
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],4:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],5:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./support/isBuffer":4,"_process":3,"inherits":2}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
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

},{"./complex_array":6}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

var _assert = require('assert');

var assert = _interopRequireWildcard(_assert);

exports["default"] = function () {
	if (typeof arguments[0].signal !== "object") {
		throw new TypeError();
	}

	var energy = 0;
	for (var i = 0; i < arguments[0].signal.length; i++) {
		energy += Math.pow(Math.abs(arguments[0].signal[i]), 2);
	}
	return energy;
};

module.exports = exports["default"];

},{"assert":1}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = function (args) {
  if (typeof args.ampSpectrum !== "object") {
    throw new TypeError();
  }
  var NUM_BARK_BANDS = 24;
  var specific = new Float32Array(NUM_BARK_BANDS);
  var total = 0;
  var normalisedSpectrum = args.ampSpectrum;
  var bbLimits = new Int32Array(NUM_BARK_BANDS + 1);

  bbLimits[0] = 0;
  var currentBandEnd = args.barkScale[normalisedSpectrum.length - 1] / NUM_BARK_BANDS;
  var currentBand = 1;
  for (var i = 0; i < normalisedSpectrum.length; i++) {
    while (args.barkScale[i] > currentBandEnd) {
      bbLimits[currentBand++] = i;
      currentBandEnd = currentBand * args.barkScale[normalisedSpectrum.length - 1] / NUM_BARK_BANDS;
    }
  }

  bbLimits[NUM_BARK_BANDS] = normalisedSpectrum.length - 1;

  //process

  for (var i = 0; i < NUM_BARK_BANDS; i++) {
    var sum = 0;
    for (var j = bbLimits[i]; j < bbLimits[i + 1]; j++) {

      sum += normalisedSpectrum[j];
    }
    specific[i] = Math.pow(sum, 0.23);
  }

  //get total loudness
  for (var i = 0; i < specific.length; i++) {
    total += specific[i];
  }
  return {
    "specific": specific,
    "total": total
  };
};

module.exports = exports["default"];

},{}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _powerSpectrum = require('./powerSpectrum');

var _powerSpectrum2 = _interopRequireDefault(_powerSpectrum);

var melToFreq = function melToFreq(melValue) {
	var freqValue = 700 * (Math.exp(melValue / 1125) - 1);
	return freqValue;
};

var freqToMel = function freqToMel(freqValue) {
	var melValue = 1125 * Math.log(1 + freqValue / 700);
	return melValue;
};

exports["default"] = function (args) {
	if (typeof args.ampSpectrum !== "object") {
		throw new TypeError();
	}
	//used tutorial from http://practicalcryptography.com/miscellaneous/machine-learning/guide-mel-frequency-cepstral-coefficients-mfccs/
	var powSpec = (0, _powerSpectrum2["default"])(args);
	var numFilters = 26; //26 filters is standard
	var melValues = new Float32Array(numFilters + 2); //the +2 is the upper and lower limits
	var melValuesInFreq = new Float32Array(numFilters + 2);
	//Generate limits in Hz - from 0 to the nyquist.
	var lowerLimitFreq = 0;
	var upperLimitFreq = args.sampleRate / 2;
	//Convert the limits to Mel
	var lowerLimitMel = freqToMel(lowerLimitFreq);
	var upperLimitMel = freqToMel(upperLimitFreq);
	//Find the range
	var range = upperLimitMel - lowerLimitMel;
	//Find the range as part of the linear interpolation
	var valueToAdd = range / (numFilters + 1);

	var fftBinsOfFreq = Array(numFilters + 2);

	for (var i = 0; i < melValues.length; i++) {
		//Initialising the mel frequencies - they are just a linear interpolation between the lower and upper limits.
		melValues[i] = i * valueToAdd;
		//Convert back to Hz
		melValuesInFreq[i] = melToFreq(melValues[i]);
		//Find the corresponding bins
		fftBinsOfFreq[i] = Math.floor((args.bufferSize + 1) * melValuesInFreq[i] / args.sampleRate);
	}

	var filterBank = Array(numFilters);
	for (var j = 0; j < filterBank.length; j++) {
		//creating a two dimensional array of size numFiltes * (args.buffersize/2)+1 and pre-populating the arrays with 0s.
		filterBank[j] = Array.apply(null, new Array(args.bufferSize / 2 + 1)).map(Number.prototype.valueOf, 0);
		//creating the lower and upper slopes for each bin
		for (var i = fftBinsOfFreq[j]; i < fftBinsOfFreq[j + 1]; i++) {
			filterBank[j][i] = (i - fftBinsOfFreq[j]) / (fftBinsOfFreq[j + 1] - fftBinsOfFreq[j]);
		}
		for (var i = fftBinsOfFreq[j + 1]; i < fftBinsOfFreq[j + 2]; i++) {
			filterBank[j][i] = (fftBinsOfFreq[j + 2] - i) / (fftBinsOfFreq[j + 2] - fftBinsOfFreq[j + 1]);
		}
	}

	var loggedMelBands = new Float32Array(numFilters);
	for (var i = 0; i < loggedMelBands.length; i++) {
		loggedMelBands[i] = 0;
		for (var j = 0; j < args.bufferSize / 2; j++) {
			//point multiplication between power spectrum and filterbanks.
			filterBank[i][j] = filterBank[i][j] * powSpec[j];

			//summing up all of the coefficients into one array
			loggedMelBands[i] += filterBank[i][j];
		}
		//log each coefficient
		loggedMelBands[i] = Math.log(loggedMelBands[i]);
	}

	//dct
	var k = Math.PI / numFilters;
	var w1 = 1.0 / Math.sqrt(numFilters);
	var w2 = Math.sqrt(2.0 / numFilters);
	var numCoeffs = 13;
	var dctMatrix = new Float32Array(numCoeffs * numFilters);

	for (var i = 0; i < numCoeffs; i++) {
		for (var j = 0; j < numFilters; j++) {
			var idx = i + j * numCoeffs;
			if (i === 0) {
				dctMatrix[idx] = w1 * Math.cos(k * (i + 1) * (j + 0.5));
			} else {
				dctMatrix[idx] = w2 * Math.cos(k * (i + 1) * (j + 0.5));
			}
		}
	}

	var mfccs = new Float32Array(numCoeffs);
	for (var _k = 0; _k < numCoeffs; _k++) {
		var v = 0;
		for (var n = 0; n < numFilters; n++) {
			var idx = _k + n * numCoeffs;
			v += dctMatrix[idx] * loggedMelBands[n];
		}
		mfccs[_k] = v / numCoeffs;
	}
	return mfccs;
};

module.exports = exports["default"];

},{"./powerSpectrum":14}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _loudness = require('./loudness');

var _loudness2 = _interopRequireDefault(_loudness);

exports["default"] = function () {
  if (typeof arguments[0].signal !== "object") {
    throw new TypeError();
  }
  var loudnessValue = (0, _loudness2["default"])(arguments[0]);
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

module.exports = exports["default"];

},{"./loudness":10}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _loudness = require('./loudness');

var _loudness2 = _interopRequireDefault(_loudness);

exports["default"] = function () {
	if (typeof arguments[0].signal !== "object") {
		throw new TypeError();
	}

	var loudnessValue = (0, _loudness2["default"])(arguments[0]);

	var max = 0;
	for (var i = 0; i < loudnessValue.specific.length; i++) {
		if (loudnessValue.specific[i] > max) {
			max = loudnessValue.specific[i];
		}
	}

	var spread = Math.pow((loudnessValue.total - max) / loudnessValue.total, 2);

	return spread;
};

module.exports = exports["default"];

},{"./loudness":10}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports["default"] = function () {
	if (typeof arguments[0].ampSpectrum !== "object") {
		throw new TypeError();
	}
	var powerSpectrum = new Float32Array(arguments[0].ampSpectrum.length);
	for (var i = 0; i < powerSpectrum.length; i++) {
		powerSpectrum[i] = Math.pow(arguments[0].ampSpectrum[i], 2);
	}
	return powerSpectrum;
};

module.exports = exports["default"];

},{}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports["default"] = function (args) {
	if (typeof args.signal !== "object") {
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

module.exports = exports["default"];

},{}],16:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extractorUtilities = require('./extractorUtilities');

exports["default"] = function () {
	if (typeof arguments[0].ampSpectrum !== "object") {
		throw new TypeError();
	}
	return (0, _extractorUtilities.mu)(1, arguments[0].ampSpectrum);
};

module.exports = exports["default"];

},{"./extractorUtilities":9}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports["default"] = function () {
	if (typeof arguments[0].ampSpectrum !== "object") {
		throw new TypeError();
	}
	var numerator = 0;
	var denominator = 0;
	for (var i = 0; i < arguments[0].ampSpectrum.length; i++) {
		numerator += Math.log(arguments[0].ampSpectrum[i]);
		denominator += arguments[0].ampSpectrum[i];
	}
	return Math.exp(numerator / arguments[0].ampSpectrum.length) * arguments[0].ampSpectrum.length / denominator;
};

module.exports = exports["default"];

},{}],18:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extractorUtilities = require('./extractorUtilities');

exports["default"] = function () {
	if (typeof arguments[0].ampSpectrum !== "object") {
		throw new TypeError();
	}
	var ampspec = arguments[0].ampSpectrum;
	var mu1 = (0, _extractorUtilities.mu)(1, ampspec);
	var mu2 = (0, _extractorUtilities.mu)(2, ampspec);
	var mu3 = (0, _extractorUtilities.mu)(3, ampspec);
	var mu4 = (0, _extractorUtilities.mu)(4, ampspec);
	var numerator = -3 * Math.pow(mu1, 4) + 6 * mu1 * mu2 - 4 * mu1 * mu3 + mu4;
	var denominator = Math.pow(Math.sqrt(mu2 - Math.pow(mu1, 2)), 4);
	return numerator / denominator;
};

module.exports = exports["default"];

},{"./extractorUtilities":9}],19:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports["default"] = function () {
	if (typeof arguments[0].ampSpectrum !== "object") {
		throw new TypeError();
	}
	var ampspec = arguments[0].ampSpectrum;
	//calculate nyquist bin
	var nyqBin = arguments[0].sampleRate / (2 * (ampspec.length - 1));
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

module.exports = exports["default"];

},{}],20:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extractorUtilities = require('./extractorUtilities');

exports["default"] = function (args) {
	if (typeof args.ampSpectrum !== "object") {
		throw new TypeError();
	}
	var mu1 = (0, _extractorUtilities.mu)(1, args.ampSpectrum);
	var mu2 = (0, _extractorUtilities.mu)(2, args.ampSpectrum);
	var mu3 = (0, _extractorUtilities.mu)(3, args.ampSpectrum);
	var numerator = 2 * Math.pow(mu1, 3) - 3 * mu1 * mu2 + mu3;
	var denominator = Math.pow(Math.sqrt(mu2 - Math.pow(mu1, 2)), 3);
	return numerator / denominator;
};

module.exports = exports["default"];

},{"./extractorUtilities":9}],21:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = function (args) {
  if (typeof args.ampSpectrum !== "object") {
    throw new TypeError();
  }

  //linear regression
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

module.exports = exports["default"];

},{}],22:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extractorUtilities = require('./extractorUtilities');

exports["default"] = function (args) {
	if (typeof args.ampSpectrum !== "object") {
		throw new TypeError();
	}
	return Math.sqrt((0, _extractorUtilities.mu)(2, args.ampSpectrum) - Math.pow((0, _extractorUtilities.mu)(1, args.ampSpectrum), 2));
};

module.exports = exports["default"];

},{"./extractorUtilities":9}],23:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports["default"] = function () {
	if (typeof arguments[0].signal !== "object") {
		throw new TypeError();
	}
	var zcr = 0;
	for (var i = 0; i < arguments[0].signal.length; i++) {
		if (arguments[0].signal[i] >= 0 && arguments[0].signal[i + 1] < 0 || arguments[0].signal[i] < 0 && arguments[0].signal[i + 1] >= 0) {
			zcr++;
		}
	}
	return zcr;
};

module.exports = exports["default"];

},{}],24:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _extractorsRms = require('./extractors/rms');

var _extractorsRms2 = _interopRequireDefault(_extractorsRms);

var _extractorsEnergy = require('./extractors/energy');

var _extractorsEnergy2 = _interopRequireDefault(_extractorsEnergy);

var _extractorsSpectralSlope = require('./extractors/spectralSlope');

var _extractorsSpectralSlope2 = _interopRequireDefault(_extractorsSpectralSlope);

var _extractorsSpectralCentroid = require('./extractors/spectralCentroid');

var _extractorsSpectralCentroid2 = _interopRequireDefault(_extractorsSpectralCentroid);

var _extractorsSpectralRolloff = require('./extractors/spectralRolloff');

var _extractorsSpectralRolloff2 = _interopRequireDefault(_extractorsSpectralRolloff);

var _extractorsSpectralFlatness = require('./extractors/spectralFlatness');

var _extractorsSpectralFlatness2 = _interopRequireDefault(_extractorsSpectralFlatness);

var _extractorsSpectralSpread = require('./extractors/spectralSpread');

var _extractorsSpectralSpread2 = _interopRequireDefault(_extractorsSpectralSpread);

var _extractorsSpectralSkewness = require('./extractors/spectralSkewness');

var _extractorsSpectralSkewness2 = _interopRequireDefault(_extractorsSpectralSkewness);

var _extractorsSpectralKurtosis = require('./extractors/spectralKurtosis');

var _extractorsSpectralKurtosis2 = _interopRequireDefault(_extractorsSpectralKurtosis);

var _extractorsZcr = require('./extractors/zcr');

var _extractorsZcr2 = _interopRequireDefault(_extractorsZcr);

var _extractorsLoudness = require('./extractors/loudness');

var _extractorsLoudness2 = _interopRequireDefault(_extractorsLoudness);

var _extractorsPerceptualSpread = require('./extractors/perceptualSpread');

var _extractorsPerceptualSpread2 = _interopRequireDefault(_extractorsPerceptualSpread);

var _extractorsPerceptualSharpness = require('./extractors/perceptualSharpness');

var _extractorsPerceptualSharpness2 = _interopRequireDefault(_extractorsPerceptualSharpness);

var _extractorsMfcc = require('./extractors/mfcc');

var _extractorsMfcc2 = _interopRequireDefault(_extractorsMfcc);

var _extractorsPowerSpectrum = require('./extractors/powerSpectrum');

var _extractorsPowerSpectrum2 = _interopRequireDefault(_extractorsPowerSpectrum);

exports['default'] = {
  "buffer": function buffer(args) {
    return args.signal;
  },
  rms: _extractorsRms2['default'],
  energy: _extractorsEnergy2['default'],
  "complexSpectrum": function complexSpectrum(args) {
    return args.complexSpectrum;
  },
  spectralSlope: _extractorsSpectralSlope2['default'],
  spectralCentroid: _extractorsSpectralCentroid2['default'],
  spectralRolloff: _extractorsSpectralRolloff2['default'],
  spectralFlatness: _extractorsSpectralFlatness2['default'],
  spectralSpread: _extractorsSpectralSpread2['default'],
  spectralSkewness: _extractorsSpectralSkewness2['default'],
  spectralKurtosis: _extractorsSpectralKurtosis2['default'],
  "amplitudeSpectrum": function amplitudeSpectrum(args) {
    return args.ampSpectrum;
  },
  zcr: _extractorsZcr2['default'],
  loudness: _extractorsLoudness2['default'],
  perceptualSpread: _extractorsPerceptualSpread2['default'],
  perceptualSharpness: _extractorsPerceptualSharpness2['default'],
  powerSpectrum: _extractorsPowerSpectrum2['default'],
  mfcc: _extractorsMfcc2['default']
};
module.exports = exports['default'];

},{"./extractors/energy":8,"./extractors/loudness":10,"./extractors/mfcc":11,"./extractors/perceptualSharpness":12,"./extractors/perceptualSpread":13,"./extractors/powerSpectrum":14,"./extractors/rms":15,"./extractors/spectralCentroid":16,"./extractors/spectralFlatness":17,"./extractors/spectralKurtosis":18,"./extractors/spectralRolloff":19,"./extractors/spectralSkewness":20,"./extractors/spectralSlope":21,"./extractors/spectralSpread":22,"./extractors/zcr":23}],25:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _utilities = require('./utilities');

var utilities = _interopRequireWildcard(_utilities);

var _featureExtractors = require('./featureExtractors');

var _featureExtractors2 = _interopRequireDefault(_featureExtractors);

var _jsfft = require('jsfft');

var fft = _interopRequireWildcard(_jsfft);

var _jsfftLibComplex_array = require('jsfft/lib/complex_array');

var complex_array = _interopRequireWildcard(_jsfftLibComplex_array);

var Meyda = (function () {
	function Meyda(options) {
		_classCallCheck(this, Meyda);

		var self = this;
		self.audioContext = options.audioContext;

		//create nodes
		self.spn = self.audioContext.createScriptProcessor(self.bufferSize, 1, 1);
		self.spn.connect(self.audioContext.destination);

		// TODO: validate options
		self.setSource(options.source);
		self.bufferSize = options.bufferSize || 256;
		self.callback = options.callback;
		self.windowingFunction = options.windowingFunction || "hanning";
		self.featureExtractors = _featureExtractors2['default'];

		//callback controllers
		var EXTRACTION_STARTED = false;
		var _featuresToExtract;

		self.barkScale = new Float32Array(self.bufferSize);

		for (var i = 0; i < self.barkScale.length; i++) {
			self.barkScale[i] = i * self.audioContext.sampleRate / self.bufferSize;
			self.barkScale[i] = 13 * Math.atan(self.barkScale[i] / 1315.8) + 3.5 * Math.atan(Math.pow(self.barkScale[i] / 7518, 2));
		}

		self.spn.onaudioprocess = function (e) {
			// self is to obtain the current frame pcm data
			var inputData = e.inputBuffer.getChannelData(0);
			self.signal = inputData;
			var windowedSignal = utilities.applyWindow(inputData, self.windowingFunction);

			// create complexarray to hold the spectrum
			var data = new complex_array.ComplexArray(self.bufferSize);
			// map time domain
			data.map(function (value, i, n) {
				value.real = windowedSignal[i];
			});
			// transform
			var spec = data.FFT();
			// assign to meyda
			self.complexSpectrum = spec;
			self.ampSpectrum = new Float32Array(self.bufferSize / 2);
			for (var i = 0; i < self.bufferSize / 2; i++) {
				self.ampSpectrum[i] = Math.sqrt(Math.pow(spec.real[i], 2) + Math.pow(spec.imag[i], 2));
			}
			// call callback if applicable
			if (typeof callback === "function" && EXTRACTION_STARTED) {
				callback(self.get(_featuresToExtract));
			}
		};
	}

	_createClass(Meyda, [{
		key: 'start',
		value: function start(features) {
			_featuresToExtract = features;
			EXTRACTION_STARTED = true;
		}
	}, {
		key: 'stop',
		value: function stop() {
			EXTRACTION_STARTED = false;
		}
	}, {
		key: 'setSource',
		value: function setSource(source) {
			source.connect(this.spn);
		}
	}, {
		key: 'get',
		value: function get(feature) {
			var self = this;
			if (typeof feature === "object") {
				var results = {};
				for (var x = 0; x < feature.length; x++) {
					results[feature[x]] = _featureExtractors2['default'][feature[x]]({
						ampSpectrum: self.ampSpectrum,
						complexSpectrum: self.complexSpectrum,
						signal: self.signal,
						bufferSize: self.bufferSize,
						sampleRate: self.audioContext.sampleRate,
						barkScale: self.barkScale
					});
				}
				return results;
			} else if (typeof feature === "string") {
				return _featureExtractors2['default'][feature]({
					ampSpectrum: self.ampSpectrum,
					complexSpectrum: self.complexSpectrum,
					signal: self.signal,
					bufferSize: self.bufferSize,
					sampleRate: self.audioContext.sampleRate,
					barkScale: self.barkScale
				});
			} else {
				throw "Invalid Feature Format";
			}
		}
	}]);

	return Meyda;
})();

exports['default'] = Meyda;

if (typeof window !== 'undefined') window.Meyda = Meyda;
module.exports = exports['default'];

},{"./featureExtractors":24,"./utilities":26,"jsfft":7,"jsfft/lib/complex_array":6}],26:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isPowerOfTwo = isPowerOfTwo;
exports.error = error;
exports.pointwiseBufferMult = pointwiseBufferMult;
exports.applyWindow = applyWindow;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

var _windowing = require('./windowing');

var windowing = _interopRequireWildcard(_windowing);

var windows = {};

function isPowerOfTwo(num) {
  while (num % 2 === 0 && num > 1) {
    num /= 2;
  }
  return num === 1;
}

function error(message) {
  throw new Error("Meyda: " + message);
}

function pointwiseBufferMult(a, b) {
  var c = [];
  for (var i = 0; i < Math.min(a.length, b.length); i++) {
    c[i] = a[i] * b[i];
  }
  return c;
}

function applyWindow(signal, windowname) {
  if (!windows[windowname]) windows[windowname] = {};
  if (!windows[windowname][signal.length]) windows[windowname][signal.length] = windowing.hanning(signal.length);

  return pointwiseBufferMult(signal, windows[windowname][signal.length]);
}

},{"./windowing":27}],27:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hanning = hanning;
exports.hamming = hamming;
var generateBlackman = function generateBlackman(size) {
  var blackman = new Float32Array(size);
  //According to http://uk.mathworks.com/help/signal/ref/blackman.html
  //first half of the window
  for (var i = 0; i < size % 2 ? (size + 1) / 2 : size / 2; i++) {
    blackman[i] = 0.42 - 0.5 * Math.cos(2 * Math.PI * i / (size - 1)) + 0.08 * Math.cos(4 * Math.PI * i / (size - 1));
  }
  //second half of the window
  for (var i = size / 2; i > 0; i--) {
    blackman[size - i] = blackman[i];
  }
};

// @TODO: finish and export Blackman

function hanning(size) {
  var hanningBuffer = new Float32Array(size);
  for (var i = 0; i < size; i++) {
    //According to the R documentation http://rgm.ogalab.net/RGM/R_rdfile?f=GENEAread/man/hanning.window.Rd&d=R_CC
    hanningBuffer[i] = 0.5 - 0.5 * Math.cos(2 * Math.PI * i / (size - 1));
  }
  return hanningBuffer;
}

function hamming(size) {
  var hammingBuffer = new Float32Array(size);
  for (var i = 0; i < size; i++) {
    //According to http://uk.mathworks.com/help/signal/ref/hamming.html
    hammingBuffer[i] = 0.54 - 0.46 * Math.cos(2 * Math.PI * (i / size - 1));
  }
  return hammingBuffer;
}

},{}]},{},[25]);
