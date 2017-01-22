'use strict'

const pixelJS = require('../app')

let bmp = new pixelJS()
bmp.Load('./RED.BMP')

console.log(bmp.ToPiexels())