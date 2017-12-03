'use strict'

const pixelJS = require('../app');

let png = new pixelJS();

png.On('onloaded', () => {

    pixelJS.filter('gray')(png.Pixels, png.Width, png.Height)

    png.Save('./test/gray_dog.png');
});

png.Load('./test/dog.png');