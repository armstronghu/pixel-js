'use strict'

const _ = require('lodash')
const Type = require('../lib/type')
const Color = require('../lib/color')

const FILE_HEADER = {
    "bfType": Type(2, 'BM', 'CHAR', 'BIG'),
    "bfSize": Type(4),
    "bfReserved1": Type(2),
    "bfReserved2": Type(2),
    "bf0ffBits": Type(4, 54),
}

const IMAGE_HEADER = {
    "biSze": Type(4, 40),
    "biWidth": Type(4),
    "biHeight": Type(4),
    "biPlanes": Type(2, 1),
    "biBitCount": Type(2, 24),
    "biCompression": Type(4),
    "biSizeImage": Type(4),
    "biXPelsPerMeter": Type(4),
    "biYPelsPerMeter": Type(4),
    "biClrUsed": Type(4),
    "biClrImportant": Type(4)
}

const Format = require('./defaultformatclass')
module.exports = class BMP extends Format {

    constructor(binary) {
        super(binary);

        this.header = this.GetHeader();
        this.pixels = this.GetPixels();
    }

    Export(binary) {

    }
    get Width() { return this.header.imageHeader.biWidth }
    get Height() { return this.header.imageHeader.biHeight }

    GetHeader() {
        if (this.IsValid() == false) throw Error("binary가 존재하지 않습니다.")

        const binary = this.binary
        let pin = 0;

        let fileHeader = {};
        _.map(FILE_HEADER, (value, key) => {
            let buffer = binary.slice(pin, pin += value.byteLength);

            let iValue = value.BufferToValue(buffer);
            fileHeader[key] = iValue
        })

        let imageHeader = {};
        _.map(IMAGE_HEADER, (value, key) => {
            let buffer = binary.slice(pin, pin += value.byteLength)

            let iValue = value.BufferToValue(buffer);
            imageHeader[key] = iValue;
        })

        return { fileHeader, imageHeader };
    }

    GetPixels() {
        if (this.IsValid() == false) throw Error("binary가 존재하지 않습니다.")

        const binary = this.binary
        let pin = this.header.fileHeader.bf0ffBits;
        const width = this.header.imageHeader.biWidth,
            height = this.header.imageHeader.biHeight,
            bitCount = this.header.imageHeader.biBitCount;

        const pixels = new Array(height)
        for (var h = 0; h < height; ++h) {
            pixels[h] = new Array(width)
            for (var w = 0; w < width; ++w) {
                const color = this.GetColor(binary, pin, bitCount)
                pixels[h][w] = color;
            }
        }
        return pixels;
    }

    GetColor(binary, pin, bitCount) {
        return {
            "24": () => {
                const Int8 = Type(1)
                const B = Int8.BufferToValue(binary.slice(pin, pin += 1))
                const G = Int8.BufferToValue(binary.slice(pin, pin += 1))
                const R = Int8.BufferToValue(binary.slice(pin, pin += 1))
                return new Color(R, G, B);
            }
        }[bitCount]()
    }

    static ToBinary(header = { fileHeader: {}, imageHeader: {} }, pixels) {

        let { fileHeader, imageHeader } = defaultHeader(pixels)
        fileHeader = Object.assign(fileHeader, header.fileHeader)
        imageHeader = Object.assign(imageHeader, header.imageHeader)

        let binary = Buffer.alloc(0);

        let headerBuffer = Buffer.alloc(0);
        _.each(fileHeader, (value, key) => {
            let valueBuffer = value.ValueToBuffer();
            headerBuffer = Buffer.concat([headerBuffer, valueBuffer])
        })

        _.each(imageHeader, (value, key) => {
            let valueBuffer = value.ValueToBuffer();
            headerBuffer = Buffer.concat([headerBuffer, valueBuffer])
        })
        binary = Buffer.concat([binary, headerBuffer]);

        const width = imageHeader.biWidth.value,
            height = imageHeader.biHeight.value;

        let pixelBuffer = Buffer.alloc(0);
        for (var h = 0; h < height; ++h) {
            for (var w = 0; w < width; ++w) {
                const color = pixels[h][w];

                let buffer = Buffer.allocUnsafe(3);
                buffer.writeUInt8(color.B, 0);
                buffer.writeUInt8(color.G, 1);
                buffer.writeUInt8(color.R, 2);
                
                pixelBuffer = Buffer.concat([pixelBuffer, buffer])
            }
        }
        binary = Buffer.concat([binary, pixelBuffer]);

        return binary;
    }
}

function defaultHeader(pixels) {
    const width = pixels[0].length,
        height = pixels.length,
        bitCount = 24;

    let DEFAULT_FILE_HEADER = _.clone(FILE_HEADER)
    DEFAULT_FILE_HEADER.bfSize.SetValue(width * height * (bitCount / 8) + 54)

    let DEFAULT_IMAGE_HEADER = _.clone(IMAGE_HEADER)
    DEFAULT_IMAGE_HEADER.biWidth.SetValue(width);
    DEFAULT_IMAGE_HEADER.biHeight.SetValue(height);
    DEFAULT_IMAGE_HEADER.biBitCount.SetValue(bitCount);


    return { fileHeader: DEFAULT_FILE_HEADER, imageHeader: DEFAULT_IMAGE_HEADER };
}