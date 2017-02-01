'use strict'

const BM = new class benchmark {
    Set(text) {
        const c = Math.floor(new Date() / 1000);
        this.l = this.l || c;
        const elap = (c - this.l);
        this.l = c;
        console.log(text, ':', elap, 'secs');
    }
}

const pixelJS = require('../app')

let bmp = new pixelJS()

BM.Set('Start')

bmp.Load('./test/dm.bmp')
BM.Set('Load')

// pixelJS.filter('gray').ConvertGray(bmp.Pixels, bmp.Width, bmp.Height)
// BM.Set('Convert')

pixelJS.filter('blur').Blur(bmp.Pixels, bmp.Width, bmp.Height)
BM.Set('Blur')

bmp.Save('./test/dm_gray.bmp')
BM.Set('Save')