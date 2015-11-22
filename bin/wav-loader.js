var WavManager = function(data_callback, end_callback) {

	var source = new Buffer(1);
	var fs = require('fs');
	var wav = require('wav');
	var _dcb = data_callback;
	var _ecb = end_callback;
	var _bitDepth = 16;
	var _numBytesPerSample = 2;
	var _endian = 'LE';
	var _format = 'unknown';
  var _channels = 1;
  var readFunctionWithSignednessAndEndianness = "readUIntBE";

	this.format = function() {
		return _format;
	};

	this.open = function (path) {
			var file = fs.createReadStream(path);

			var source = new Buffer(1); //empty the current source if needed

			var reader = new wav.Reader();

			reader.on('format', function(format) {
				_bitDepth = format.bitDepth;
				_numBytesPerSample = _bitDepth/8;
				_endian = format.endianness;
        _channels = format.channels;
				_format = format;
        readFunctionWithSignednessAndEndianness = (format.signed?"readInt":"readUInt")+_endian;
        console.log(format);
			});



			reader.on('data', function(_d) {
				source = Buffer.concat([source, _d], source.length + _d.length);

				var output = new Float32Array(_d.length/_numBytesPerSample);

				for (var i = 0; i < _d.length/_numBytesPerSample; i += _numBytesPerSample) {
					output[i] = _d[readFunctionWithSignednessAndEndianness](i,_numBytesPerSample);
				}

				if (_dcb) _dcb(output);
			});

			reader.on('end', function() {
				var output = new Float32Array(source.length/_numBytesPerSample);

				for (var i = 0; i < source.length/_numBytesPerSample; i += _numBytesPerSample) {
					output[i] = source[readFunctionWithSignednessAndEndianness](i,_numBytesPerSample);
				}

				if (_ecb) _ecb(output);
			});

			file.pipe(reader);
		};

};

module.exports = WavManager;
