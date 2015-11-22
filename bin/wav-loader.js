var WavManager = function(data_callback, end_callback) {

	var source = new Buffer(1)
	var fs = require('fs')
	var wav = require('wav')
	var _dcb = data_callback
	var _ecb = end_callback
	var _bitDepth = 16
	var _numBytesPerSample = 2
	var _endian = 'LE'
	var _format = 'unknown'

	this.format = function() {
		return _format
	}

	this.open = function (path) {
			var file = fs.createReadStream(path)

			source = new Buffer(1); //empty the current source if needed

			var reader = new wav.Reader()

			reader.on('format', function(format) {
				_bitDepth = format.bitDepth
				_numBytesPerSample = _bitDepth/8
				_endian = format.endianness
				_format = format
			})

			reader.on('data', function(_d) {
				source = Buffer.concat([source, _d], source.length + _d.length)

				var output = new Float32Array(_d.length/_numBytesPerSample)

				for (var i = 0; i < _d.length/_numBytesPerSample; i += _numBytesPerSample) {
				  //you can extend these if statements to account for more bit depth/endianness combinations
					if (_endian == 'BE')
						output[i] = _d.readInt16BE(i)
					else
						output[i] = _d.readInt16LE(i)
				}

				if (_dcb) _dcb(output)
			})

			reader.on('end', function() {
				var output = new Float32Array(source.length/_numBytesPerSample)

				for (var i = 0; i < source.length/_numBytesPerSample; i += _numBytesPerSample) {
					if (_endian == 'BE')
						output[i] = source.readInt16BE(i)
					else
						output[i] = source.readInt16LE(i)
				}

				if (_ecb) _ecb(output)
			})

			file.pipe(reader)
		}

}

module.exports = WavManager
