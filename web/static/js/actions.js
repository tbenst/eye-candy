

/***********************************************
ACTIONS
************************************************/
export const TIME_TICK = "TIME_TICK"
export const STIMULUS_TICK = "STIMULUS_TICK"
export const SET_STATUS = "SET_STATUS"
export const SET_STIMULUS = "SET_STIMULUS"
export const SET_STIMULUS_QUEUE = "SET_STIMULUS_QUEUE"
export const ADD_STIMULUS = "ADD_STIMULUS"
export const REMOVE_STIMULUS_VALUE = "REMOVE_STIMULUS_VALUE"
export const INCREMENT_STIMULUS_INDEX = "INCREMENT_STIMULUS_INDEX"
export const SET_GRAPHICS = "SET_GRAPHICS"
export const ADD_GRAPHIC = "ADD_GRAPHIC"
export const REMOVE_GRAPHIC = "REMOVE_GRAPHIC"
export const GRAPHICS_TICK = "GRAPHICS_TICK"
export const SET_SIGNAL_LIGHT = "SET_SIGNAL_LIGHT"
export const RESET = "RESET"

// Define states for readability
export const STATUS = {
    STARTED: "STARTED",
    STOPPED: "STOPPED",
    FINISHED: "FINISHED",
    DEBUG: "DEBUG",
    // TODO: change name of VIDEO to something like STARTED_SAVEVID
    VIDEO: "VIDEO"
}

export const SIGNAL_LIGHT = {
    FRAME_A: "FRAME_A",
    FRAME_B: "FRAME_B",
    STOPPED: "STOPPED"
}

// warning: must edit epl types, too
export const STIMULUS = {
    BAR: "BAR",
    SOLID: "SOLID",
    CHIRP: "CHIRP",
    WAIT: "WAIT",
    TARGET: "TARGET",
    GRATING: "GRATING",
    SINUSOIDAL_GRATING: "SINUSOIDAL_GRATING",
    CHECKERBOARD: "CHECKERBOARD",
    LETTER: "LETTER",
    TILED_LETTER: "TILED_LETTER",
    IMAGE: "IMAGE",
    VIDEO: "VIDEO",
    EYECHART: "EYECHART"
}

export const LETTER = {
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

export const GRAPHIC = {
    BAR: "BAR",
    CHIRP: "CHIRP",
    PATTERN: "PATTERN",
    GRATING: "GRATING",
    TARGET: "TARGET",
    LETTER: "LETTER",
    IMAGE: "IMAGE",
    VIDEO: "VIDEO"
}

/***********************************************
EXAMPLE STIMULUS
************************************************/

export const exampleBar = {stimulusType: STIMULUS.BAR, lifespan: 300,
        backgroundColor: "black", width: 50, barColor: "white",
        speed: 15, angle: Math.PI, age: 0}
export const exampleCheckerboard = {stimulusType: STIMULUS.CHECKERBOARD, lifespan: 300,
        alternateColor: "black", size: 50, color: "white", age: 0}
export const exampleSolid = {stimulusType: STIMULUS.SOLID,
            lifespan: 5,
            backgroundColor: "black"
        }
export const exampleWait = {stimulusType: STIMULUS.WAIT,
            lifespan: 5,
            backgroundColor: "black"
        }
export const exampleGrating = {stimulusType: STIMULUS.GRATING, lifespan: 300,
        backgroundColor: "black", width: 50, barColor: "white",
        speed: 15, angle: Math.PI, wavelength: 500, age: 0, count: 0}

/***********************************************
ACTION CREATORS
************************************************/

export function stimulusTickAC(timeDelta) {
    return {type: STIMULUS_TICK, timeDelta: timeDelta}
}

export function timetickAC(timeDelta) {
    return { type: TIME_TICK, timeDelta: timeDelta}
}

export function addGraphicAC(graphic) {
    return { type: ADD_GRAPHIC, graphic: graphic }
}

export function removeGraphicAC(index) {
    return { type: REMOVE_GRAPHIC, index: index }
}

export function addStimulusAC(stimulus, index) {
    return { type: ADD_STIMULUS, stimulus: stimulus, index: index }
}

export function removeStimulusValueAC(index) {
    return { type: REMOVE_STIMULUS_VALUE, index: index }
}

export function graphicsTickAC(timeDelta) {
    return  { type: GRAPHICS_TICK, timeDelta: timeDelta}
}

export function incrementStimulusIndexAC() {
    return  { type: INCREMENT_STIMULUS_INDEX}
}

export function makeAccessorAC(type, ...argNames) {
    return function(...args) {
        let action = { type }
        argNames.forEach((arg, index) => {
            action[argNames[index]] = args[index]
        })
        return action
    }
}

export function resetAC() {
    return {type: RESET}
}

export const setStatusAC = makeAccessorAC(SET_STATUS, "status")
export const setStimulusQueueAC = makeAccessorAC(SET_STIMULUS_QUEUE, "stimulusQueue")
export const setStimulusAC = makeAccessorAC(SET_STIMULUS, "stimulus")
export const setGraphicsAC = makeAccessorAC(SET_GRAPHICS, "graphics")
export const setSignalLightAC = makeAccessorAC(SET_SIGNAL_LIGHT, "signalLight")
