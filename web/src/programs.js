const PI = Math.PI
const pow = Math.pow
const sqrt = Math.sqrt
const sin = Math.sin
const cos = Math.cos

// import {store} from './store'

const STIMULUS = {
    BAR: 'BAR',
    SOLID: 'SOLID',
    WAIT: 'WAIT',
    TARGET: 'TARGET',
    GRATING: 'GRATING',
    CHECKERBOARD: "CHECKERBOARD"
}

const GRAPHIC = {
    BAR: 'BAR',
    TARGET: 'TARGET',
    CHECKER: "CHECKER"
}

function getDiagonalLength(height, width) {
    return sqrt(pow(height, 2) + pow(width, 2));
}
exports.getDiagonalLength = getDiagonalLength

function calcLifespan(time,frames) {
    return frames ? frames : 120 * time
}

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


// function* targetGen() {
//     yield {stimulusType: STIMULUS.TARGET, lifespan: 6000,
//         backgroundColor: 'black'}
// }

// export function* easyGen() {
//     yield {stimulusType: STIMULUS.BAR, lifespan: 300,
//         backgroundColor: 'black', width: 50, barColor: 'white',
//         speed: 15, angle: PI}
//     yield {stimulusType: STIMULUS.BAR, lifespan: 300,
//         backgroundColor: 'black', width: 50, barColor: 'white',
//         speed: 15, angle: PI/2}
//     yield {stimulusType: STIMULUS.BAR, lifespan: 300,
//         backgroundColor: 'black', width: 50, barColor: 'white',
//         speed: 15, angle: 0}
//     yield {stimulusType: STIMULUS.BAR, lifespan: 300,
//         backgroundColor: 'black', width: 50, barColor: 'white',
//         speed: 10, angle: PI}
// }


// // angles and widths must have same length
// // geThe willrator now calculates lifespan automatically
// // if you want to modify the function (e.g. change the wait times),
// // please copy and create a new function to avoid confusion in
// // analysis
// // 
// // speed is pixels / second, width is pixels, angle is radians,
// // lifespan is 1/120 of a second, so 120==1 second 
// export function* orientationSelectivityGen(
//     speeds, widths, numRepeat,
//     barColor='white', backgroundColor='black',
//     angles=[0, PI/4, PI/2, 3*PI/4, PI, 5*PI/4, 3*PI/2, 7*PI/4], session) {

//     // initial wait time
//     yield {stimulusType: STIMULUS.WAIT, lifespan: 120 * 15}

//     for (var t = 0; t < numRepeat; t++) {
//         for (var i = 0; i < speeds.length; i++) {
//             for (var j = 0; j < widths.length; j++) {
//                 // wait 10 seconds before each group of eight angles
//                 yield {stimulusType: STIMULUS.WAIT, lifespan: 120 * 5}

//                 for (var k = 0; k < angles.length; k++) {
//                     yield {stimulusType: STIMULUS.BAR,
//                         lifespan: (getDiagonalLength(session.windowHeight, session.windowWidth)
//                             + widths[j])/speeds[i]*120,
//                         backgroundColor: backgroundColor,
//                         width: widths[j],
//                         barColor: barColor,
//                         speed: speeds[i],
//                         angle: angles[k]}
//                     // Wait between bars
//                     yield {stimulusType: STIMULUS.WAIT, lifespan: 120 * 1}
//                 }
//             }
//         }
//     }
// }

// SC for Stimulus Creator
function barSC(lifespan, backgroundColor, barColor, speed, width, angle) {
    const ret = {stimulusType: STIMULUS.BAR,
            lifespan: lifespan,
            backgroundColor: backgroundColor,
            width: width,
            barColor: barColor,
            speed: speed,
            angle: angle,
            age: 0
        }
    // console.log('barSC', ret)
    return ret
}
exports.barSC = barSC

function gratingSC(lifespan, backgroundColor, barColor, speed,
    width, angle, wavelength, numberOfBars) {
    const ret = {stimulusType: STIMULUS.GRATING,
            lifespan: lifespan,
            backgroundColor: backgroundColor,
            width: width,
            barColor: barColor,
            speed: speed,
            angle: angle,
            wavelength: wavelength,
            numberOfBars: numberOfBars,
            age: 0,
            count: 0
        }
    // console.log('gratingSC', ret)
    return ret
}
exports.gratingSC = gratingSC

// should only provide time or frames
function solidSC(lifespan, backgroundColor='white') {
    return {stimulusType: STIMULUS.SOLID,
            lifespan: lifespan,
            backgroundColor: backgroundColor,
            age: 0
        }
}
exports.solidSC = solidSC

function waitSC(lifespan) {
    return {stimulusType: STIMULUS.WAIT,
            lifespan: lifespan,
            backgroundColor: 'black',
            age: 0
        }
}
exports.waitSC = waitSC

function checkerboardSC(lifespan,size,period,color,alternateColor) {
    return {stimulusType: STIMULUS.CHECKERBOARD,
            lifespan: lifespan,
            color: color,
            alternateColor: alternateColor,
            backgroundColor: alternateColor,
            size: size,
            period: period,
            age: 0,
            count: 0
    }
}
exports.checkerboardSC = checkerboardSC

function stimulusCreator(stimulusJSON, windowHeight, windowWidth) {
    // console.log('stimulusCreator', stimulusJSON)
    const stimType = Object.keys(stimulusJSON)[0]
    const unprocessed_stimulus = jsonValueToNum(stimulusJSON[stimType])
    const speed = unprocessed_stimulus.speed
    const width = unprocessed_stimulus.width
    const time = unprocessed_stimulus.time
    const frames = unprocessed_stimulus.frames
    var lifespan
    if (time>0 || frames>0) {
        lifespan = calcLifespan(time,frames)
    }
    var stimulus
    switch (stimType.toUpperCase()) {
        case STIMULUS.BAR:
            stimulus = barSC(calcBarLifespan(speed, width, windowHeight, windowWidth),
                unprocessed_stimulus.backgroundColor, unprocessed_stimulus.barColor,
                speed, width, unprocessed_stimulus.angle)
            break
        case STIMULUS.SOLID:
            stimulus = solidSC(lifespan,
                          unprocessed_stimulus.backgroundColor)
            break
        case STIMULUS.WAIT:
            stimulus = waitSC(lifespan)
            break
        case STIMULUS.TARGET:
            stimulus = {stimulusType: STIMULUS.TARGET, lifespan: lifespan,
                backgroundColor: 'black'}
            break
        case STIMULUS.GRATING:
            stimulus = gratingSC(calcGratingLifespan(speed, width, windowHeight, windowWidth, unprocessed_stimulus.wavelength,
                unprocessed_stimulus.numberOfBars, unprocessed_stimulus.time),
                unprocessed_stimulus.backgroundColor, unprocessed_stimulus.barColor,
                speed, width, unprocessed_stimulus.angle, unprocessed_stimulus.wavelength,
                unprocessed_stimulus.numberOfBars)
            break
        case STIMULUS.CHECKERBOARD:
            stimulus = checkerboardSC(lifespan,unprocessed_stimulus.size,unprocessed_stimulus.period,
                unprocessed_stimulus.color,unprocessed_stimulus.alternateColor)
            break
    }
    return stimulus
}

exports.stimulusCreator = stimulusCreator

function jsonValueToNum(myJSON) {
    // console.log('jsonValueToNum', myJSON)
    const keys = Object.keys(myJSON)
    let retJSON = Object.assign({}, myJSON)
    for (var i = 0; i < keys.length; i++) {
        if (['angle', 'speed', 'width', 'time', 'wavelength', "frames"].includes(keys[i])) {
            retJSON[keys[i]] = valueToNum(retJSON[keys[i]])
        }
    }
    return retJSON
}

function valueToNum(myString) {
    const pattern = /^([\d\*\+\-\/]|PI|pow|sqrt|sin|cos)+$/
    if (pattern.exec(myString)) {
        return eval(myString)
    }
}