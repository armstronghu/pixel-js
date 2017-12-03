'use strict'

module.exports = class BitFilter {

    static Set(pixels, width, height, slide = 2) {
        for (let i = 0, h = height; i < h; i += slide) {
            for (let j = 0, w = width; j < w; j += slide) {

                for (let s_i = 0; s_i < slide; s_i++) {
                    for (let s_j = 0; s_j < slide; s_j++) {

                        const h = Math.min(i + s_i, height - 1);
                        const w = Math.min(j + s_j, width - 1);

                        pixels[h][w].r = pixels[i][j].r;
                        pixels[h][w].g = pixels[i][j].g;
                        pixels[h][w].b = pixels[i][j].b;
                    }
                }

            }
        }
    }

}