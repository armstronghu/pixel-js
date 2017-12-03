# pixel-js
# [pixel-js-k](https://github.com/keicoon/pixel-js) &middot; [![npm](https://img.shields.io/npm/v/pixel-js-k.svg)](https://www.npmjs.com/package/pixel-js-k)

### Dependency
```
npm install
```
### Test
```
node test/test
```
```
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
```

<image src = https://github.com/keicoon/pixel-js/blob/master/test/dog.png > <image src = https://github.com/keicoon/pixel-js/blob/master/test/_dog.png >
    
<image src = https://github.com/keicoon/pixel-js/blob/master/test/cat.png > <image src = https://github.com/keicoon/pixel-js/blob/master/test/_cat.png >
