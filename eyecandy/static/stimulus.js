/****** PIXI SETUP ******/

const Container = PIXI.Container,
    WebGLRenderer = PIXI.WebGLRenderer,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Graphics = PIXI.Graphics;

/****** REDUX (GLOBAL STATE) ******/

const createStore = Redux.createStore;
const combineReducers = Redux.combineReducers;

// ACTIONS

const TICK = 'TICK'
const SET_STATUS = 'SET_STATUS'
const SET_STIMULUS = 'SET_STIMULUS'
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

function addChild(graphic) {
    var rect = new Graphics();

    rect.beginFill(0xFFFFFF);

    // draw a rectangle
    rect.drawRect(0, 0, 300, 200);
    // TODO make generic
    return { type: ADD_CHILD, graphic: rect }
    // return { type: ADD_CHILD, graphic: graphic }
}

const setStatus = makeActionCreatorAccessor(SET_STATUS, 'status')
const setStimulus = makeActionCreatorAccessor(SET_STIMULUS, 'stimulus')
// const setSpeed = makeActionCreatorAccessor(SET_SPEED, 'speed')
// const setPreTime = makeActionCreatorAccessor(SET_PRE_TIME, 'time')
// const setInterTime = makeActionCreatorAccessor(SET_INTER_TIME, 'time')
// const setPostTime = makeActionCreatorAccessor(SET_POST_TIME, 'time')
// const setBarWidth = makeActionCreatorAccessor(SET_BAR_WIDTH, 'barWidth')
// const setOrientation = makeActionCreatorAccessor(SET_ORIENTATION, 'orientation')
const setStage = makeActionCreatorAccessor(SET_STAGE, 'stage')


// REDUCERS

const accessorInitialState = {
    windowHeight: window.innerHeight,
    windowWidth: window.innerWidth,
    status: Statuses.STOPPED,
    stimulus: {
        stimulusType: Stimuli.OS_BAR,
        speed: 1,
        preTime: 0,
        interTime: 0,
        postTime: 0,
        barWidth: 20,
        orientation: 0,
    },
    stage: new Container,
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
        case SET_STAGE:
            return Object.assign({}, state, {
                stage: action.stage
            })
        case ADD_CHILD:
            return Object.assign({}, state, {
                stage: addChildHelper(state.stage, action)
            })
        case TICK:
            return tickReducer(state, action)
    default:
      return state
    }
}

function addChildHelper(stage, action) {
    return Object.assign({}, stage, {
        children: [
            ...stage.children,
            action.graphic
        ]
    })
}

function tickReducer(state, action) {
    switch(store.getState()['stimulus']['stimulusType']) {
        case Stimuli.OS_BAR:
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
}

// TICK

function tickOSBar(stage) {
    return Object.assign({}, stage, {
        children: tickOSBarHelper(stage.children)
    })
}

function tickOSBarHelper(children) {
    return children.map(bar => {
        return Object.assign({}, bar, {
            position: {x: 24, y: 24}
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
store.dispatch(addChild('removeME'))
store.dispatch(tick())

// Stop listening to state updates
unsubscribe()

/****** RENDER *****/

// Create the renderer, can use autoDetectRenderer for Canvas fallback
let renderer = new WebGLRenderer(
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

// mainLoop();







var stage = new Container()
stage.addChild(store.getState()['stage'])
renderer.render(stage);







var stage = new Container()
var rect = new Graphics()
rect.beginFill(0xFFFFFF);
rect.drawRect(0, 0, 300, 200);
stage.addChild(rect)
renderer.render(stage);


var stage = new Container()
var rect = new Graphics()
rect.beginFill(0xFFFFFF);
rect.drawRect(0, 0, 300, 200);
stage.addChild(rect)
renderDisplayObject(rect, renderTarget)
// renderer.render(stage);



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
