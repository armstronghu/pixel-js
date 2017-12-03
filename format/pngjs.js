'use strict'

const _ = require('lodash')
const { bType, lType } = require('../lib/type')
const Color = require('../lib/color')

const PNGJS = require('pngjs').PNG;


const Format = require('./defaultformatclass')
module.exports = class PNG extends Format {
    constructor(binary) {
        super(binary);

        // this.header;
        // this.pixels;

        this.GetPixels();
    }

    GetPixels() {
        this.PNG = new PNGJS({ filterType: 4 });
        new Promise((resolve) => {
            this.PNG.parse(this.binary, function (error, data) {
                const pixels = new Array(data.height);
                for (var y = 0; y < data.height; y++) {
                    pixels[y] = new Array(data.width)
                    for (var x = 0; x < data.width; x++) {
                        var idx = (data.width * y + x) << 2;
                        let color = new Color(data.data[idx], data.data[idx + 1], data.data[idx + 2], data.data[idx + 3]);
                        pixels[y][x] = color;
                    }
                }

                resolve(pixels);
            });
        }).then((pixels) => {
            this.pixels = pixels;
            this.event_map.emit('onloaded');
        })
    }

    static ToBinary(headerOption, pixels, format) {
        for (var y = 0; y < format.Height; y++) {
            for (var x = 0; x < format.Width; x++) {
                var idx = (format.Width * y + x) << 2;
                const color = pixels[y][x];

                format.PNG.data[idx] = color.R;
                format.PNG.data[idx + 1] = color.G;
                format.PNG.data[idx + 2] = color.B;
                format.PNG.data[idx + 3] = color.A;
            }
        }

        return format.PNG.pack();
    }

    IsValid() { return this.binary != undefined; }

    get Binary() { return this.binary; }
    get Header() { return this.header; }
    get Pixels() { return this.pixels; }
    get Width() { return this.PNG.width; }
    get Height() { return this.PNG.height; }
}