'use strict'

const _ = require('lodash')

const BinaryLoader = require('./lib/binary-loader')
const BinarySaver = require('./lib/binary-saver')

module.exports = class pixelJS {

    constructor(...params) {
        this.opts = params;
        this.bLoaded = false;

        this.event_map = {
            "emit": (__event_name) => {
                if (this.event_map[__event_name]) {
                    const func = this.event_map[__event_name];
                    func();
                }
            }
        };
    }

    On(__event_name, func) {
        this.event_map[__event_name] = func;
    }

    Load(__filePath) {

        const EXT = GetPathToEXT(__filePath)
        IsValidEXT(EXT)

        const BINARY = BinaryLoader(__filePath)
        if (!BINARY) throw Error(`파일을 읽을 수 없습니다. ${__filePath}`)

        const bParsingSucced = this.format = Parse(EXT, BINARY)
        if (!bParsingSucced) throw Error('올바른 파일구조가 아닙니다.')

        this.format.event_map = this.event_map;
    }

    Save(__filePath, headerOption) {

        const EXT = GetPathToEXT(__filePath)
        IsValidEXT(EXT)

        const FormatClass = GetFormatClass(EXT);
        const binary = FormatClass.ToBinary(headerOption, this.Pixels, this.format)
        BinarySaver(__filePath, binary)

        return true;
    }

    Close() {
        // release memory
    }

    get Width() { return this.format.Width }
    get Height() { return this.format.Height }
    get Pixels() { return this.format.Pixels }

    static filter(filterType) {
        const __filter = {
            "gray": require('./filter/gray'),
            "blur": require('./filter/blur'),
            "bit": require('./filter/bit'),
            "downsampling": require('./filter/downsampling'),
        }[filterType];
        if (__filter) {
            return __filter.Set
        } else {
            return () => {
                console.warn("Can't find filter", filterType);
            };
        }
    }
}

const SURPORTTED_TYPE = ['bmp', 'png'] //... jpeg, gif

function GetPathToEXT(__filePath) {
    return _.last(_.split(__filePath, '.')).toLowerCase()
}

function IsValidEXT(EXT) {
    if (_.includes(SURPORTTED_TYPE, EXT) == false) throw Error(`지원하지 않는 타입입니다. ${EXT}`)

    return true;
}

function GetFormatClass(EXT) {
    return {
        "bmp": require('./format/bitmap'),
        "png": require('./format/pngjs')
    }[EXT];
}

function Parse(EXT, binary) {
    const FormatClass = GetFormatClass(EXT);

    if (FormatClass && binary)
        return new FormatClass(binary)
    else
        return null;
}