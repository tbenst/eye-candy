import {SimpleIDB} from '/js/simpleIDB.js';
import {DeterministicRandom} from '/js/random.js';
// note: cannot import store due to use of `window`

const loggerChannel = new BroadcastChannel('logger');
loggerChannel.postMessage("Initialized WebWorker.")
// TODO make loadProgress work
// bc.onmessage should be more sophisticated
// perhaps send initial message with nJobs from preRenderWebWorkers
// then push fraction of nJob complete from webworker
// bc.onmessage simply integrates and divides by nJob

const loadBarChannel = new BroadcastChannel('loadProgress');
// Simulate lengthy calculation or an async call
async function doCalculation(preRenderFuncStr, args, preRenderHash,
  windowWidth, windowHeight, renderPrefix ) {

  let nFrames = args[0] // by convention
  // show 1% bar to indicate start of load
  // loadBarChannel.postMessage(1)
  // https://stackoverflow.com/questions/7395686/how-can-i-serialize-a-function-in-javascript
  const preRenderFuncWrapper = (new Function('DeterministicRandom',
    'windowWidth', 'windowHeight', 'return ' + preRenderFuncStr))
  const preRenderFunc = preRenderFuncWrapper(DeterministicRandom, 
    windowWidth, windowHeight)
  let renderGenerator = preRenderFunc(...args)
  let renderItem = renderGenerator.next()
  let render = renderItem.value
  let n = 0
  let err = ""
  let renderBlob
  while ( renderItem.done===false) {
    // note: assumes that render is a canvas
    // localStorage.setItem("render-"+n, render.toDataURL())
    try {
        loggerChannel.postMessage("render frame", n)
        // renderBlob = await render.convertToBlob()
        renderBlob = render.transferToImageBitmap()
        await SimpleIDB.set(renderPrefix+n, renderBlob)
        // await SimpleIDB.set(renderPrefix+n, render.toDataURL())
    } catch (e) {
        err = err + e + "; SimpleIDB failed to set render-"+n
    }
    // localStorage.setItem("render-"+n, JSON.stringify(render))
    renderItem = renderGenerator.next()
    render = renderItem.value
    n++
    loadBarChannel.postMessage(1/nFrames)
  }
  try {
    await SimpleIDB.set(preRenderHash + "-nframes", n)
  } catch (e) {
      err = err + e + "; SimpleIDB failed to set nFrames"
  }
  return {err: err}
}

// Handle incoming messages
self.onmessage = async function(msg) {
  const {wwMsgId, payload} = msg.data
  const { preRenderFuncStr, args, preRenderHash, windowWidth,
    windowHeight, renderPrefix } = payload
  const {err} = await doCalculation(preRenderFuncStr, args, preRenderHash,
    windowWidth, windowHeight, renderPrefix)

  const returnMsg = {
    wwMsgId: wwMsgId,
    err: err
  }
  self.postMessage(returnMsg)
}