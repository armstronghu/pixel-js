'use strict'

const pixelJS = require('../app')

let bmp = new pixelJS()
bmp.Load('./test/dragonmaid.bmp')

pixelJS.filter('gray').ConvertGray(bmp.Pixels, bmp.Width, bmp.Height)

bmp.Save('./test/dragonmaid_gray.bmp')