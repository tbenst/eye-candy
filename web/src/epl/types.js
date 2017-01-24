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
    // parameters are used for program execution
    // analysis is metadata used after the fact
    constructor({lifespan, backgroundColor}, analysis) {
        this.lifespan = lifespan
        this.backgroundColor = backgroundColor
        this.analysis = analysis
        this.age = 0
  }
}

class Bar extends Stimulus {
    constructor({speed, width, angle, barColor, ...parameters}, analysis) {
        super(parameters, analysis)
        this.stimulusType = STIMULUS.BAR
        this.speed = speed
        this.width = width
        this.angle = angle
        this.barColor = barColor
    }
}
exports.Bar = Bar

class Grating extends Bar {
    constructor({wavelength, numberOfBars, ...parameters}, analysis) {
        super(parameters, analysis)
        this.stimulusType = STIMULUS.GRATING
        this.wavelength = wavelength
        this.numberOfBars = numberOfBars
        this.count = 0
    }
}
exports.Grating = Grating

class Solid extends Stimulus {
    constructor({backgroundColor = "white"} = {}, analysis) {
        super(parameters, analysis)
        this.stimulusType = STIMULUS.SOLID
    }
}
exports.Solid = Solid

class Wait extends Stimulus {
    constructor(parameters, analysis) {
        super(parameters, analysis)
        this.stimulusType = STIMULUS.WAIT
        this.backgroundColor = "black"
    }
}
exports.Wait = Wait

class Checkerboard extends Stimulus {
    constructor({color, alternateColor, size, period, ...parameters}, analysis) {
        super(parameters, analysis)
        this.stimulusType = STIMULUS.CHECKERBOARD
        this.color = color
        this.alternateColor = alternateColor
        this.backgroundColor = backgroundColor
        this.size = size
        this.period = period
        this.count = 0
    }
}
exports.Checkerboard = Checkerboard
