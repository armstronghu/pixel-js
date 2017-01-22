'use strict'

const _ = require('lodash')
const Enum = require('./enum')

const SURPORTTED_TYPE = ['INT', 'CHAR', 'FLOAT']
const TYPE = Enum(SURPORTTED_TYPE)
const EDIAN = Enum(['LITTLE', 'BIG'])

module.exports = (...params) => {
    class Type {
        constructor(byteLength, type = 'INT', edian = 'LITTLE') {
            if (_.includes(SURPORTTED_TYPE, type) == false) throw Error('unSupported Type')

            this.byteLength = byteLength;
            this.type = TYPE[type]
            this.edianType = EDIAN[edian]
        }

        $Get(type) {
            return TYPE[type]
        }

        BufferToValue(buffer) {
            const bufferLength = buffer.length

            if (this.type == TYPE.CHAR) {
                const str = []
                for (let Index = 0, Length = bufferLength; Index < Length; ++Index) {
                    const char = buffer.toString('ascii', Index, Index + 1)
                    if (this.edianType == EDIAN.LITTLE) str.unshift(char)
                    else str.push(char)
                }
                return str.join("")
            }
            else if (this.type == TYPE.INT) {
                return {
                    '1': (edianType) => {
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
                }[bufferLength](this.edianType)
            }
            else if (this.type == TYPE.FLOAT) {
                return; // TODO:
            }
        }
    }

    return new (Type.bind.apply(Type, _.concat([null], params)))
}