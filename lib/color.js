module.exports = class Color {
    constructor(r = 255, g = 255, b = 255, a = 255) {
        this.R = r
        this.G = g
        this.B = b
        this.A = a
    }

    GetFloat() {
        const Pivot = 1 / 255;
        return {
            R: this.R * Pivot,
            G: this.G * Pivot,
            B: this.B * Pivot,
            A: this.A * Pivot,
        }
    }

    get r() { return this.R; }
    get g() { return this.G; }
    get b() { return this.B; }
    get a() { return this.A; }

    set r(R) { this.R = R; }
    set g(G) { this.G = G; }
    set b(B) { this.B = B; }
    set a(A) { this.A = A; }
    set rgb(RGB) {
        this.r = RGB[0]
        this.g = RGB[1]
        this.b = RGB[2]
    }
}

// function Convert(C) { return (C > 0 && C < 1) ? parseInt(C * 255) : C; }