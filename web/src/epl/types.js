// warning: must edit actions.js too
const STIMULUS = {
    BAR: 'BAR',
    SOLID: 'SOLID',
    WAIT: 'WAIT',
    TARGET: 'TARGET',
    GRATING: 'GRATING',
    SINUSOIDAL_GRATING: 'SINUSOIDAL_GRATING',
    CHECKERBOARD: "CHECKERBOARD",
    LETTER: "LETTER",
    TILED_LETTER: "TILED_LETTER",
    EYECHART: "EYECHART",
    IMAGE: "IMAGE",
    VIDEO: "VIDEO"
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

class Grating extends Stimulus {
    constructor(lifespan, backgroundColor, speed, width, angle, barColor, metadata) {
        super(lifespan, backgroundColor, metadata)
        this.stimulusType = STIMULUS.GRATING
        this.speed = speed
        this.width = width
        this.angle = angle
        this.barColor = barColor
    }
}
exports.Grating = Grating

class SinusoidalGrating extends Stimulus {
    constructor(lifespan, backgroundColor, speed, width, angle, barColor, metadata) {
        super(lifespan, backgroundColor, metadata)
        this.stimulusType = STIMULUS.SINUSOIDAL_GRATING
        this.speed = speed
        this.width = width
        this.angle = angle
        this.barColor = barColor
    }
}
exports.SinusoidalGrating = SinusoidalGrating

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

class LetterSaccade extends Stimulus {
    constructor(lifespan, backgroundColor, letter, x, y, size, color, saccadeSize, metadata) {
        // saccadeSize is a square of diameter 2*saccadeSize
        super(lifespan, backgroundColor, metadata)
        this.stimulusType = STIMULUS.LETTER
        this.letter = letter
        this.x = x
        this.y = y
        this.size = size
        this.color = color
        this.saccadeSize = saccadeSize
    }
}
exports.Letter = Letter

class TiledLetter extends Stimulus {
    constructor(lifespan, backgroundColor, letter, size, padding, color, angle, metadata) {
        super(lifespan, backgroundColor, metadata)
        this.stimulusType = STIMULUS.TILED_LETTER
        this.letter = letter
        this.size = size
        this.padding = padding
        this.color = color
        this.angle = angle
    }
}
exports.TiledLetter = TiledLetter

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

class Image extends Stimulus {
    constructor(lifespan, backgroundColor, image,
                fixationPoint, metadata) {
        super(lifespan, backgroundColor, metadata)
        this.stimulusType = STIMULUS.IMAGE
        this.image = image
        this.fixationPoint = fixationPoint
    }
}
exports.Image = Image

class Video extends Stimulus {
    constructor(lifespan, backgroundColor, src, startTime, metadata) {
        super(lifespan, backgroundColor, metadata)
        this.stimulusType = STIMULUS.VIDEO
        this.startTime = startTime
        this.src = src
    }
}
exports.Video = Video

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
    constructor(lifespan, color, alternateColor, size, angle, metadata) {
        super(lifespan, alternateColor, metadata)
        this.stimulusType = STIMULUS.CHECKERBOARD
        this.color = color
        this.alternateColor = alternateColor
        this.size = size
        this.angle = angle
        // TODO try deleting--unecessary?
        this.count = 0
    }
}
exports.Checkerboard = Checkerboard
