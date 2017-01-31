'use strict'

function RGB2YCbCr(R, G, B) {
    return {
        Y: 0.257 * R + 0.504 * G + 0.098 * B + 16,
        Cb: -0.148 * R - 0.291 * G + 0.439 * B + 128,
        Cr: 0.439 * R - 0.368 * G - 0.071 * B + 128
    }
}

// function YCbCr2RGB(Y, Cb, Cr) {
//     return {
//         R: 1.164 * (Y - 16) + 1.596 * (Cr - 128),
//         G: 1.164 * (Y - 16) - 0.813 * (Cr - 128) - 0.392 * (Cb - 128),
//         B: 1.164 * (Y - 16) + 2.017 * (Cb - 128)
//     }
// }

module.exports = class GrayFilter {

    static ConvertGray(pixels, width, height) {
        for (let i = 0, h = height; i < h; i++) {
            for (let j = 0, w = width; j < w; j++) {
                let c = pixels[i][j]
                let {Y} = RGB2YCbCr(c.r, c.g, c.b)
                Y = parseInt(Y)
                c.rgb = [Y, Y, Y]
            }
        }
    }

}