/************************************************
REDUX (GLOBAL STATE)
************************************************/
import {SimpleIDB} from '/js/simpleIDB.js'
import {createStore, applyMiddleware} from '/js/redux.js'
import {eyeCandyApp} from '/js/reducers.js'
import * as actionsExports from '/js/actions.js';
Object.entries(actionsExports).forEach(([name, exported]) => window[name] = exported);
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

export const storeInitialState = {
    windowHeight: window.innerHeight,
    windowWidth: window.innerWidth,
    status: STATUS.STOPPED,
    signalLight: SIGNAL_LIGHT.STOPPED,
    time: 0,
    frameNum: 0,
    stimulusIndex: -1,
    stimulusQueue: [],
    graphics: [],
    startDate: ""
}


// USE THIS FOR NO LOGGER
// export let store = createStore(eyeCandyApp, storeInitialState)

// USE THIS FOR LOGGER
export let store = createStore(eyeCandyApp, storeInitialState, applyMiddleware( logger ))

// GET FROM SERVER (NOT OPERATIONAL)
// let store = createStore(todoApp, window.STATE_FROM_SERVER)


/************************************************
CANVAS
************************************************/

export const canvas=document.getElementById("eyecandy")
export var context = canvas.getContext("2d")
export const WIDTH = store.getState()["windowWidth"]
export const HEIGHT = store.getState()["windowHeight"]
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

export let socket = io();
socket.heartbeatTimeout = 6000000; // long render workaround
export let sid

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

export async function loadImageForStimulus(stimulus, preRenderHash) {
    // TODO https://developer.mozilla.org/en-US/docs/Web/API/ImageBitmapRenderingContext/transferFromImageBitmap
    let image
    if (stimulus.value !== undefined &&
        stimulus.value.image !== undefined &&
        typeof(stimulus.value.image)==="number") {
        // retrieve image from indexedDB
        try {
            image = await SimpleIDB.get(preRenderHash+"-render-"+stimulus.value.image)
            // image.src = imageSrc
            // image.transferFromImageBitmap(imageSrc)
            // image.src = imageSrc
            stimulus.value.image = image
        } catch (err) {
            console.warn("Failed to get preRender: " + err)
        }
    } else if (stimulus.value !== undefined &&
        stimulus.value.image !== undefined &&
        typeof(stimulus.value.image)==="string") {
            image = new Image()
            console.log("queueStim inside elif", stimulus)
            image.src = stimulus.value.image
            stimulus.value.image = image
        }
    console.log("queueStim post if", stimulus, "hash", preRenderHash)
    // if stimulus.value.image already an image, do nothing
    return stimulus
}

// console.log("COOKIE",document.cookie)
async function loadPreRenderForStimuli(stimulusQueue) {
    let stimulus
    const preRenderHash = localStorage.getItem("preRenderHash")
    for (let s in stimulusQueue) {
        stimulus = stimulusQueue[s]
        stimulus = await loadImageForStimulus(stimulus, preRenderHash)
    }
    return stimulusQueue
}

socket.on("run", async ({stimulusQueue, date}) => {
    console.log("socket 'run'")
    store.dispatch(setStartDate(date))
    stimulusQueue = await loadPreRenderForStimuli(stimulusQueue)
    store.dispatch(setStimulusQueueAC(stimulusQueue))
    store.dispatch(setStatusAC(STATUS.STARTED))
})

socket.on("video", async ({stimulusQueue, date}) => {
    console.log("socket 'video' (save-video)")
    store.dispatch(setStartDate(date))
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
    const hash = hashCode(height+"_"+width+"_"+JSON.stringify(args))
    return hash
}

async function checkPreRenders(preRenderHash) {
    const nframes = await SimpleIDB.get(preRenderHash)

}


// this paradigm requires 1 message to 1 message out
let wwResolves = {}
let wwRejects = {}
let wwMsgId = -1 // first message is 0
// queue of available web workers
// Activate calculation in the worker, returning a promise
function wwSendMsg(worker, payload){
    wwMsgId = wwMsgId + 1
    const msg = {
        wwMsgId: wwMsgId,
        payload: payload
    }
    return new Promise(function (resolve, reject) {
      // save callbacks for later
      wwResolves[wwMsgId] = resolve
      wwRejects[wwMsgId] = reject
      worker.postMessage(msg)
    }) 
  }
// Handle incoming calculation result
function handleMsg(msg) {
    // console.log("msg from WW", msg)
    const {wwMsgId, err, payload} = msg.data
    // console.log("wwMsgId", wwMsgId)
    if (err) {
        console.warn("WW error:", err);
        // error condition
        const reject = wwRejects[wwMsgId]
        if (reject) {
            reject(err)
        }
    }
    else  {
        // console.log("wwResolves", wwResolves)
        const resolve = wwResolves[wwMsgId]
        if (resolve) {
            if (payload) {
                resolve(payload)
            } else {
                resolve()
            }
        }       
    }
    // purge used callbacks
    delete wwResolves[wwMsgId]
    delete wwRejects[wwMsgId]
}
  

const loadBarChannel = new BroadcastChannel('loadProgress');
async function preRenderWebWorkers(preRender, preRenderHash, renderPrefix) {
    // preRender is object sent from eval.js
    // preRenderHash is a hash of the preRenderArgs
    // renderPrefix is used to prepend key for IndexedDB

    // TODO first test with eg letters-saccade or binary noise
    // then see how parallelization goes
    // parallelize the preRendering as possible using webworkers
    // work is done in njobs chunks
    // also need to respond on RESET
    
    // validate that func can be evaluated (give stack trace to console)
    console.log("preRenderWW")
    
    console.log("eval preRenderFunc...")
    const preRenderFuncStr = preRender.func
    const preRenderFunc = (new Function('return ' + preRenderFuncStr))()
    console.log("about to render...")
    // console.log("preRenderFuncStr", preRenderFuncStr)
    const args = preRender.args
    const nJobs = args.nJobs

    // console.log("preRenderWW args: ", args)

    if (nJobs>0) {
        // use webworkers
        console.log(`Using webworkers to render ${nJobs}`)
        loadBarChannel.postMessage({nJobs: nJobs})
        let workerIdx
        let promises = []
        for (let n=0; n<nJobs; n++) {
            workerIdx = n % nProcs
            // browser will queue
            // console.log("pushing to WW. startIdx", args.startIdx[n])
            promises.push(wwSendMsg(webWorkers[workerIdx],
                {preRenderFuncStr: preRenderFuncStr, preRenderHash: preRenderHash,
                 windowWidth: WIDTH, windowHeight: HEIGHT, args: args[n],
                renderPrefix: renderPrefix, startIdx: args.startIdx[n]}
            ))
        }
        console.log("awaiting web workers...");
        await Promise.all(promises)
        console.log("all web workers finished");
        
    } else if (args) {
        console.log("awaiting web worker...");
        // TODO why is promise not resolving?
        await wwSendMsg(webWorkers[0],
            {preRenderFuncStr: preRenderFuncStr, preRenderHash: preRenderHash,
             windowWidth: WIDTH, windowHeight: HEIGHT, args: args.args,
            renderPrefix: renderPrefix, startIdx: 0}
        )
        console.log("web worker finished")
    }


    console.log("finished render")
}

let nProcs = navigator.hardwareConcurrency
function initWebWorkers() {
    for (let n=0; n < nProcs; n++) {
        webWorkers.push(new Worker('js/preRender.js', { type: "module" }))
        webWorkers[n].onmessage = handleMsg
    }
}

function resetWebWorkers() {
    for (const ww of webWorkers) {
        ww.terminate()
    }
    webWorkers = []
    initWebWorkers()
}


socket.on("pre-render", async (preRender) => {
    // console.log("socket got pre-render", preRender)
    const preRenderHash = hashPreRenders(preRender.args)
    // TODO should be in store...
    localStorage.setItem("preRenderHash", preRenderHash)
    // TODO allow reset to kill these SimpleIDB gets--perhaps by doing in webworker?
    const cachedNframes = await SimpleIDB.get(preRenderHash + "-nframes")
    const renderPrefix = preRenderHash + "-render-"
    const keys = await SimpleIDB.getKeysWithPrefix(renderPrefix)
    // console.log("keys, value, cachedNframes", keys, cachedNframes)
    let preRenderIsCached = keys.length == cachedNframes
    if (!preRenderIsCached) {
        console.log(`preRendering as see ${keys.length} keys but ${cachedNframes} cachedNframes`);
        
        await preRenderWebWorkers(preRender, preRenderHash, renderPrefix)
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
    resetWebWorkers()
    // for good measure, reload stimuli page
    // causes problems with "load" as this trigger reset
    // but doesn't wait for page to be ready
    // TODO load should wait for stimulus.html to be ready
    // location.reload() 
    
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

socket.on('stream',function(image){
            $('#play').attr('src',image);
            $('#logger').text(image);
        });

export async function nextStimulus() {
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


let webWorkers = []
initWebWorkers()
