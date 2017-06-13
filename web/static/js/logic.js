const PI = Math.PI
const pow = Math.pow
const sqrt = Math.sqrt
const sin = Math.sin
const cos = Math.cos

// ensure bar always spans window regardless of angle
function getDiagonalLength() {
    return sqrt(pow(store.getState()["windowWidth"], 2) +
        pow(store.getState()["windowHeight"], 2))
}

function calcBarLifespan(speed, width, startR=getDiagonalLength()/2) {
    // in the case of a single bar, startR==getDiagonalLength()/2
    // separating is useful for gratings
    return (startR + getDiagonalLength()/2 + width ) / speed
}

