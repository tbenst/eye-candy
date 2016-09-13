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

export function calcGratingLifespan(speed, width, windowHeight, windowWidth, wavelength, numberOfBars, time) {
    // console.log('calcLifespan', session)
    let lifespan
    if (numberOfBars===undefined) {
        lifespan = time*120
    } else {
        lifespan = (getDiagonalLength(windowHeight, windowWidth)
                        + width + (numberOfBars-1) * wavelength)/speed*120
    }
    return lifespan
}

export function calcBarLifespan(speed, width, windowHeight, windowWidth) {
    const lifespan = (getDiagonalLength(windowHeight, windowWidth)
                    + width)/speed*120
    return lifespan
}



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

function solidSC(time, backgroundColor='white') {
    return {stimulusType: STIMULUS.SOLID,
            lifespan: 120 * time,
            backgroundColor: backgroundColor,
            age: 0
        }
}

function waitSC(time) {
    return {stimulusType: STIMULUS.WAIT,
            lifespan: 120 * time,
            backgroundColor: 'black',
            age: 0
        }
}

function checkerboardSC(time,size,period,color,alternateColor) {
    return {stimulusType: STIMULUS.CHECKERBOARD,
            lifespan: 120 * time,
            color: color,
            alternateColor: alternateColor,
            backgroundColor: alternateColor,
            size: size,
            period: period,
            age: 0,
            count: 0
    }
}

export function stimulusCreator(stimulusJSON, windowHeight, windowWidth) {
    // console.log('stimulusCreator', stimulusJSON)
    const stimType = Object.keys(stimulusJSON)[0]
    const stimulus = jsonValueToNum(stimulusJSON[stimType])
    const speed = stimulus.speed
    const width = stimulus.width
    switch (stimType.toUpperCase()) {
        case STIMULUS.BAR:
            return barSC(calcBarLifespan(speed, width, windowHeight, windowWidth),
                stimulus.backgroundColor, stimulus.barColor,
                speed, width, stimulus.angle)
        case STIMULUS.SOLID:
            return solidSC(stimulus.time,
                          stimulus.backgroundColor)
        case STIMULUS.WAIT:
            return waitSC(stimulus.time)
        case STIMULUS.TARGET:
            return {stimulusType: STIMULUS.TARGET, lifespan: 120 * stimulus.time,
                backgroundColor: 'black'}
        case STIMULUS.GRATING:
            return gratingSC(calcGratingLifespan(speed, width, windowHeight, windowWidth, stimulus.wavelength, stimulus.numberOfBars, stimulus.time),
                stimulus.backgroundColor, stimulus.barColor,
                speed, width, stimulus.angle, stimulus.wavelength,
                stimulus.numberOfBars)
        case STIMULUS.CHECKERBOARD:
            return checkerboardSC(stimulus.time,stimulus.size,stimulus.period,
                stimulus.color,stimulus.alternateColor)
    }
}

function jsonValueToNum(myJSON) {
    // console.log('jsonValueToNum', myJSON)
    const keys = Object.keys(myJSON)
    let retJSON = Object.assign({}, myJSON)
    for (var i = 0; i < keys.length; i++) {
        if (['angle', 'speed', 'width', 'time', 'wavelength'].includes(keys[i])) {
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