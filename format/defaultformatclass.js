module.exports = class Format {
    constructor(binary, header, pixels) {
        this.binary = binary;

        this.heaer = header;
        this.pixels = pixels;
    }

    Export() {}

    IsValid() { return this.binary != undefined }

    get Binary() { return this.binary; }
    get Header() { return this.header; }    
    get Pixels() { return this.pixels; }
    get Width() {}
    get Height() {}
}