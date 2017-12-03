'use strict'

const fs = require('fs');

module.exports = (__filePath, binary) => {
    try {
        if (binary.pipe) {
            return binary.pipe(fs.createWriteStream(__filePath));
        } else {
            return fs.writeFileSync(__filePath, binary);
        }
    } catch (e) {
        console.error(e)
    }
}
