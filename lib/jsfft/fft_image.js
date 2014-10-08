'use strict';

!function(complex_array, fft) {

  var ComplexArray = complex_array.ComplexArray

  fft.FFTImageDataRGBA = function(data, nx, ny) {
    var rgb = splitRGB(data)

    return mergeRGB(
      FFT2D(new ComplexArray(rgb[0], Float32Array), nx, ny),
      FFT2D(new ComplexArray(rgb[1], Float32Array), nx, ny),
      FFT2D(new ComplexArray(rgb[2], Float32Array), nx, ny)
    )
  }

  function splitRGB(data) {
    var n = data.length / 4,
        r = new Uint8ClampedArray(n),
        g = new Uint8ClampedArray(n),
        b = new Uint8ClampedArray(n),
        i

    for(i = 0; i < n; i++) {
      r[i] = data[4 * i    ]
      g[i] = data[4 * i + 1]
      b[i] = data[4 * i + 2]
    }

    return [r, g, b]
  }

  function mergeRGB(r, g, b) {
    var n = r.length,
        output = new ComplexArray(n * 4),
        i

    for(i = 0; i < n; i++) {
      output.real[4 * i    ] = r.real[i]
      output.imag[4 * i    ] = r.imag[i]
      output.real[4 * i + 1] = g.real[i]
      output.imag[4 * i + 1] = g.imag[i]
      output.real[4 * i + 2] = b.real[i]
      output.imag[4 * i + 2] = b.imag[i]
    }

    return output
  }

  function FFT2D(input, nx, ny, inverse) {
    var i, j,
        transform = inverse ? 'InvFFT' : 'FFT',
        output = new ComplexArray(input.length, input.ArrayType),
        row = new ComplexArray(nx, input.ArrayType),
        col = new ComplexArray(ny, input.ArrayType)

    for(j = 0; j < ny; j++) {
      row.map(function(v, i) {
        v.real = input.real[i + j * nx]
        v.imag = input.imag[i + j * nx]
      })
      row[transform]().forEach(function(v, i) {
        output.real[i + j * nx] = v.real
        output.imag[i + j * nx] = v.imag
      })
    }

    for(i = 0; i < nx; i++) {
      col.map(function(v, j) {
        v.real = output.real[i + j * nx]
        v.imag = output.imag[i + j * nx]
      })
      col[transform]().forEach(function(v, j) {
        output.real[i + j * nx] = v.real
        output.imag[i + j * nx] = v.imag
      })
    }

    return output
  }

}(
  typeof require === 'undefined' && (this.complex_array) ||
    require('./complex_array'),
  typeof require === 'undefined' && (this.fft) ||
    require('./fft')
)
