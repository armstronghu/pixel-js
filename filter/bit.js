'use strict'

module.exports = class BitFilter {

    static Set(pixels, width, height, bit = 2) {
        const bit_diff = Math.min(Math.max(8 - bit, 0), 8);
        for (let i = 0, h = height; i < h; i++) {
            for (let j = 0, w = width; j < w; j++) {
                pixels[i][j].r = (parseInt(pixels[i][j].r >> bit_diff) << bit_diff);
                pixels[i][j].g = (parseInt(pixels[i][j].g >> bit_diff) << bit_diff);
                pixels[i][j].b = (parseInt(pixels[i][j].b >> bit_diff) << bit_diff);
            }
        }
    }

}