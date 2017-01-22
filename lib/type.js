'use strict'

const _ = require('lodash')
const Enum = require('./enum')

const SURPORTTED_TYPE = ['INT', 'CHAR', 'FLOAT']
const TYPE = Enum(SURPORTTED_TYPE)
const EDIAN = Enum(['LITTLE', 'BIG'])

module.exports = (...params) => {
    class Type {
        constructor(byteLength, defaultValue = 0, type = 'INT', edian = 'LITTLE') {
            if (_.includes(SURPORTTED_TYPE, type) == false) throw Error('unSupported Type')

            this.byteLength = byteLength;
            this.value = defaultValue;
            this.type = TYPE[type]
            this.edianType = EDIAN[edian]
        }

        $Get(type) {
            return TYPE[type]
        }

        SetValue(value) {
            this.value = value
        }

        BufferToValue(buffer) {
            const byteLength = this.byteLength
            const bufferLength = buffer.length
            if (byteLength < bufferLength) buffer = buffer.slice(0, byteLength)
            else if (byteLength > bufferLength) throw Error(`byteLength > bufferLength`)

            if (this.type == TYPE.CHAR) {
                const str = []
                for (let Index = 0, Length = byteLength; Index < Length; ++Index) {
                    const char = buffer.toString('ascii', Index, Index + 1)
                    if (this.edianType == EDIAN.LITTLE) str.unshift(char)
                    else str.push(char)
                }
                return str.join("")
            }
            else if (this.type == TYPE.INT) {
                return {
                    '1': () => {
                        return buffer.readUInt8()
                    },
                    '2': (edianType) => {
                        if (edianType == EDIAN.LITTLE) return buffer.readInt16LE()
                        else return buffer.readINT16BE()
                    },
                    '4': (edianType) => {
                        if (edianType == EDIAN.LITTLE) return buffer.readInt32LE()
                        else return buffer.readINT32BE()
                    },
                }[byteLength](this.edianType)
            }
            else if (this.type == TYPE.FLOAT) {
                return; // TODO:
            }
        }

        ValueToBuffer(value = this.value) {
            
            const byteLength = this.byteLength

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
            else if (this.type == TYPE.INT) {
                let buffer = Buffer.allocUnsafe(byteLength);
                
                return {
                    '1': () => {
                        buffer.writeUInt8(value)
                        return buffer
                    },
                    '2': (edianType) => {
                        if (edianType == EDIAN.LITTLE) buffer.writeInt16LE(value)
                        else buffer.writeInt16BE(value)
                        return buffer
                    },
                    '4': (edianType) => {
                        if (edianType == EDIAN.LITTLE) buffer.writeInt32LE(value)
                        else buffer.writeINT32BE(value)
                        return buffer
                    },
                }[byteLength](this.edianType)
            }
            else if (this.type == TYPE.FLOAT) {
                return; // TODO:
            }
        }
    }

    return new (Type.bind.apply(Type, _.concat([null], params)))
}