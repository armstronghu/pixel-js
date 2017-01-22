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

    get r() { return r; }
    get g() { return g; }
    get b() { return b; }
    get a() { return a; }
    set r(R) { this.R = Convert(R); }
    set g(G) { this.G = Convert(G); }
    set b(B) { this.B = Convert(B); }
    set a(A) { this.A = Convert(A); }
}

function Convert(C) { return (C > 0 && C < 1) ? parseInt(C * 255) : C; }