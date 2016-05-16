const PI = Math.PI
const pow = Math.pow
const sqrt = Math.sqrt
const sin = Math.sin
const cos = Math.cos

/************************************************
REDUX (GLOBAL STATE)
************************************************/

const createStore = Redux.createStore;
const combineReducers = Redux.combineReducers;

/***********************************************/
// ACTIONS

const TICK = 'TICK'
const SET_STATUS = 'SET_STATUS'
const SET_STIMULUS = 'SET_STIMULUS'
const SET_PROGRAM = 'SET_PROGRAM'
const SET_GRAPHICS = 'SET_GRAPHICS'
const ADD_GRAPHIC = 'ADD_GRAPHIC'
const REMOVE_GRAPHIC = 'REMOVE_GRAPHIC'
const SET_SIGNAL_LIGHT = 'SET_SIGNAL_LIGHT'

// Define states for readability
const STATUS = {
    STARTED: 'STARTED',
    STOPPED: 'STOPPED',
}

const PROGRAM = {
    ORIENTATION_SELECTIVITY: 'ORIENTATION_SELECTIVITY',
    /*
    {
        programType: PROGRAM.ORIENTATION_SELECTIVITY,
        speed: 1,
        preTime: 0,
        interTime: 0,
        postTime: 0,
        barWidth: 20,
        orientations: [0, PI/2, PI, 3*PI/2]
    }
    */
    MOVING_BAR: 'MOVING_BAR'
    /*
    {
        programType: PROGRAM.MOVING_BAR,
        speed: 1,
        preTime: 0,
        interTime: 0,
        postTime: 0,
        barWidth: 20,
    }
    */
}
const STIMULUS = {
    BAR: 'BAR',
    /*
    {
        position: {x: 0, y: 0},
        size: {width: 20, height: 10},
        speed: 1,
        angle: 0,
    }
    */
}

const GRAPHIC = {
    BAR: 'BAR'
}

/***********************************************/
// ACTION CREATORS

function makeActionCreatorAccessor(type, ...argNames) {
  return function(...args) {
    let action = { type }
    argNames.forEach((arg, index) => {
      action[argNames[index]] = args[index]
    })
    return action
  }
}

function tick() {
    return { type: TICK}
}

function addGraphic(graphic) {

    return { type: ADD_GRAPHIC, graphic: 'TODO' }
}

const setStatus = makeActionCreatorAccessor(SET_STATUS, 'status')
const setStimulus = makeActionCreatorAccessor(SET_STIMULUS, 'stimulus')
const setProgram = makeActionCreatorAccessor(SET_PROGRAM, 'program')
const setGraphics = makeActionCreatorAccessor(SET_GRAPHICS, 'graphics')
const setSignalLight = makeActionCreatorAccessor(SET_SIGNAL_LIGHT, 'signalLight')


/***********************************************/
// REDUCERS

const accessorInitialState = {
    windowHeight: window.innerHeight,
    windowWidth: window.innerWidth,
    status: STATUS.STOPPED,
    // program: {
    //     programType: PROGRAM.MOVING_BAR,
    //     speed: 1,
    //     preTime: 0,
    //     interTime: 0,
    //     postTime: 0,
    //     barWidth: 20,
    // },
    // stimulus: {},
    program: {},
    stimulus: {
        stimulusType: STIMULUS.BAR,
    },
    graphics: [{
        graphicType: GRAPHIC.BAR,
        color: '#FFFFFF',
        position: {x: 0, y: 0},
        size: {width: 50, height: 50},
        speed: 1,
        angle: 0,
    }],
    // signalLight in range(0,255)
    signalLight: 0,
    time: 0,
}

function eyeCandyApp(state = accessorInitialState, action) {
    switch (action.type) {
        case SET_STATUS:
            return Object.assign({}, state, {
                status: action.status
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
        case SET_SIGNAL_LIGHT:
            return Object.assign({}, state, {
                signalLight: action.signalLight
            })
        case TICK:
            return tickReducer(state, action)
    default:
      return state
    }
}

function tickReducer(state, action) {
    switch(store.getState()['stimulus']['stimulusType']) {
        case STIMULUS.BAR:
            return Object.assign({}, state, {
                time: state.time + 1,
                graphics: tickBar(state.graphics),
            })                
        // return Object.assign({}, state, {
        //     time: state.time + 1,
        //     stimuli: state.stimuli.map(stimulus => {
        //         stimulus.graphic.position()
        //         return Object.assign({}, stimulus, {
        //             graphic: rect
        //         })
        //     })
        // })
    }
}

/***********************************************/
// TICK

function tickBar(graphics) {
    return graphics.map(bar => {
        return Object.assign({}, bar, {
            position: tickPosition(bar.position, bar.speed, bar.angle),
        })
    })
}

function tickPosition(position, speed, angle) {
    const new_x = position.x + speed * cos(angle)
    const new_y = position.y + speed * sin(angle)
    return { x: new_x, y: new_y }
}

/***********************************************/
// STORE

let store = createStore(eyeCandyApp)
// let store = createStore(todoApp, window.STATE_FROM_SERVER)

// TEST

// Every time the state changes, log it
// Note that subscribe() returns a function for unregistering the listener
let unsubscribe = store.subscribe(() =>
  console.log(store.getState())
)

store.dispatch(setStatus(STATUS.STARTED))
store.dispatch(setStatus(STATUS.STOPPED))
//  offstore.dispatch(tick())

// Stop listening to state updates
unsubscribe()

/************************************************
// LOGIC
************************************************/

// ensure bar always spans window regardless of angle and
function getDiagonalLength() {
    return sqrt(pow(store.getState()['windowWidth'], 2) +
        pow(store.getState()['windowHeight'], 2))
}


/************************************************
CANVAS
************************************************/

const canvas=document.getElementById("eyecandy");
canvas.width=store.getState()['windowWidth']
canvas.height=store.getState()['windowHeight']
var context = canvas.getContext("2d");

function render() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    store.getState().graphics.forEach(graphic => {
        switch (graphic.graphicType) {
            case GRAPHIC.BAR:
                // might need to translate first if rotation
                context.fillStyle = graphic.color
                context.fillRect(graphic.position.x, graphic.position.y, graphic.size.width, graphic.size.height);
                // context.rotate(graphic.angle)
        }
    })
}


/************************************************
ANIMATE
************************************************/
var lastTime = window.performance.now()
function mainLoop() {
    var curTime = window.performance.now()
    console.log(curTime - lastTime)
    lastTime = curTime
    store.dispatch(tick())
    render()
    requestAnimationFrame(mainLoop)
}
mainLoop()
// render()