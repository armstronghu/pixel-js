'use strict'

const _ = require('lodash')
const {bType, lType} = require('../lib/type')
const Color = require('../lib/color')

const FILE_HEADER = {
    "bfType": bType('char=BM'),
    "bfSize": lType('int32'),
    "bfReserved1": lType('int16'),
    "bfReserved2": lType('int16'),
    "bf0ffBits": lType('int32=54'),
}

const IMAGE_HEADER = {
    "biSze": lType('int32=40'),
    "biWidth": lType('int32'),
    "biHeight": lType('int32'),
    "biPlanes": lType('int16=1'),
    "biBitCount": lType('int16=24'),
    "biCompression": lType('int32'),
    "biSizeImage": lType('int32'),
    "biXPelsPerMeter": lType('int32'),
    "biYPelsPerMeter": lType('int32'),
    "biClrUsed": lType('int32'),
    "biClrImportant": lType('int32')
}

const Format = require('./defaultformatclass')
module.exports = class BMP extends Format {

    constructor(binary) {
        super(binary);

        this.header = this.GetHeader();
        this.pixels = this.GetPixels();
    }

    get Width() { return this.header.imageHeader.biWidth }
    get Height() { return this.header.imageHeader.biHeight }
    
    GetHeader() {
        if (this.IsValid() == false) throw Error("binary가 존재하지 않습니다.")

        const binary = this.binary
        let pin = 0;

        let fileHeader = {};
        _.map(FILE_HEADER, (value, key) => {
            let iValue = value.BufferToValue(binary, pin);
            pin += value.length
            fileHeader[key] = iValue
        })

        let imageHeader = {};
        _.map(IMAGE_HEADER, (value, key) => {
            let iValue = value.BufferToValue(binary, pin);
            pin += value.length
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
                const Int8 = lType('int8')
                const byteLength = Int8.length
                const B = Int8.BufferToValue(binary, pin)
                pin += byteLength
                const G = Int8.BufferToValue(binary, pin)
                pin += byteLength
                const R = Int8.BufferToValue(binary, pin)
                pin += byteLength
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