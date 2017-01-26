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
    constructor(lifespan, backgroundColor, analysis) {
        this.lifespan = lifespan
        this.backgroundColor = backgroundColor
        this.analysis = analysis
        this.age = 0
  }
}

class Bar extends Stimulus {
    constructor(lifespan, backgroundColor, speed, width, angle, barColor, analysis) {
        super(lifespan, backgroundColor, analysis)
        this.stimulusType = STIMULUS.BAR
        this.speed = speed
        this.width = width
        this.angle = angle
        this.barColor = barColor
    }
}
exports.Bar = Bar

class Grating extends Bar {
    constructor(lifespan, backgroundColor, wavelength, numberOfBars, analysis) {
        super(lifespan, backgroundColor, analysis)
        this.stimulusType = STIMULUS.GRATING
        this.wavelength = wavelength
        this.numberOfBars = numberOfBars
        this.count = 0
    }
}
exports.Grating = Grating

class Solid extends Stimulus {
    constructor(lifespan, backgroundColor = "white", analysis) {
        super(lifespan, backgroundColor, analysis)
        this.stimulusType = STIMULUS.SOLID
    }
}
exports.Solid = Solid

class Wait extends Stimulus {
    constructor(lifespan, analysis) {
        super(lifespan, "black", analysis)
        this.stimulusType = STIMULUS.WAIT
    }
}
exports.Wait = Wait

class Checkerboard extends Stimulus {
    constructor(lifespan, color, alternateColor, size, period, analysis) {
    	// not positive alternateColor is correct here, test with slow period
        super(lifespan, alternateColor, analysis)
        this.stimulusType = STIMULUS.CHECKERBOARD
        this.color = color
        this.alternateColor = alternateColor
        this.size = size
        this.period = period
        this.count = 0
    }
}
exports.Checkerboard = Checkerboard
