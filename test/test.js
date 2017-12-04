'use strict'

const pixelJS = require('../app');

let pJS = new pixelJS();

pJS.On('onloaded', () => {

    pixelJS.filter('blur')(pJS.Pixels, pJS.Width, pJS.Height);
    pixelJS.filter('bit')(pJS.Pixels, pJS.Width, pJS.Height, 3);
    pixelJS.filter('downsampling')(pJS.Pixels, pJS.Width, pJS.Height, 5);
    pixelJS.filter('bright')(pJS.Pixels, pJS.Width, pJS.Height);

    pJS.Save('./test/_cat.jpeg');
});

pJS.Load('./test/cat.jpeg');