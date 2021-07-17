var WavManager = function (open_callback, data_callback, end_callback) {
  var source = new Buffer(1);
  var fs = require("fs");
  var wav = require("wav");
  var _dcb = data_callback;
  var _ecb = end_callback;
  var _bitDepth = 16;
  var _numBytesPerSample = 2;
  var _endian = "LE";
  var _signed = false;
  var _format = "unknown";
  var _channels = 1;
  var read_fun = "readUIntBE";

  function int_res(signed, depth) {
    //if the fmt is signed int, the max absolute value is half the actual number of possible values
    return signed ? Math.pow(2, depth) / 2 : Math.pow(2, depth);
  }

  this.format = function () {
    return _format;
  };

  this.open = function (path) {
    var file = fs.createReadStream(path);

    var source = new Buffer(1); //empty the current source if needed

    var reader = new wav.Reader();

    reader.on("format", function (format) {
      //read wav headers
      open_callback({ sampleRate: format.sampleRate });
      _bitDepth = format.bitDepth;
      _numBytesPerSample = _bitDepth / 8;
      _endian = format.endianness;
      _signed = format.signed;
      _channels = format.channels;
      _format = format;
      read_fun = (_signed ? "readInt" : "readUInt") + _endian;
    });

    reader.on("data", function (_d) {
      source = Buffer.concat([source, _d], source.length + _d.length);

      var output = new Float32Array(_d.length / _numBytesPerSample);

      var source_pos = 0;
      var out_pos = 0;
      for (
        ;
        source_pos < _d.length;
        source_pos += _numBytesPerSample, out_pos++
      ) {
        output[out_pos] =
          _d[read_fun](source_pos, _numBytesPerSample) /
          int_res(_signed, _bitDepth);
      }

      if (_dcb) _dcb(output);
    });

    reader.on("end", function () {
      var output = new Float32Array(source.length / _numBytesPerSample);

      var source_pos = 0;
      var out_pos = 0;
      //here we discard the last byte because we don't really need this anyway and it's quicker
      for (
        ;
        source_pos < source.length - _numBytesPerSample;
        source_pos += _numBytesPerSample, out_pos++
      ) {
        output[out_pos] =
          source[read_fun](source_pos, _numBytesPerSample) /
          int_res(_signed, _bitDepth);
      }

      if (_ecb) _ecb(output);
    });

    file.pipe(reader);
  };
};

module.exports = WavManager;
