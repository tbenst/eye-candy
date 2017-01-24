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

class Stimulus {
  constructor(parameters) {
    this.lifespan = parameters.lifespan;
    this.backgroundColor = parameters.backgroundColor;
  }
}

class Bar extends Stimulus {
  constructor(parameters) {
    // Here, it calls the parent class' constructor with lengths
    // provided for the Polygon's width and height
    super(parameters);
    // Note: In derived classes, super() must be called before you
    // can use 'this'. Leaving this out will cause a reference error.
    this.speed = parameters.speed
    this.speed = parameters.speed
    this.speed = parameters.speed
    this.speed = parameters.speed
  }
}

var a = new Bar({"lifespan": 10, "backgroundColor": "white", "speed": 5})

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
