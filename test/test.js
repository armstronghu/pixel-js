'use strict'

const pixelJS = require('../app');

let png = new pixelJS();

png.On('onloaded', () => {

    pixelJS.filter('blur')(png.Pixels, png.Width, png.Height);
    pixelJS.filter('bit')(png.Pixels, png.Width, png.Height, 3);
    pixelJS.filter('downsampling')(png.Pixels, png.Width, png.Height, 5);
    pixelJS.filter('bright')(png.Pixels, png.Width, png.Height);

    png.Save('./test/_cat.png');
});

png.Load('./test/cat.png');