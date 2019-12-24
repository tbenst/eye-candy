/************************************************
REDUX (GLOBAL STATE)
************************************************/

const createStore = Redux.createStore
const applyMiddleware = Redux.applyMiddleware
SimpleIDB.initialize()

// (function() {
//   'use strict';
//
//   //check for support
//   if (!('indexedDB' in window)) {
//     console.log('This browser doesn\'t support IndexedDB');
//     return;
//   }
//
//   var dbPromise = idb.open('eye-candy-db', 1);
//
// })();

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
    frameNum: 0,
    stimulusIndex: -1,
    stimulusQueue: [],
    graphics: []
}


// USE THIS FOR NO LOGGER
let store = createStore(eyeCandyApp, storeInitialState)

// USE THIS FOR LOGGER
// let store = createStore(eyeCandyApp, storeInitialState, applyMiddleware( logger ))

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
socket.heartbeatTimeout = 6000000; // long render workaround
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

async function loadImageForStimulus(stimulus, preRenderHash) {
    let imageSrc
    let image = new Image()
    if (stimulus.value !== undefined &&
        stimulus.value.image !== undefined &&
        typeof(stimulus.value.image)==="number") {
        // retrieve image from indexedDB
        try {
            imageSrc = await SimpleIDB.get(preRenderHash+"-render-"+stimulus.value.image)
            image.src = imageSrc
            stimulus.value.image = image
        } catch (err) {
            console.warn("Failed to get preRender: " + err)
        }
    } else if (stimulus.value !== undefined &&
        stimulus.value.image !== undefined &&
        typeof(stimulus.value.image)==="string") {
            console.log("queueStim inside elif", stimulus)
            image.src = stimulus.value.image
            stimulus.value.image = image
        }
    console.log("queueStim post if", stimulus)
    // if stimulus.value.image already an image, do nothing
    return stimulus
}

// console.log("COOKIE",document.cookie)
async function loadPreRenderForStimuli(stimulusQueue) {
    let stimulus
    const preRenderHash = localStorage.getItem("preRenderHash")
    for (s in stimulusQueue) {
        stimulus = stimulusQueue[s]
        stimulus = await loadImageForStimulus(stimulus, preRenderHash)
    }
    return stimulusQueue
}

socket.on("run", async (stimulusQueue) => {
    // TODO load preRender images
    console.log("socket 'run'")
    stimulusQueue = await loadPreRenderForStimuli(stimulusQueue)
    store.dispatch(setStimulusQueueAC(stimulusQueue))
    store.dispatch(setStatusAC(STATUS.STARTED))
})

socket.on("video", async (stimulusQueue) => {
    // TODO load preRender images
    console.log("socket 'video'")
    stimulusQueue = await loadPreRenderForStimuli(stimulusQueue)
    store.dispatch(setStimulusQueueAC(stimulusQueue))
    store.dispatch(setStatusAC(STATUS.VIDEO))
})

function hashCode(string) {
    var hash = 0;
    if (string.length == 0) {
        return hash;
    }
    for (var i = 0; i < string.length; i++) {
        var char = string.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

function hashPreRenders(args) {
    const height = store.getState()["windowHeight"]
    const width = store.getState()["windowWidth"]
    const hash = hashCode(height+"_"+width+"_"+args)
    return hash
}

async function checkPreRenders(preRenderHash) {
    const nframes = await SimpleIDB.get(preRenderHash)

}

const loadBarChannel = new BroadcastChannel('loadProgress');


socket.on("pre-render", async (preRender) => {
    // TODO should be in store...
    const preRenderHash = hashPreRenders(preRender.args)
    localStorage.setItem("preRenderHash", preRenderHash)
    const cachedNframes = await SimpleIDB.get(preRenderHash + "-nframes")
    const renderPrefix = preRenderHash + "-render-"
    const keys = await SimpleIDB.getKeysWithPrefix(renderPrefix)
    console.log("keys, value, cachedNframes", keys, cachedNframes)
    let preRenderIsCached = keys.length == cachedNframes
    if (!preRenderIsCached) {
        eval(preRender.func)
        console.log("finished preRender func eval, about to render...")
        let nFrames = preRender.args[0] // by convention
        // show 1% bar to indicate start of load
        loadBarChannel.postMessage(1)
        let renderGenerator = preRenderFunc(...preRender.args)
        let renderItem = renderGenerator.next()
        let render = renderItem.value
        let n = 0

        while ( renderItem.done===false) {
            // note: assumes that render is a canvas
            // localStorage.setItem("render-"+n, render.toDataURL())
            try {
                await SimpleIDB.set(renderPrefix+n, render.toDataURL())
            } catch (e) {
                console.warn("SimpleIDB failed to set render-"+n)
            }
            // localStorage.setItem("render-"+n, JSON.stringify(render))
            renderItem = renderGenerator.next()
            render = renderItem.value
            n++
            console.log("loadProgress (stim)", n/nFrames)
            loadBarChannel.postMessage(100*n/nFrames)
        }
        try {
            await SimpleIDB.set(preRenderHash + "-nframes", n)
        } catch (e) {
            console.warn("SimpleIDB failed to set nFrames")
        }
        console.log("finished render")
    } else {
        console.log("using preRender cache")
        loadBarChannel.postMessage(100)
    }

    socket.emit("renderResults", {sid: localStorage.getItem('sid')})

})

socket.on("reset", () => {
    console.log("socket 'reset'")
    // TODO next line causes TypeError: document.querySelector(...) is null on reset
    store.dispatch(resetAC())
    loadBarChannel.postMessage(0)

    // remove preRenders
    // SimpleIDB.clearAll()
    // Object.entries(localStorage).map(
    // Object.entries(localStorage).map(
    //         x => x[0]
    //     ).filter(
    //         x => x.substring(0,7)=="render-"
    //     ).map(
    //         x => SimpleIDB.remove(x).catch(e => {
    //             console.warn("SimpleIDB failed to delete " + x)
    //         }))
            // x => localStorage.removeItem(x))
})

socket.on("target", () => {
    store.dispatch(resetAC())
    store.dispatch(setStimulusQueueAC(
        [{stimulusType: STIMULUS.TARGET, lifespan: 60000,
        backgroundColor: "black"}]))
    store.dispatch(setStatusAC(STATUS.STARTED))
})

socket.on("play-video", vidSrc => {
    document.querySelector("#video").src = vidSrc
})

socket.on('stream',function(image){
            $('#play').attr('src',image);
            $('#logger').text(image);
        });

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
