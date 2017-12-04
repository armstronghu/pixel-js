'use strict'

const _ = require('lodash')
const { bType, lType } = require('../lib/type')
const Color = require('../lib/color')

const jpegJS = require('jpeg-js');

const Format = require('./defaultformatclass')
module.exports = class JPEG extends Format {
    constructor(binary) {
        super(binary);

        this.GetPixels();
    }

    GetPixels() {
        this.rawImageData = jpegJS.decode(this.binary);
        let idx = 0;
        const pixels = new Array(this.Height);
        for (var y = 0; y < this.Height; y++) {
            pixels[y] = new Array(this.Width)
            for (var x = 0; x < this.Width; x++) {
                let color = new Color(this.rawImageData.data[idx++], this.rawImageData.data[idx++], this.rawImageData.data[idx++], this.rawImageData.data[idx++]);
                pixels[y][x] = color;
            }
        }
        this.pixels = pixels;

        process.nextTick(() => { this.event_map.emit('onloaded'); });
    }

    static ToBinary(headerOption, pixels, format) {
        let frameData = new Buffer(format.Width * format.Height * 4);
        let idx = 0;
        for (var y = 0; y < format.Height; y++) {
            for (var x = 0; x < format.Width; x++) {
                const color = pixels[y][x];
                
                frameData[idx++] = color.R;
                frameData[idx++] = color.G;
                frameData[idx++] = color.B;
                frameData[idx++] = color.A;
            }
        }

        return jpegJS.encode({
            data: frameData,
            width: format.Width,
            height: format.Height
        }, 50).data;
    }

    IsValid() { return this.binary != undefined; }

    get Binary() { return this.binary; }
    get Header() { return this.header; }
    get Pixels() { return this.pixels; }
    get Width() { return this.rawImageData.width; }
    get Height() { return this.rawImageData.height; }
}