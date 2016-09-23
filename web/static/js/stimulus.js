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
ACTIONS
************************************************/

const TIME_TICK = 'TIME_TICK'
const STIMULUS_TICK = 'STIMULUS_TICK'
const SET_STATUS = 'SET_STATUS'
const SET_STIMULUS = 'SET_STIMULUS'
const SET_GRAPHICS = 'SET_GRAPHICS'
const ADD_GRAPHIC = 'ADD_GRAPHIC'
const REMOVE_GRAPHIC = 'REMOVE_GRAPHIC'
const GRAPHICS_TICK = 'GRAPHICS_TICK'
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
    TARGET: 'TARGET',
    GRATING: 'GRATING',
    CHECKERBOARD: "CHECKERBOARD"
}

const GRAPHIC = {
    BAR: 'BAR',
    CHECKER: "CHECKER",
    TARGET: 'TARGET'
}

/***********************************************
EXAMPLE STIMULUS
************************************************/

const exampleBar = {stimulusType: STIMULUS.BAR, lifespan: 300,
        backgroundColor: 'black', width: 50, barColor: 'white',
        speed: 15, angle: PI, age: 0}
const exampleCheckerboard = {stimulusType: STIMULUS.CHECKERBOARD, lifespan: 300,
        backgroundColor: 'black', width: 50, barColor: 'white',
        speed: 15, angle: PI, age: 0}
const exampleSolid = {stimulusType: STIMULUS.SOLID,
            lifespan: 120 * 5,
            backgroundColor: 'black'
        }
const exampleWait = {stimulusType: STIMULUS.WAIT,
            lifespan: 120 * 5,
            backgroundColor: 'black'
        }
const exampleGrating = {stimulusType: STIMULUS.GRATING, lifespan: 300,
        backgroundColor: 'black', width: 50, barColor: 'white',
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

function graphicsTickAC(timeDelta) {
    return  { type: GRAPHICS_TICK, timeDelta: timeDelta}
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

/***********************************************
DISPATCHERS
************************************************/

function graphicsDispatcher() {
    const state = store.getState()
    const stimulus = state.stimulus
    console.log('in graphicsDispatcher', stimulus)
    switch (stimulus.stimulusType) {
        case STIMULUS.BAR:
            if (stimulus.age === 0) {
                console.log('len is 0')
                barDispatcher(stimulus.width, stimulus.barColor, stimulus.backgroundColor,
                    stimulus.speed, stimulus.angle)
            }
            break
        case STIMULUS.TARGET:
            store.dispatch(setGraphicsAC([{
                graphicType: GRAPHIC.TARGET
            }]))
        case STIMULUS.GRATING:
            if (stimulus.age === 0) {
                barDispatcher(stimulus.width, stimulus.barColor, stimulus.backgroundColor,
                    stimulus.speed, stimulus.angle)
                // increment count by 1 after bar is dispatched
                store.dispatch(setStimulusAC(Object.assign({}, stimulus, {
                    count: stimulus.count + 1
                })))
            }
            
            // console.log('XXX grating comparison', stimulus.speed / 120 * stimulus.age)
            // console.log('>= XXX grating comparison', stimulus.wavelength * stimulus.count)

            gratingDispatcherHelper()
            break
        case STIMULUS.CHECKERBOARD:
            if (stimulus.age === 0) {
                checkerboardDispatcher(stimulus.time,stimulus.size,stimulus.period,stimulus.color,stimulus.alternateColor)
            } else {
                 if (stimulus.age > stimulus.period * stimulus.count / 2 * 120) {
                    if (stimulus.count % 2 == 0) {
                        store.dispatch(setStimulusAC(Object.assign({}, stimulus, {
                            count: stimulus.count+1,
                            backgroundColor: stimulus.alternateColor,
                        })))
                    } else {
                        store.dispatch(setStimulusAC(Object.assign({}, stimulus, {
                            count: stimulus.count+1,
                            backgroundColor: stimulus.color,
                        })))
                    }
                 }
            }
    }
}

function checkerboardDispatcher(time,size,period,color,alternateColor) {
    const height = store.getState()['stimulusLength']
    const numberOfSquares = Math.ceil(height/size)
    // we will only create every other square and alternate colors with the background
    for (var i = 0; i < numberOfSquares; i=i+2) {
        for (var j = 0; j < numberOfSquares; j=j+2) {
            store.dispatch(addGraphicAC({
                graphicType: GRAPHIC.CHECKER,
                startX: i*size,
                startY: j*size,
                size: size,
                period: period, 
                color: color,
                alternateColor: alternateColor,
                count: 1,
                lifespan: time*120,
                age: 0
            }))
        }
    }

    for (var i = 1; i < numberOfSquares; i=i+2) {
        for (var j = 1; j < numberOfSquares; j=j+2) {
            store.dispatch(addGraphicAC({
                graphicType: GRAPHIC.CHECKER,
                startX: i*size,
                startY: j*size,
                size: size,
                period: period, 
                color: color,
                alternateColor: alternateColor,
                count: 1,
                lifespan: time*120,
                age: 0
            }))
        }
    }
}

function barDispatcher(width, barColor, backgroundColor, speed, angle,
    startR=getDiagonalLength()/2) {

    store.dispatch(addGraphicAC({
        graphicType: GRAPHIC.BAR, age: 0, color: barColor, size: {width: width,
            height: getDiagonalLength()}, speed: speed, angle: angle,
            lifespan: calcLifespan(speed, width, startR), startR: startR
    }))
}

function gratingDispatcherHelper() {

    const state = store.getState()
    const stimulus = state.stimulus

    // first bar is reference origin
    const originR = getDiagonalLength()/2
    const distanceTraveled = stimulus.speed / 120 * stimulus.age
    const refOrigin = originR - distanceTraveled


    // adjust for > 0 or else wavelength will be off
    // due to frame timing
    // refOrigin must have move by at least this much to dispatch new bar
    let count = stimulus.count
    let nextStartDistance = stimulus.wavelength * count

    // user can give numberOfBars or time. 
    if (stimulus.numberOfBars===undefined || count<stimulus.numberOfBars) {
        // aggregate position (distance traveled) spawns new bars
        // once equal to wavelength
        // 500 / 120 * 290 >= 300 * 0
        if (distanceTraveled  >= nextStartDistance) {
            console.log('XXX will dispatch new bar ', refOrigin+nextStartDistance)
            const startR = refOrigin + nextStartDistance
            barDispatcher(stimulus.width, stimulus.barColor, stimulus.backgroundColor,
                stimulus.speed, stimulus.angle, startR)
            // we use count to keep track of how many bars have been
            // cumulatively dispatched
            count = count + 1
            store.dispatch(setStimulusAC(Object.assign({}, stimulus, {
                count: count
            })))
        }

        // need to have bars at least speed / 120 * 3 pixels past originR (3 frames)
        const bufferDistance = stimulus.speed / 120 * 3
        nextStartDistance = stimulus.wavelength * count

        // This likely creates stack problems with large numbers of bars (eg <10 width and <10 wavelength)
        if (distanceTraveled  >= nextStartDistance) {
            gratingDispatcherHelper()
        }
    }
}

function removeGraphicDispatcher(index) {
    store.dispatch(removeGraphicAC(index))
}

function cleanupGraphicsDispatcher() {
    const graphics = store.getState().graphics
    for (var i = 0; i < graphics.length; i++) {
        const graphic = graphics[i]
        if (graphic.age > graphic.lifespan) {
            removeGraphicDispatcher(i)
        }
    }
}

function tickDispatcher(timeDelta) {
    const state = store.getState()
    
    // initialize for time=0
    if (state.stimulus!=undefined ) {
        store.dispatch(timetickAC(timeDelta))
        store.dispatch(stimulusTickAC(timeDelta))
    }

    // check if stimulus expired then update signal light
    if (state.stimulus===undefined ||
        state.stimulus.age >= state.stimulus.lifespan) {

        newStimulusDispatcher()
        let state = store.getState()
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
    // graphicsDispatcher will initialize graphics
    graphicsDispatcher()
    // graphicsTickAC will initialize correct position
    store.dispatch(graphicsTickAC(timeDelta))
    cleanupGraphicsDispatcher()
}

function newStimulusDispatcher() {
    queueNewStimulusDispatcher()
    const newStimulus = getNewStimulusDispatcher()

    if (newStimulus.done===true) {
        store.dispatch(setStatusAC(STATUS.FINISHED)) 
    } else {
        store.dispatch(setStimulusAC(newStimulus.value))
        store.dispatch(setGraphicsAC([]))
    }

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



/***********************************************
REDUCERS
************************************************/

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
            return Object.assign({}, state, {
                stimulus: action.stimulus
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
            return Object.assign({}, state, {
                signalLight: action.signalLight
            })
        case TIME_TICK:
            return Object.assign({}, state, {
                time: state.time + action.timeDelta
            })
        case GRAPHICS_TICK:
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

function stimulusTickReducer(stimulus, timeDelta) {
    return Object.assign({}, stimulus, {
        age: stimulus.age + timeDelta
    })
}

function graphicsReducer(graphics, timeDelta) {
    // if (graphics === undefined) {
        // return graphics
    // } else {
        return graphics.map(graphic => {
            return tickGraphic(graphic, timeDelta)
       })/*.filter((x) => {return x}) // TODO add code to expire graphics*/
    // }
}


/***********************************************
GRAPHICS TICK
************************************************/

function tickGraphic(graphic, timeDelta) {
    switch (graphic.graphicType) {
        case GRAPHIC.BAR:
            return tickBar(graphic, timeDelta)
        case GRAPHIC.CHECKER:
            return tickChecker(graphic,timeDelta)
        default:
            return graphic
    }
}

function tickChecker(checker, timeDelta) {
    if (checker.age+timeDelta >= checker.period/2*120) {
        return Object.assign({}, checker, {
            age: checker.age + timeDelta - checker.period/2*120,
            color: checker.alternateColor,
            alternateColor: checker.color

        })
    } else {
        return Object.assign({}, checker, {
            age: checker.age + timeDelta,
        })

    }
}

function tickBar(bar, timeDelta) {
    let newPosition = undefined
    if (bar.position === undefined) {
        newPosition = {r: bar.startR, theta: -bar.angle}
    } else {
        newPosition = {r: bar.position.r - bar.speed/120*timeDelta, 
            theta: bar.position.theta}
    }

    const state = store.getState()

    return Object.assign({}, bar, {
        position: newPosition,
        age: bar.age + timeDelta,
        // compensate for bar width & height, translate from polar & translate from center
        // use length on both to make square
        origin: {x: bar.size.width/2*cos(newPosition.theta) +
                    newPosition.r*cos(newPosition.theta) + state['stimulusLength']/2,
                 y: bar.size.width/2*sin(newPosition.theta) +
                    newPosition.r*sin(newPosition.theta) + state['stimulusLength']/2}
    })
}


/***********************************************
MIDDLEWARE
************************************************/

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
LOGIC
************************************************/

// ensure bar always spans window regardless of angle
function getDiagonalLength() {
    return sqrt(pow(store.getState()['stimulusLength'], 2) +
        pow(store.getState()['stimulusLength'], 2))
}

function calcLifespan(speed, width, startR) {
    return (startR + getDiagonalLength()/2 + width ) / speed * 120
}


/************************************************
ANIMATE
************************************************/

function render() {
    context.clearRect(0, 0, WIDTH, HEIGHT)
    const state = store.getState()
    document.body.style.backgroundColor = state.stimulus.backgroundColor

    // if (state.graphics != undefined) {
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
                    break
                case GRAPHIC.CHECKER:
                    context.fillStyle = graphic.color
                    context.fillRect(graphic.startX, graphic.startY,
                                     graphic.size, graphic.size)
                    break
            }
            context.restore()
        })
    // }

    context.save()

    context.fillStyle = "black"
    
    if (state.windowWidth>state.windowHeight) {
        // Landscape

        // block right edge from screen
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
        const extraPixels = state.windowWidth - state.windowHeight
        const flickerWidth = extraPixels/2
        const flickerHeight = extraPixels/2
        context.fillRect(state.windowHeight + extraPixels - flickerWidth, 0,
            flickerWidth, flickerHeight)
    } else {
        // Portrait

        // block bottom edge from screen
        context.fillRect(0, state.windowWidth,
            state.windowWidth, state.windowHeight - state.windowWidth)

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
        const extraPixels = state.windowHeight - state.windowWidth
        const flickerWidth = state.windowWidth
        const flickerHeight = extraPixels/2
        context.fillRect(0, state.windowWidth + extraPixels - flickerHeight,
            flickerWidth, flickerHeight)
    }

    context.restore()
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
            break
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
    // the length of the square where we will project the stimulus
    stimulusLength: Math.min(window.innerHeight,window.innerWidth),
    status: STATUS.STOPPED,
    signalLight: SIGNAL_LIGHT.FRAME_A,
    time: 0,
    stimulusQueue: [],
    graphics: []
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


/***********************************************
PROGRAM / server communication
************************************************/

var socket = io();

fetch('/window', {
    method: 'POST',
    headers: {
        windowHeight: store.getState()['windowHeight'],
        windowWidth: store.getState()['windowWidth']
    },
    credentials: 'include'
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
    store.dispatch(setStimulusQueueAC(
        [{stimulusType: STIMULUS.TARGET, lifespan: 60000,
        backgroundColor: 'black'}]))
    store.dispatch(setStatusAC(STATUS.STARTED))
})

async function nextStimulus() {
   return await (await fetch('/next-stimulus', {
        method: 'POST',
        credentials: 'include'
   })).json()
}


/************************************************
RUN
************************************************/
renderLoop()