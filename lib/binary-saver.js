'use strict'

const fs = require('fs');

module.exports = (__filePath, binary) => {
    try {
        return fs.writeFileSync(__filePath, binary);
    } catch(e) {
        console.error(e)
    }
}
