'use strict'

const fs = require('fs');

module.exports = (__filePath) => {
    try {
        return fs.readFileSync(__filePath);
    } catch(e) {
        console.error(e)
    }
}
