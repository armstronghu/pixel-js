module.exports = class Format {
    constructor(binary) {
        this.binary = binary;
    }

    Export() {}

    IsValid() { return this.binary != undefined }

    get Binary() { return this.binary; }
    get Header() { return this.header; }    
    get Pixels() { return this.pixels; }
    get Width() {}
    get Height() {}
}