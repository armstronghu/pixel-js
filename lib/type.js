'use strict'

const _ = require('lodash')
const Enum = require('./enum')

const SURPORTTED_TYPE = ['CHAR', 'INT8', 'INT16', 'INT32']
const TYPE = Enum(SURPORTTED_TYPE)
const EDIAN = Enum(['LITTLE', 'BIG'])

class Type {
    constructor(arg) {
        const parse = arg.split('=')
        if (parse.length < 1) throw Error('Invalid Type')

        const type = _.trim(_.toUpper(parse[0]))
        const value = _.trim(parse[1])
        if (_.includes(SURPORTTED_TYPE, type) == false) throw Error('unSupported Type')
        this.type = TYPE[type]

        if (_.includes(type, 'CHAR')) {
            this.value = value || ''
        }
        else if (_.includes(type, 'INT')) {
            const bHex = _.includes(value, '0x')
            this.value = parseInt(value || 0, bHex || 10)
        }
    }

    $Get(type) {
        return TYPE[type]
    }

    SetValue(value) {
        this.value = value
    }

    BufferToValue(buffer, pin = 0) {
        if (this.type == TYPE.CHAR) {
            const byteLength = this.length;
            buffer = buffer.slice(pin, pin += byteLength)
            const str = []
            for (let Index = 0, Length = byteLength; Index < Length; ++Index) {
                const char = buffer.toString('ascii', Index, Index + 1)
                if (this.edianType == EDIAN.LITTLE) str.unshift(char)
                else str.push(char)
            }
            return str.join("")
        }
        else if (this.type == TYPE.INT8) {
            buffer = buffer.slice(pin, pin += 1)
            return buffer.readUInt8()
        }
        else if (this.type == TYPE.INT16) {
            buffer = buffer.slice(pin, pin += 2)
            if (this.edianType == EDIAN.LITTLE) return buffer.readInt16LE()
            else return buffer.readINT16BE()
        }
        else if (this.type == TYPE.INT32) {
            buffer = buffer.slice(pin, pin += 4)
            if (this.edianType == EDIAN.LITTLE) return buffer.readInt32LE()
            else return buffer.readINT32BE()
        }
        // TODO:
        // else if (this.type == TYPE.FLOAT) {
        //     return;
        // }
    }

    ValueToBuffer(value = this.value) {
        if (this.type == TYPE.CHAR) {
            let buffer = Buffer.from(value, 'ascii')
            if (this.edianType == EDIAN.LITTLE) {
                for (let Index = 0, Length = buffer.length / 2; Index < Length; ++Index) {
                    let temp = buffer[Index];
                    buffer[Index] = buffer[Length - Index];
                    buffer[Length - Index] = temp;
                }
            }
            return buffer;
        }
        else if (this.type == TYPE.INT8) {
            let buffer = Buffer.allocUnsafe(1);
            buffer.writeUInt8(value)
            return buffer
        }
        else if (this.type == TYPE.INT16) {
            let buffer = Buffer.allocUnsafe(2);
            if (this.edianType == EDIAN.LITTLE) buffer.writeInt16LE(value)
            else buffer.writeInt16BE(value)
            return buffer
        }
        else if (this.type == TYPE.INT32) {
            let buffer = Buffer.allocUnsafe(4);
            if (this.edianType == EDIAN.LITTLE) buffer.writeInt32LE(value)
            else buffer.writeINT32BE(value)
            return buffer
        }
        // TODO:
        // else if (this.type == TYPE.FLOAT) {
        //     return;
        // }
    }

    get length() {
        if (this.type == TYPE.CHAR) return this.value.length
        else if (this.type == TYPE.INT8) return 1
        else if (this.type == TYPE.INT16) return 2
        else if (this.type == TYPE.INT32) return 4
    }
}

class LittleEdianType extends Type {
    constructor(arg) {
        super(arg);
        this.edianType = EDIAN['LITTLE'];
    }
}

class BigEdianType extends Type {
    constructor(arg) {
        super(arg);
        this.edianType = EDIAN['BIG'];
    }
}

module.exports = {
    "bType": (...params) => new (BigEdianType.bind.apply(BigEdianType, _.concat([null], params))),
    "lType": (...params) => new (LittleEdianType.bind.apply(LittleEdianType, _.concat([null], params)))
}