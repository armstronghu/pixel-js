# pixel-js


### Dependency
```
npm install
```
### Test
```
node test/test
```
```
const pixelJS = require('pixel-js')

let bmp = new pixelJS()
bmp.Load('./test/RED.BMP')

let pixels = bmp.Pixels
for (let i = 0, h = bmp.Height; i < h; i++) {
    for (let j = 0, w = bmp.Width; j < w; j++) {
        let c = pixels[i][j]
        c.rgb = [0, 0, 255]
    }
}

bmp.Save('./test/BLUE.bmp')
```