const STIMULUS = {
    BAR: 'BAR',
    SOLID: 'SOLID',
    WAIT: 'WAIT',
    TARGET: 'TARGET',
    GRATING: 'GRATING',
    CHECKERBOARD: "CHECKERBOARD",
    LETTER: "LETTER",
    EYECHART: "EYECHART"
}

const GRAPHIC = {
    BAR: 'BAR',
    TARGET: 'TARGET',
    CHECKER: "CHECKER",
    LETTER: "LETTER"
}

class Stimulus {
    // parameters are used for program execution
    // metadata is used for stimulus generation & analysis
    constructor(lifespan, backgroundColor, metadata) {
        this.lifespan = lifespan
        this.backgroundColor = backgroundColor
        this.metadata = metadata
        this.age = 0
  }
}

class Bar extends Stimulus {
    constructor(lifespan, backgroundColor, speed, width, angle, barColor, metadata) {
        super(lifespan, backgroundColor, metadata)
        this.stimulusType = STIMULUS.BAR
        this.speed = speed
        this.width = width
        this.angle = angle
        this.barColor = barColor
    }
}
exports.Bar = Bar

class Letter extends Stimulus {
    constructor(lifespan, backgroundColor, letter, x, y, size, color, metadata) {
        super(lifespan, backgroundColor, metadata)
        this.stimulusType = STIMULUS.LETTER
        this.letter = letter
        this.x = x
        this.y = y
        this.size = size
        this.color = color
    }
}
exports.Letter = Letter

class EyeChart extends Stimulus {
    constructor(lifespan, backgroundColor, letterMatrix, size, padding, color, metadata) {
        super(lifespan, backgroundColor, metadata)
        this.stimulusType = STIMULUS.EYECHART
        this.letterMatrix = letterMatrix
        this.size = size
        this.padding = padding
        this.color = color
    }
}
exports.EyeChart = EyeChart

class Grating extends Bar {
    constructor(lifespan, backgroundColor, wavelength, numberOfBars, metadata) {
        super(lifespan, backgroundColor, metadata)
        this.stimulusType = STIMULUS.GRATING
        this.wavelength = wavelength
        this.numberOfBars = numberOfBars
        this.count = 0
    }
}
exports.Grating = Grating

class Solid extends Stimulus {
    constructor(lifespan, backgroundColor = "white", metadata) {
        super(lifespan, backgroundColor, metadata)
        this.stimulusType = STIMULUS.SOLID
    }
}
exports.Solid = Solid

class Wait extends Stimulus {
    constructor(lifespan, metadata) {
        super(lifespan, "black", metadata)
        this.stimulusType = STIMULUS.WAIT
    }
}
exports.Wait = Wait

class Checkerboard extends Stimulus {
    constructor(lifespan, color, alternateColor, size, period, metadata) {
    	// not positive alternateColor is correct here, test with slow period
        super(lifespan, alternateColor, metadata)
        this.stimulusType = STIMULUS.CHECKERBOARD
        this.color = color
        this.alternateColor = alternateColor
        this.size = size
        this.period = period
        this.count = 0
    }
}
exports.Checkerboard = Checkerboard
