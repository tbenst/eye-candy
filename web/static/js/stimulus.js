/************************************************
REDUX (GLOBAL STATE)
************************************************/

const createStore = Redux.createStore
const applyMiddleware = Redux.applyMiddleware


/***********************************************
MIDDLEWARE
************************************************/

function logger({ getState }) {
    return (next) => (action) => {
        console.log("will dispatch", action)

        // Call the next dispatch method in the middleware chain.
        let returnValue = next(action)

        console.log("state after dispatch", getState())

        // This will likely be the action itself, unless
        // a middleware further in chain changed it.
        return returnValue
    }
}


/************************************************
STORE
************************************************/

const storeInitialState = {
    windowHeight: window.innerHeight,
    windowWidth: window.innerWidth,
    status: STATUS.STOPPED,
    signalLight: SIGNAL_LIGHT.STOPPED,
    time: 0,
    stimulusIndex: 0,
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

const canvas=document.getElementById("eyecandy")
var context = canvas.getContext("2d")
const WIDTH = store.getState()["windowWidth"]
const HEIGHT = store.getState()["windowHeight"]
context.canvas.width  = WIDTH
context.canvas.height = HEIGHT


/************************************************
TESTS
************************************************/


const testBar = {
    "graphicType": "BAR",
    "color": "white",
    "size": {
        "width": 20,
        "height": 1727.934315881249
    },
    "speed": 10,
    "angle": 0,
    "position": {
        "r": 1727.934315881249,
        "theta": 0
    },
    "origin": {
        "x": 2457.434315881249,
        "y": 493
    }
}


/***********************************************
PROGRAM / server communication
************************************************/

var socket = io();
let sid

fetch("/get-sid", {
    method: "GET"
}).then(function(response) {  
    return response.text()  
  }).then(function(newSid) {
    sid = newSid
    console.log("got sid of:", newSid)
    localStorage.setItem('sid', newSid)
    fetch("/window", {
        method: "POST",
        headers: {
            windowHeight: store.getState()["windowHeight"],
            windowWidth: store.getState()["windowWidth"],
            sid: sid
        },
        credentials: "include"
    })
})  



// console.log("COOKIE",document.cookie)


socket.on("run", (stimulusQueue) => {
    console.log("socket 'run'")
    store.dispatch(setStimulusQueueAC(stimulusQueue))
    store.dispatch(setStatusAC(STATUS.STARTED))
})

let renders

socket.on("pre-render", (preRender) => {
    // TODO dangerous, insecure
    // but hey, it's science!
    // also, this is client side so not *so* bad..
    
    console.log("socket 'pre-render':", preRender)
    eval(preRender.func)

    let renderResults = preRenderFunc(...preRender.args)
    renders = renderResults.renders

    socket.emit("renderResults", {renderResults: renderResults.yield,
                                  sid: localStorage.getItem('sid')})

})

socket.on("reset", () => {
    console.log("socket 'reset'")
    store.dispatch(resetAC())
    renders = undefined

})

socket.on("target", () => {
    store.dispatch(resetAC())
    store.dispatch(setStimulusQueueAC(
        [{stimulusType: STIMULUS.TARGET, lifespan: 60000,
        backgroundColor: "black"}]))
    store.dispatch(setStatusAC(STATUS.STARTED))
})

async function nextStimulus() {
    try {
        var stimulus = await (await fetch("/next-stimulus", {
                method: "POST",
                credentials: "include",
                headers: {
                    sid: sid
                }
           })).json()
    } catch (err) {
        console.error(err);
    }
   return stimulus
}


/************************************************
RUN
************************************************/
renderLoop()