import {storeInitialState} from '/js/store.js'
import { rgbToHex, cos, sin,  } from '/js/logic.js'

export function eyeCandyApp(state, action) {
    switch (action.type) {
        case SET_STATUS:
            return Object.assign({}, state, {
                status: action.status
            })
        case SET_STIMULUS_QUEUE:
            return Object.assign({}, state, {
                stimulusQueue: action.stimulusQueue
            })
        case SET_STIMULUS:
            return Object.assign({}, state, {
                stimulus: action.stimulus
            })
        case INCREMENT_STIMULUS_INDEX:
            let index = state.stimulusIndex + 1
            localStorage.setItem("stimulusIndex", index)
            return Object.assign({}, state, {
                stimulusIndex: index
            })
        case ADD_STIMULUS:
            var newStimulusQueue = state.stimulusQueue.slice()
            newStimulusQueue[action.index] = action.stimulus
            return Object.assign({}, state, {
                stimulusQueue: newStimulusQueue
            })
        case REMOVE_STIMULUS_VALUE:
            var newStimulusQueue = state.stimulusQueue.slice()
            newStimulusQueue[action.index] = "removed"
            return Object.assign({}, state, {
                stimulusQueue: newStimulusQueue
            })
        case SET_GRAPHICS:
            return Object.assign({}, state, {
                graphics: action.graphics
            })
        case ADD_GRAPHIC:
            return Object.assign({}, state, {
                graphics: [...state.graphics, action.graphic]
            })
        case REMOVE_GRAPHIC:
            return Object.assign({}, state, {
                graphics: state.graphics.filter((v,i) => {
                    if (i===action.index) {return false} return true
                })
            })
        case SET_SIGNAL_LIGHT:
            localStorage.setItem('signalLight', action.signalLight)
            return Object.assign({}, state, {
                signalLight: action.signalLight
            })
        case TIME_TICK:
            return Object.assign({}, state, {
                time: state.time + action.timeDelta,
                frameNum: state.frameNum+1
            })
        case GRAPHICS_TICK:
            return Object.assign({}, state, {
                graphics: graphicsReducer(state, action.timeDelta)
            })
        case STIMULUS_TICK:
            return Object.assign({}, state, {
                stimulus: stimulusTickReducer(state.stimulus, action.timeDelta)
            })
        case RESET:
            localStorage.setItem('signalLight', SIGNAL_LIGHT.STOPPED)
            return Object.assign({}, storeInitialState)
        default:
          return state
    }
}

function stimulusTickReducer(stimulus, timeDelta) {
    return Object.assign({}, stimulus, {
        age: stimulus.age + timeDelta
    })
}

function graphicsReducer(state, timeDelta) {
    let graphics = state.graphics
    // if (graphics === undefined) {
        // return graphics
    // } else {
        return graphics.map(graphic => {
            return tickGraphic(state, graphic, timeDelta)
       })/*.filter((x) => {return x}) // TODO add code to expire graphics*/
    // }
}


/***********************************************
GRAPHICS TICK
************************************************/

function tickGraphic(state, graphic, timeDelta) {
    switch (graphic.graphicType) {
        case GRAPHIC.BAR:
            return tickBar(state, graphic, timeDelta)
        case GRAPHIC.GRATING:
            return tickGrating(graphic, timeDelta)
        case GRAPHIC.CHIRP:
            return tickChirp(graphic, timeDelta)
        case GRAPHIC.SINUSOIDAL_GRATING:
            return tickGrating(graphic, timeDelta)
        default:
            return graphic
    }
}

function tickBar(state, bar, timeDelta) {
    let newPosition = undefined
    if (bar.position === undefined) {
        newPosition = {r: bar.startR, theta: -bar.angle}
    } else {
        newPosition = {r: bar.position.r - bar.speed*timeDelta,
            theta: bar.position.theta}
    }

    return Object.assign({}, bar, {
        position: newPosition,
        age: bar.age + timeDelta,
        // compensate for bar width & height, translate from polar & translate from center
        // use length on both to make square
        origin: {x: bar.size.width/2*cos(newPosition.theta) +
                    newPosition.r*cos(newPosition.theta) + state["windowWidth"]/2,
                 y: bar.size.width/2*sin(newPosition.theta) +
                    newPosition.r*sin(newPosition.theta) + state["windowHeight"]/2}
    })
}


function tickGrating(grating, timeDelta) {
    let newPosition = undefined
    if (grating.position === undefined) {
        newPosition = 0
    } else {
        newPosition = (grating.position + grating.speed*timeDelta) % (2*grating.width)
    }

    return Object.assign({}, grating, {
        position: newPosition,
        age: grating.age + timeDelta,
    })
}

function tickChirp(chirp, timeDelta) {
    // python code:
    // t = asarray(t)
    // if method in ['linear', 'lin', 'li']:
    //     beta = (f1 - f0) / t1
    //     phase = 2 * pi * (f0 * t + 0.5 * beta * t * t)
    const t = chirp.age + timeDelta
    const beta = (chirp.f1 - chirp.f0) / chirp.t1
    const phase = 2 * Math.PI * (chirp.f0 * t + 0.5 * beta * t * t)
    const scale = Math.cos(chirp.phi + phase)
    const timeFraction = Math.min(1, t/chirp.t1)
    const amplitude = chirp.a0 * (1 - timeFraction) + chirp.a1 * timeFraction
    const colorVal = Math.round(amplitude * scale + 127.5)
    const newColor = {r: colorVal, g: colorVal, b: colorVal}

    return Object.assign({}, chirp, {
        color: rgbToHex(newColor),
        age: t,
        debug: {t: t, beta: beta, phase: phase, scale: scale, timeFraction: timeFraction, amplitude: amplitude, colorVal: colorVal}
    })
}
