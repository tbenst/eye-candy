const PI = Math.PI
const pow = Math.pow
const sqrt = Math.sqrt
const sin = Math.sin
const cos = Math.cos

function getDiagonalLength(height, width) {
    return sqrt(pow(height, 2) + pow(width, 2));
}
exports.getDiagonalLength = getDiagonalLength

function calcBarLifespan(speed, width, windowHeight, windowWidth) {
    const lifespan = (getDiagonalLength(windowHeight, windowWidth)
                    + width)/speed
    // console.log("calcBarLifespan",speed,width,windowHeight,windowWidth,lifespan)
    return lifespan
}

exports.calcBarLifespan = calcBarLifespan
