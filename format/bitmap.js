'use strict'

const _ = require('lodash')
const Type = require('../lib/type')
const Color = require('../lib/color')

const FILE_HEADER = {
    "bfType": Type(2, 'CHAR', 'BIG'),
    "bfSize": Type(4),
    "bfReserved1": Type(2),
    "bfReserved2": Type(2),
    "bf0ffBits": Type(4),
}

const IMAGE_HEADER = {
    "biSze": Type(4),
    "biWidth": Type(4),
    "biHeight": Type(4),
    "biPlanes": Type(2),
    "biBitCount": Type(2),
    "biCompression": Type(2),
    "biSizeImage": Type(4),
    "biXPelsPerMeter": Type(4),
    "biYPelsPerMeter": Type(4),
    "biClrUsed": Type(4),
    "biClrImportant": Type(4)
}

const Format = require('./defaultformatclass')
module.exports = class BMP extends Format {

    constructor(binary) {
        this.binary = binary;

        super(binary, this.GetHeader(), this.GetPixels())
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

    static ToBinary(header, pixels) {

        let binary;

        const width = header.imageHeader.biWidth,
            height = header.imageHeader.biHeight;

        for (var h = 0; h < height; ++h) {
            for (var w = 0; w < width; ++w) {
                const color = pixels[h][w];

                let buffer = new Uint8Array(3)
                buffer[0] = color.B
                buffer[1] = color.G
                buffer[2] = color.R

                binary.append(buffer)
            }
        }
        
        return binary;
    }
}