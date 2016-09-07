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
    GRATING: 'GRATING'
}

const GRAPHIC = {
    BAR: 'BAR',
    TARGET: 'TARGET'
}

function getDiagonalLength(height, width) {
    return sqrt(pow(height, 2) + pow(width, 2));
}

export function calcLifespan(speed, width, windowHeight, windowWidth, wavelength=0, numberOfBars=0) {
    // console.log('calcLifespan', session)
    return (getDiagonalLength(windowHeight, windowWidth)
                        + width + (numberOfBars-1) * wavelength)/speed*120
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

export function stimulusCreator(stimulusJSON, windowHeight, windowWidth) {
    // console.log('stimulusCreator', stimulusJSON)
    const stimType = Object.keys(stimulusJSON)[0]
    const stimulus = jsonValueToNum(stimulusJSON[stimType])
    const speed = stimulus.speed
    const width = stimulus.width
    switch (stimType.toUpperCase()) {
        case STIMULUS.BAR:
            return barSC(calcLifespan(speed, width, windowHeight, windowWidth),
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
            return gratingSC(calcLifespan(speed, width, windowHeight, windowWidth, stimulus.wavelength, stimulus.numberOfBars),
                stimulus.backgroundColor, stimulus.barColor,
                speed, width, stimulus.angle, stimulus.wavelength,
                stimulus.numberOfBars)
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