/****** PIXI SETUP ******/

const Container = PIXI.Container,
    WebGLRenderer = PIXI.WebGLRenderer,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite;

/****** REDUX (GLOBAL STATE) ******/

const createStore = Redux.createStore;
const r = Redux.r;
const combineReducers = Redux.combineReducers;

// ACTIONS

const TICK = 'TICK'
const SET_STATUS = 'SET_STATUS'
// TODO CHANGE MODE TO STIMULUS_TYPE
const SET_STIMULUS_TYPE = 'SET_STIMULUS_TYPE'
const SET_SPEED = 'SET_SPEED'
const SET_PRE_TIME = 'SET_PRE_TIME'
const SET_INTER_TIME = 'SET_INTER_TIME'
const SET_POST_TIME = 'SET_POST_TIME'
const SET_BAR_WIDTH = 'SET_BAR_WIDTH'
const SET_POS = 'SET_POS'
const SET_ORIENTATION = 'SET_ORIENTATION'
// stage holds Pixi graphics state to render
const SET_STAGE = 'SET_STAGE'
const ADD_CHILD = 'ADD_CHILD'
const REMOVE_CHILD = 'REMOVE_CHILD'

// Define states for readability
const Statuses = {
    STARTED: 'STARTED',
    STOPPED: 'STOPPED',
}

const Stimuli = {
    BAR: 'BAR',
}

const StimulusTypes = {
    OS_BAR: 'OS_BAR',
}

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

function addChild() {
    var rect = new PIXI.Graphics();

    rect.beginFill(0xFFFFFF);

    // draw a rectangle
    rect.drawRect(0, 0, 300, 200);
    // rect.generateTexture;
    return { type: ADD_CHILD, child: rect }
}

const setStatus = makeActionCreatorAccessor(SET_STATUS, 'status')
const setStimulusType = makeActionCreatorAccessor(SET_STIMULUS_TYPE, 'stimulusType')
const setSpeed = makeActionCreatorAccessor(SET_SPEED, 'speed')
const setPreTime = makeActionCreatorAccessor(SET_PRE_TIME, 'time')
const setInterTime = makeActionCreatorAccessor(SET_INTER_TIME, 'time')
const setPostTime = makeActionCreatorAccessor(SET_POST_TIME, 'time')
const setBarWidth = makeActionCreatorAccessor(SET_BAR_WIDTH, 'barWidth')
const setSetPos = makeActionCreatorAccessor(SET_POS, 'pos')
const setOrientation = makeActionCreatorAccessor(SET_ORIENTATION, 'orientation')
const setStage = makeActionCreatorAccessor(SET_STAGE, 'stage')


// REDUCERS

const accessorInitialState = {
    windowHeight: window.innerHeight,
    windowWidth: window.innerWidth,
    status: Statuses.STOPPED,
    stimulusType: StimulusTypes.OS_BAR,
    speed: 1,
    preTime: 0,
    interTime: 0,
    postTime: 0,
    barWidth: 20,
    pos: { x: 0, y:0 },
    orientation: 0,
}

function accessorReducer(state = accessorInitialState, action) {
    switch (action.type) {
        case SET_STATUS:
            return Object.assign({}, state, {
                status: action.status
            })
        case SET_STIMULUS_TYPE:
            return Object.assign({}, state, {
                stimulusType: action.mode
            })
        case SET_SPEED:
            return Object.assign({}, state, {
                speed: action.speed
            })
        case SET_PRE_TIME:
            return Object.assign({}, state, {
                preTime: action.time
            })
        case SET_INTER_TIME:
            return Object.assign({}, state, {
                interTime: action.time
            })
        case SET_POST_TIME:
            return Object.assign({}, state, {
                postTime: action.time
            })
        case SET_BAR_WIDTH:
            return Object.assign({}, state, {
                barWidth: action.width
            })
        case SET_POS:
            return Object.assign({}, state, {
                pos: action.pos
            })
        case SET_ORIENTATION:
            return Object.assign({}, state, {
                orientation: action.orientation
            })
        case SET_STAGE:
            return Object.assign({}, state, {
                stage: action.stage
            })
    default:
      return state
    }
}

function stageReducerHelper(state, action) {
    switch (action.type) {
        case ADD_CHILD:
            return state
    }
}

function stageReducer(state={stage: new Container()}, action) {
    switch (action.type) {
        case ADD_CHILD:
            return Object.assign({}, state, {
                stage: stageReducerHelper(state.stage, action)
            })
        // case REMOVE_CHILD:
        //     return Object.assign({}, state, {
        //         stage: Object.assign({}, state.stage {
        //             children: [...state.stage.children, {
        //                 action.child
        //             }]
        //         })
        //     })
        default:
            return state
    }
}

function tickReducer(state={time: 0}, action) {
    switch (action.type) {
        case TICK:
            // switch on stimulusType
            switch(store.getState()['stimulusType']) {
                case StimulusTypes.OS_BAR:
                    return Object.assign({}, state, {
                        time: state.time + 1,
                        stage: tickOSBar(state.stage),
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
        default:
            return state
    }
}

function reduceReducers(...reducers) {
    return (previous, current) =>
        reducers.reduce(
            (prev, r) => r(p, current),
            previous
        );
}

eyeCandyApp = reduceReducers({
    accessorReducer, stageReducer, tickReducer,
})

// TICK

function tickOSBar(stage) {
    return Object.assign({}, stage, {
        children: tickOSBarHelper(stage.children)
    })
}

function tickOSBarHelper(children) {
    return children.map(bar => {
        return Object.assign({}, bar, {

        })
    })
}

// STORE

let store = createStore(eyeCandyApp)
// let store = createStore(todoApp, window.STATE_FROM_SERVER)

// TEST

// Every time the state changes, log it
// Note that subscribe() returns a function for unregistering the listener
let unsubscribe = store.subscribe(() =>
  console.log(store.getState())
)

store.dispatch(setStatus('STARTED'))
store.dispatch(setStatus('STOPPED'))
store.dispatch(setPreTime('10'))
store.dispatch(tick())
store.dispatch(tick())
store.dispatch(tick())

// Stop listening to state updates
unsubscribe()

/****** RENDER *****/

// Create the renderer, can use autoDetectRenderer for Canvas fallback
let renderer = new WebGLRenderer(
  // 1140, 912,
  store.getState()['windowWidth'], store.getState()['windowHeight'],
  {antialias: false, transparent: false, resolution: 1}
);

// fill window
renderer.view.style.position = "absolute";  
renderer.view.style.display = "block";
// renderer.autoResize = true;
// renderer.resize(WIDTH, HEIGHT);

// Add the canvas to the HTML document
document.body.appendChild(renderer.view);

// make red line around renderer
// renderer.view.style.border = "1px dashed red";

function mainLoop() {
    renderer.render(store.getState()['stage']);
    store.dispatch(tick())
    requestAnimationFrame(mainLoop);
}

mainLoop();





// // CREATE SHAPES 

// // BUILD RECTANGLE
// var rect = new PIXI.Graphics();

// rect.beginFill(0xFFFFFF);

// // draw a rectangle
// rect.drawRect(0, 0, 300, 200);
// rect.generateTexture;
// stage.addChild(rect);

// // Tell the `renderer` to `render` the `stage`
// renderer.render(stage);


// /****** UPDATE WORLD ******/
// function updateWorld() {
//   // // check FPS
//   // var thisLoop = new Date;
//   // var fps = 1000 / (thisLoop - lastLoop);
//   // lastLoop = thisLoop;
//   // console.log(fps)

//   // move circle
//   rect.x = rect.x + 4;
//   rect.y = rect.y + 4;
// }


// /****** ANIMATE ******/
// mainLoop();

// var lastLoop = new Date;
// function mainLoop() {
//     renderer.render(stage);
//     updateWorld();
//     requestAnimationFrame(mainLoop);
// }
