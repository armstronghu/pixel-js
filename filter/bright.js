'use strict'

module.exports = class BrightFilter {

    static Set(pixels, width, height, offset = 25.5) {
        for (let i = 0, h = height; i < h; i++) {
            for (let j = 0, w = width; j < w; j++) {
                pixels[i][j].r = pixels[i][j].r + offset;
                pixels[i][j].g = pixels[i][j].g + offset;
                pixels[i][j].b = pixels[i][j].b + offset;
            }
        }
    }

}