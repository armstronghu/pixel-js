module.exports = class Format {
    constructor(binary) {
        this.binary = binary;
        this.header;
        this.pixels;
    }

    static ToBinary() {}

    IsValid() { return this.binary != undefined }

    get Binary() { return this.binary; }
    get Header() { return this.header; }    
    get Pixels() { return this.pixels; }
    get Width() {}
    get Height() {}
}