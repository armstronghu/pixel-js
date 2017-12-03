'use strict'

const Gaussian_Filter = [
    159,
    2, 4, 5, 4, 2,
    4, 9, 12, 9, 4,
    5, 12, 15, 12, 5,
    4, 9, 12, 9, 4,
    2, 4, 5, 4, 2
]

function AdjustFilter(pixels, i, j, w, h, filter) {
    const filter_l = parseInt(Math.sqrt(filter.length) * 0.5);

    let index = 1, sum = [0, 0, 0]
    for (let y = -filter_l; y <= filter_l; y++) {
        const Y = ((i + y) < 0) ? 0 : ((i + y) >= h) ? (h - 1) : i + y
        for (let x = -filter_l; x <= filter_l; x++) {
            const X = ((j + x) < 0) ? 0 : ((j + x) >= w) ? (w - 1) : j + x

            sum[0] += pixels[Y][X].r * filter[index]
            sum[1] += pixels[Y][X].g * filter[index]
            sum[2] += pixels[Y][X].b * filter[index++]
        }
    }
    pixels[i][j].rgb = [
        parseInt(sum[0] / Gaussian_Filter[0]),
        parseInt(sum[1] / Gaussian_Filter[0]),
        parseInt(sum[2] / Gaussian_Filter[0])
    ]
}

module.exports = class BlurFilter {

    static Set(pixels, width, height) {
        for (let i = 0, h = height; i < h; i++) {
            for (let j = 0, w = width; j < w; j++) {
                AdjustFilter(pixels, i, j, width, height, Gaussian_Filter)
            }
        }
    }

}