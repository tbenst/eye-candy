

/***********************************************
ACTIONS
************************************************/
const TIME_TICK = "TIME_TICK"
const STIMULUS_TICK = "STIMULUS_TICK"
const SET_STATUS = "SET_STATUS"
const SET_STIMULUS = "SET_STIMULUS"
const SET_STIMULUS_QUEUE = "SET_STIMULUS_QUEUE"
const ADD_STIMULUS = "ADD_STIMULUS"
const INCREMENT_STIMULUS_INDEX = "INCREMENT_STIMULUS_INDEX"
const SET_GRAPHICS = "SET_GRAPHICS"
const ADD_GRAPHIC = "ADD_GRAPHIC"
const REMOVE_GRAPHIC = "REMOVE_GRAPHIC"
const GRAPHICS_TICK = "GRAPHICS_TICK"
const SET_SIGNAL_LIGHT = "SET_SIGNAL_LIGHT"
const RESET = "RESET"

// Define states for readability
const STATUS = {
    STARTED: "STARTED",
    STOPPED: "STOPPED",
    FINISHED: "FINISHED"
}

const SIGNAL_LIGHT = {
    FRAME_A: "FRAME_A",
    FRAME_B: "FRAME_B",
    STOPPED: "STOPPED"
}

const STIMULUS = {
    BAR: "BAR",
    SOLID: "SOLID",
    WAIT: "WAIT",
    TARGET: "TARGET",
    GRATING: "GRATING",
    CHECKERBOARD: "CHECKERBOARD",
    LETTER: "LETTER",
    UNIFORM_LETTER: "UNIFORM_LETTER",
    EYECHART: "EYECHART"
}

const LETTER = {
     C: "C",
     D: "D",
     H: "H",
     K: "K",
     N: "N",
     O: "O",
     R: "R",
     S: "S",
     V: "V",
     Z: "Z"
}

const GRAPHIC = {
    BAR: "BAR",
    PATTERN: "PATTERN",
    GRATING: "GRATING",
    TARGET: "TARGET",
    LETTER: "LETTER"
}

/***********************************************
EXAMPLE STIMULUS
************************************************/

const exampleBar = {stimulusType: STIMULUS.BAR, lifespan: 300,
        backgroundColor: "black", width: 50, barColor: "white",
        speed: 15, angle: PI, age: 0}
const exampleCheckerboard = {stimulusType: STIMULUS.CHECKERBOARD, lifespan: 300,
        alternateColor: "black", size: 50, color: "white", age: 0}
const exampleSolid = {stimulusType: STIMULUS.SOLID,
            lifespan: 5,
            backgroundColor: "black"
        }
const exampleWait = {stimulusType: STIMULUS.WAIT,
            lifespan: 5,
            backgroundColor: "black"
        }
const exampleGrating = {stimulusType: STIMULUS.GRATING, lifespan: 300,
        backgroundColor: "black", width: 50, barColor: "white",
        speed: 15, angle: PI, wavelength: 500, age: 0, count: 0}

/***********************************************
ACTION CREATORS
************************************************/

function stimulusTickAC(timeDelta) {
    return {type: STIMULUS_TICK, timeDelta: timeDelta}
}

function timetickAC(timeDelta) {
    return { type: TIME_TICK, timeDelta: timeDelta}
}

function addGraphicAC(graphic) {
    return { type: ADD_GRAPHIC, graphic: graphic }
}

function removeGraphicAC(index) {
    return { type: REMOVE_GRAPHIC, index: index }
}

function addStimulusAC(stimulus, index) {
    return { type: ADD_STIMULUS, stimulus: stimulus, index: index }
}

function graphicsTickAC(timeDelta) {
    return  { type: GRAPHICS_TICK, timeDelta: timeDelta}
}

function incrementStimulusIndexAC() {
    return  { type: INCREMENT_STIMULUS_INDEX}
}

function makeAccessorAC(type, ...argNames) {
    return function(...args) {
        let action = { type }
        argNames.forEach((arg, index) => {
            action[argNames[index]] = args[index]
        })
        return action
    }
}

function resetAC() {
    return {type: RESET}
}

const setStatusAC = makeAccessorAC(SET_STATUS, "status")
const setStimulusQueueAC = makeAccessorAC(SET_STIMULUS_QUEUE, "stimulusQueue")
const setStimulusAC = makeAccessorAC(SET_STIMULUS, "stimulus")
const setGraphicsAC = makeAccessorAC(SET_GRAPHICS, "graphics")
const setSignalLightAC = makeAccessorAC(SET_SIGNAL_LIGHT, "signalLight")
