
const PI = Math.PI
const pow = Math.pow
const sqrt = Math.sqrt
const sin = Math.sin
const cos = Math.cos

/************************************************
REDUX (GLOBAL STATE)
************************************************/

const createStore = Redux.createStore
const applyMiddleware = Redux.applyMiddleware

/***********************************************
// !!! CHOOSE PROGRAM TO RUN HERE !!!
************************************************/

// program = easyGen()
// program = orientationSelectivityGen([500, 1000], [10, 100], 25)
// program = orientationSelectivityGen([5], [1000], 2)

// Use this program for aligning projector with MEA
// program = targetGen()



function* targetGen() {
    yield {stimulusType: STIMULUS.TARGET, lifespan: 60000,
        backgroundColor: 'black'}
}

function* easyGen() {
    yield {stimulusType: STIMULUS.BAR, lifespan: 300,
        backgroundColor: 'black', width: 50, barColor: 'white',
        speed: 15, angle: PI}
    yield {stimulusType: STIMULUS.BAR, lifespan: 300,
        backgroundColor: 'black', width: 50, barColor: 'white',
        speed: 15, angle: PI/2}
    yield {stimulusType: STIMULUS.BAR, lifespan: 300,
        backgroundColor: 'black', width: 50, barColor: 'white',
        speed: 15, angle: 0}
    yield {stimulusType: STIMULUS.BAR, lifespan: 300,
        backgroundColor: 'black', width: 50, barColor: 'white',
        speed: 10, angle: PI}
}


// angles and widths must have same length
// generator now calculates lifespan automatically
// if you want to modify the function (e.g. change the wait times),
// please copy and create a new function to avoid confusion in
// analysis
// 
// speed is pixels / second, width is pixels, angle is radians,
// lifespan is 1/120 of a second, so 120==1 second 
function* orientationSelectivityGen(speeds, widths, numRepeat,
    barColor='white', backgroundColor='black',
    angles=[0, PI/4, PI/2, 3*PI/4, PI, 5*PI/4, 3*PI/2, 7*PI/4]) {

    // initial wait time
    yield {stimulusType: STIMULUS.WAIT, lifespan: 120 * 15}

    for (var t = 0; t < numRepeat; t++) {
        for (var i = 0; i < speeds.length; i++) {
            for (var j = 0; j < widths.length; j++) {
                // wait 10 seconds before each group of eight angles
                yield {stimulusType: STIMULUS.WAIT, lifespan: 120 * 5}

                for (var k = 0; k < angles.length; k++) {
                    yield {stimulusType: STIMULUS.BAR,
                        lifespan: (getDiagonalLength() + widths[j])/speeds[i]*120,
                        backgroundColor: backgroundColor,
                        width: widths[j],
                        barColor: barColor,
                        speed: speeds[i],
                        angle: angles[k]}
                    // Wait between bars
                    yield {stimulusType: STIMULUS.WAIT, lifespan: 120 * 1}

                }
            }
        }
    }
}


/***********************************************/
// ACTIONS

const TIME_TICK = 'TIME_TICK'
const STIMULUS_TICK = 'STIMULUS_TICK'
const SET_STATUS = 'SET_STATUS'
const SET_STIMULUS = 'SET_STIMULUS'
const SET_GRAPHICS = 'SET_GRAPHICS'
const ADD_GRAPHIC = 'ADD_GRAPHIC'
const UPDATE_GRAPHICS = 'UPDATE_GRAPHICS'
const SET_SIGNAL_LIGHT = 'SET_SIGNAL_LIGHT'
const SET_STIMULUS_QUEUE = 'SET_STIMULUS_QUEUE'
const RESET = 'RESET'

// Define states for readability
const STATUS = {
    STARTED: 'STARTED',
    STOPPED: 'STOPPED',
    FINISHED: 'FINISHED'
}

const SIGNAL_LIGHT = {
    FRAME_A: 'FRAME_A',
    FRAME_B: 'FRAME_B',
    NEW_STIM: 'NEW_STIM',
    NEW_STIM_A: 'NEW_STIM_A',
    NEW_STIM_B: 'NEW_STIM_B'
}

const STIMULUS = {
    BAR: 'BAR',
    SOLID: 'SOLID',
    WAIT: 'WAIT',
    TARGET: 'TARGET'
}

const GRAPHIC = {
    BAR: 'BAR',
    TARGET: 'TARGET'
}

/***********************************************/
// ACTION CREATORS


function stimulustickAC(timeDelta) {
    return {type: STIMULUS_TICK, timeDelta: timeDelta}
}

function timetickAC(timeDelta) {
    return { type: TIME_TICK, timeDelta: timeDelta}
}

function addGraphicAC(graphic) {

    return { type: ADD_GRAPHIC, graphic: 'TODO' }
}

function updateGraphicsAC(timeDelta) {
    return  { type: UPDATE_GRAPHICS, timeDelta: timeDelta}
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

const setStatusAC = makeAccessorAC(SET_STATUS, 'status')
const setStimulusQueueAC = makeAccessorAC(SET_STIMULUS_QUEUE, 'stimulusQueue')
const setStimulusAC = makeAccessorAC(SET_STIMULUS, 'stimulus')
const setGraphicsAC = makeAccessorAC(SET_GRAPHICS, 'graphics')
const setSignalLightAC = makeAccessorAC(SET_SIGNAL_LIGHT, 'signalLight')

/***********************************************/
// DISPATCHERS

function graphicsDispatcher(width, barColor, backgroundColor, speed, angle) {
    switch (store.getState().stimulus.stimulusType) {
        case GRAPHIC.BAR:
            movingBarDispatcher(width, barColor, backgroundColor,
                speed, angle)
            break
        case GRAPHIC.TARGET:
            store.dispatch(setGraphicsAC([{
                graphicType: GRAPHIC.TARGET
            }]))
            break
        }
}

function movingBarDispatcher(width, barColor, backgroundColor, speed, angle) {
    // TODO change to addGraphicAC for flexibility
    store.dispatch(setGraphicsAC([{
        graphicType: GRAPHIC.BAR, color: barColor, size: {width: width,
            height: getDiagonalLength()}, speed: speed, angle: angle
    }]))
}

function tickDispatcher(timeDelta) {
    // check if stimulus expired then update signal light
    const state = store.getState()
    if (state.stimulus===undefined ||
        state.stimulus.age >= state.stimulus.lifespan) {

        newStimulusDispatcher()
        let state = store.getState()
        graphicsDispatcher(state.stimulus.width, state.stimulus.barColor,
                state.stimulus.backgroundColor, state.stimulus.speed,
                state.stimulus.angle)
        store.dispatch(setSignalLightAC(SIGNAL_LIGHT.NEW_STIM))
    } else {
        switch(state.signalLight) {
            case SIGNAL_LIGHT.FRAME_A:
                store.dispatch(setSignalLightAC(SIGNAL_LIGHT.FRAME_B))
                break
            case SIGNAL_LIGHT.FRAME_B:
                store.dispatch(setSignalLightAC(SIGNAL_LIGHT.FRAME_A))
                break
            case SIGNAL_LIGHT.NEW_STIM:
                store.dispatch(setSignalLightAC(SIGNAL_LIGHT.NEW_STIM_A))
                break
            case SIGNAL_LIGHT.NEW_STIM_A:
                store.dispatch(setSignalLightAC(SIGNAL_LIGHT.NEW_STIM_B))
                break
            case SIGNAL_LIGHT.NEW_STIM_B:
                store.dispatch(setSignalLightAC(SIGNAL_LIGHT.FRAME_A))
                break
        }
    }
    store.dispatch(stimulustickAC(timeDelta))
    store.dispatch(timetickAC(timeDelta))
    store.dispatch(updateGraphicsAC(timeDelta))
}

function newStimulusDispatcher() {
    queueNewStimulusDispatcher()
    const newStimulus = getNewStimulusDispatcher()
    store.dispatch(setStimulusAC(newStimulus))
}

async function queueNewStimulusDispatcher() {
    const queueStimulus = await nextStimulus()

    let newQueue = store.getState().stimulusQueue.slice(0)
    newQueue.push(queueStimulus)
    store.dispatch(setStimulusQueueAC(newQueue))
}

function getNewStimulusDispatcher() {
    let newQueue = store.getState().stimulusQueue.slice(0)
    const newStimulus = newQueue.shift()
    store.dispatch(setStimulusQueueAC(newQueue))
    return newStimulus
}



/***********************************************/
// REDUCERS

function eyeCandyApp(state, action) {
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
            if (action.stimulus.done===true) {
                return Object.assign({}, state, {
                    status: STATUS.FINISHED    
                })  
            } else {
                return Object.assign({}, state, {
                    stimulus: getNewStimulusReducer(action.stimulus.value)
                })
            }
        case SET_GRAPHICS:
            return Object.assign({}, state, {
                graphics: action.graphics
            })
        case ADD_GRAPHIC:
            return Object.assign({}, state, {
                graphics: [...state.graphics, action.graphic]
            })
        case SET_SIGNAL_LIGHT:
            return Object.assign({}, state, {
                signalLight: action.signalLight
            })
        case TIME_TICK:
            return Object.assign({}, state, {
                time: state.time + action.timeDelta
            })
        case UPDATE_GRAPHICS:
            return Object.assign({}, state, {
                graphics: graphicsReducer(state.graphics, action.timeDelta)
            })
        case STIMULUS_TICK:
            return Object.assign({}, state, {
                stimulus: stimulusTickReducer(state.stimulus, action.timeDelta)
            })
        case SET_STIMULUS_QUEUE:
            return Object.assign({}, state, {
                stimulusQueue: action.stimulusQueue
            })
        case RESET:
            return Object.assign({}, storeInitialState)
    default:
      return state
    }
}

function getNewStimulusReducer(stimulus) {
    return Object.assign({}, stimulus, {
        age: 0
    })
}

function stimulusTickReducer(stimulus, timeDelta) {
    return Object.assign({}, stimulus, {
        age: stimulus.age + timeDelta
    })
}

function graphicsReducer(graphics, timeDelta) {
    if (graphics === undefined) {
        return graphics
    } else {
        return graphics.map(graphic => {
            return tickGraphic(graphic, timeDelta)
        })/*.filter((x) => {return x}) // TODO add code to expire graphics*/
    }
}


/***********************************************/
// GRAPHICS TICK

function tickGraphic(graphic, timeDelta) {
    switch (graphic.graphicType) {
        case GRAPHIC.BAR:
            return tickBar(graphic, timeDelta)
        default:
            return graphic
    }
}


function tickBar(bar, timeDelta) {
    let newPosition = undefined
    if (bar.position === undefined) {
        newPosition = {r: getDiagonalLength()/2, theta: -bar.angle}
    } else {
        newPosition = {r: bar.position.r - bar.speed/120*timeDelta, 
            theta: bar.position.theta}
    }
    const state = store.getState()

    return Object.assign({}, bar, {
        position: newPosition,
        // compensate for bar width & height, translate from polar & translate from center
        // use height on both to make square
        origin: {x: bar.size.width/2*cos(newPosition.theta) +
                    newPosition.r*cos(newPosition.theta) + state['windowHeight']/2,
                 y: bar.size.width/2*sin(newPosition.theta) +
                    newPosition.r*sin(newPosition.theta) + state['windowHeight']/2}
    })
}


/***********************************************/
// MIDDLEWARE

function logger({ getState }) {
  return (next) => (action) => {
    console.log('will dispatch', action)

    // Call the next dispatch method in the middleware chain.
    let returnValue = next(action)

    console.log('state after dispatch', getState())

    // This will likely be the action itself, unless
    // a middleware further in chain changed it.
    return returnValue
  }
}

/************************************************
// LOGIC
************************************************/

// ensure bar always spans window regardless of angle
function getDiagonalLength() {
    return sqrt(pow(store.getState()['windowHeight'], 2) +
        pow(store.getState()['windowHeight'], 2))
}


/************************************************
ANIMATE
************************************************/

function render() {
    const status = store.getState().status
    if (status === STATUS.STARTED) {
        renderHelper()
    }
}

function renderHelper() {
    context.clearRect(0, 0, WIDTH, HEIGHT)
    const state = store.getState()
    document.body.style.backgroundColor = state.stimulus.backgroundColor

    if (state.graphics != undefined) {
        state.graphics.forEach(graphic => {
            context.save()
            switch (graphic.graphicType) {
                case GRAPHIC.BAR:
                    // might need to translate first if rotation
                    context.translate(graphic.origin.x,
                        graphic.origin.y)
                    context.fillStyle = graphic.color
                    // Rotate rectangle to be perpendicular with Center of Canvas
                    context.rotate(graphic.position.theta)
                    // Draw a rectangle, adjusting for Bar width
                    context.fillRect(-graphic.size.width/2, -graphic.size.height/2,
                        graphic.size.width, graphic.size.height)
                    break
                case GRAPHIC.TARGET:
                    context.strokeStyle = '#ff0000'

                    context.beginPath()
                    context.arc(HEIGHT/2,HEIGHT/2,HEIGHT/2,0,2*PI)
                    context.stroke()

                    context.beginPath()
                    context.arc(HEIGHT/2,HEIGHT/2,HEIGHT/3,0,2*PI)
                    context.stroke()

                    context.beginPath()
                    context.arc(HEIGHT/2,HEIGHT/2,HEIGHT/5,0,2*PI)
                    context.stroke()

                    context.beginPath()
                    context.arc(HEIGHT/2,HEIGHT/2,HEIGHT/10,0,2*PI)
                    context.stroke()

                    context.beginPath()
                    context.arc(HEIGHT/2,HEIGHT/2,HEIGHT/100,0,2*PI)
                    context.stroke()

                    context.rect(0,0,HEIGHT,HEIGHT)
                    context.stroke()
            }
            context.restore()
        })
    }

    context.save()


    // block right edge from screen
    context.fillStyle = state.stimulus.backgroundColor
    context.fillRect(state.windowHeight, 0,
        state.windowWidth - state.windowHeight, state.windowHeight)

    // draw flicker

    switch(state.signalLight) {
        case SIGNAL_LIGHT.FRAME_A:
            context.fillStyle = '#949494'
            break
        case SIGNAL_LIGHT.FRAME_B:
            context.fillStyle = '#6C6C6C'
            break
        default:
            // this catches NEW_STIMULUS
            context.fillStyle = 'white'
            break
    }

    context.fillRect(state.windowHeight + 120, 0,
        state.windowWidth - state.windowHeight - 100, state.windowHeight / 6)
    context.restore()
}

function* sampleGen() {
    for (var i = 0; i <= 3; i++) {
        yield i
    }
}


var lastTime = window.performance.now()
function renderLoop() {
    var curTime = window.performance.now()

    const frameTime = curTime - lastTime
    lastTime = curTime


    switch (store.getState().status) {
        case STATUS.STOPPED:
            context.clearRect(0, 0, WIDTH, HEIGHT)
            document.body.style.backgroundColor = 'black'
            break
        case STATUS.FINISHED:
            context.clearRect(0, 0, WIDTH, HEIGHT)
            document.body.style.backgroundColor = 'black'
            return  'FINISHED'
        case STATUS.STARTED:

            // adjust for dropped frames
            if (frameTime < 10) {
                // 120 Hz
                tickDispatcher(1)
            } else if (frameTime < 20) {
                // 60 Hz
                tickDispatcher(2)
            } else {
                const toTick = Math.round(frameTime/(1000/120))
                tickDispatcher(toTick)
            }
            render()
            break
    }
    requestAnimationFrame(renderLoop)
}


/************************************************
STORE
************************************************/

const storeInitialState = {
    windowHeight: window.innerHeight,
    windowWidth: window.innerWidth,
    status: STATUS.STOPPED,
    signalLight: SIGNAL_LIGHT.FRAME_A,
    time: 0,
    stimulusQueue: []
}


// USE THIS FOR NO LOGGER
// let store = createStore(eyeCandyApp, storeInitialState)

// USE THIS FOR LOGGER
let store = createStore(eyeCandyApp, storeInitialState, applyMiddleware( logger ))

// GET FROM SERVER (NOT OPERATIONAL)
// let store = createStore(todoApp, window.STATE_FROM_SERVER)


/************************************************
CANVAS
************************************************/

const canvas=document.getElementById('eyecandy')
var context = canvas.getContext('2d')
const WIDTH = store.getState()['windowWidth']
const HEIGHT = store.getState()['windowHeight']
context.canvas.width  = WIDTH
context.canvas.height = HEIGHT


/************************************************
TESTS
************************************************/


const testBar = {
    'graphicType': 'BAR',
    'color': 'white',
    'size': {
        'width': 20,
        'height': 1727.934315881249
    },
    'speed': 10,
    'angle': 0,
    'position': {
        'r': 1727.934315881249,
        'theta': 0
    },
    'origin': {
        'x': 2457.434315881249,
        'y': 493
    }
}


/***********************************************/
// PROGRAM / server communication

var socket = io();

fetch('/window', {
    method: 'POST',
    headers: {
        windowHeight: store.getState()['windowHeight'],
        windowWidth: store.getState()['windowWidth']
    }
})

socket.on('run', (stimulusQueue) => {
    store.dispatch(setStimulusQueueAC(stimulusQueue))
    store.dispatch(setStatusAC(STATUS.STARTED))
})

socket.on('reset', () => {
    store.dispatch(resetAC())
})

socket.on('target', () => {
    store.dispatch(resetAC())
    store.dispatch(setStimulusAC(targetGen()))
})

// const queueBuffer = 5

// async function getProgram(queueBuffer) {
//     console.log('in getProgram')
//     const response = await (await fetch('/new-program', {
//         method: 'POST'//,
//         // headers: {
//         //     windowHeight: store.getState()['windowHeight'],
//         //     windowWidth: store.getState()['windowWidth']
//         // }
//     })).json()

//     if (response.status==='RUN_PROGRAM') {
//         for (var i = 0; i < queueBuffer; i++) {
//             await queueNewStimulusDispatcher()
//         }
//     }

// }

// async function callServer() {
//     while (true) {
//         console.log('in while loop')
//         console.log(store.getState())
//         if (store.getState().stimulusQueue.length < queueBuffer) {
//             window.setTimeout(getProgram(queueBuffer),1000)
//         } else {
//             store.dispatch(setStatusAC(STATUS.STARTED))
//             break
//         }
//     }
// }


async function nextStimulus() {
   return await (await fetch('/next-stimulus', {
        method: 'POST'
   })).json()
}


/************************************************
RUN
************************************************/
renderLoop()