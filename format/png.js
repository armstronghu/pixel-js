'use strict'

const _ = require('lodash')
const {bType, lType} = require('../lib/type')
const Color = require('../lib/color')

const CUNKS_TYPE = {
    "CRRITICAL": {
        "SIGNATURE": {
            "1": bType('int8 = 0x89'),
            "PNG": bType('char = PNG'),
            "5": bType('int8 = 0x0D'),
            "6": bType('int8 = 0x0A'),
            "7": bType('int8 = 0x1A'),
            "8": bType('int8 = 0x0A')
        },
        "IHRD": {
            "Length": bType('int32 = 0x13'),
            "ChunkType": bType('char = IHDR'),
            "ImageWidth": bType('int32'),
            "ImageHeight": bType('int32'),
            "PNGbitDepth": bType('int8'),
            "PNGColorType": bType('int8'),
            "Compression": bType('int8'),
            "Filter": bType('int8'),
            "Interlace": bType('int8'),
            "CRC": bType('int32')
        },
        "IDAT": {
            "Length": bType('int32'),
            "CRC": bType('int32')
        },
        "IEND": {
            "Length": bType('int32'),
            "CRC": bType('int32')
        }
    },
    "ANCILLARY": {
        "PLTE": {
            "Length": bType('int32'),
            "ChunkType": bType('char = PLTE'),
            "Palette": bType('int16[]'),
            "CRC": bType("int32")
        },
        "sRGB": {
            "Length": bType('int32'),
            "RenderingIntent": bType('int8'),
            "CRC": bType('int32')
        },
        "gAMA": {
            "Length": bType('int32'),
            "Gamma": bType('int32'),
            "CRC": bType('int32')
        },
        "pHYs": {
            "Length": bTytpe('int32 = 9'),
            "PixelsPerUnitAxisX": bType('int32'),
            "PixelsPerUnitAxisY": bType('int32'),
            "UnitSpecifier": bType('int8'),
            "CRC": bType('int32')
        }
    }
}




const Format = require('./defaultformatclass')
module.exports = class PNG extends Format {
    constructor(binary) {
        super(binary);

        this.header;
        this.pixels;
    }

    static ToBinary() { }

    IsValid() { return this.binary != undefined }

    get Binary() { return this.binary; }
    get Header() { return this.header; }
    get Pixels() { return this.pixels; }
    get Width() { }
    get Height() { }
}