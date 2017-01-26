const PI = Math.PI
const pow = Math.pow
const sqrt = Math.sqrt
const sin = Math.sin
const cos = Math.cos

function getDiagonalLength(height, width) {
    return sqrt(pow(height, 2) + pow(width, 2));
}
exports.getDiagonalLength = getDiagonalLength

function calcLifespan(time,frames) {
    return frames ? frames : 120 * time
}
exports.calcLifespan = calcLifespan

function calcGratingLifespan(speed, width, windowHeight, windowWidth, wavelength, numberOfBars, time, frames) {
    // console.log('calcLifespan', session)
    let lifespan
    if (numberOfBars>0) {
        lifespan = Math.ceil((getDiagonalLength(windowHeight, windowWidth)
                        + width + (numberOfBars-1) * wavelength)/speed*120)
    } else {
        lifespan = calcLifespan(time,frames)
    }
    return lifespan
}

exports.calcGratingLifespan = calcGratingLifespan

function calcBarLifespan(speed, width, windowHeight, windowWidth) {
    const lifespan = Math.ceil((getDiagonalLength(windowHeight, windowWidth)
                    + width)/speed*120)
    // console.log("calcBarLifespan",speed,width,windowHeight,windowWidth,lifespan)
    return lifespan
}

exports.calcBarLifespan = calcBarLifespan
