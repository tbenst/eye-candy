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
                    context.strokeStyle = "#ff0000"

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
                case GRAPHIC.LETTER:
                    // context.fillStyle = graphic.color
                    ctx.font = '48px serif';
                    context.fillText(graphic.letter, graphic.x, graphic.y)
                    break
            }
            context.restore()
        })
    // }
}


var lastTime = window.performance.now()
function renderLoop() {
    var curTime = window.performance.now()

    const frameTime = curTime - lastTime
    lastTime = curTime


    switch (store.getState().status) {
        case STATUS.STOPPED:
            context.clearRect(0, 0, WIDTH, HEIGHT)
            document.body.style.backgroundColor = "black"
            break
        case STATUS.FINISHED:
            context.clearRect(0, 0, WIDTH, HEIGHT)
            document.body.style.backgroundColor = "black"
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

fetch("/window", {
    method: "POST",
    headers: {
        windowHeight: store.getState()["windowHeight"],
        windowWidth: store.getState()["windowWidth"]
    },
    credentials: "include"
})

socket.on("run", (stimulusQueue) => {
    store.dispatch(setStimulusQueueAC(stimulusQueue))
    store.dispatch(setStatusAC(STATUS.STARTED))
})

socket.on("reset", () => {
    store.dispatch(resetAC())

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
                credentials: "include"
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