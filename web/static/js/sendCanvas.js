import { socket, canvas, WIDTH, HEIGHT, sid } from "/js/store.js";
// TODO: make toBlob run in WebWorker
export function canvasToBlob(canvas) {
  return new Promise(function(resolve, reject) {
    canvas.toBlob(function(blob) {
      resolve(blob)
    })
  })
}

export function sendFrame(canvas, frameNum, time, stimulusIndex) {
    // toDataURL takes 14-65ms!!!
    // toBlob is faster, but still too slow
    // hence this version

    // this sends empty frames :/
    // createImageBitmap(canvas).then(blob => {
    //     socket.emit('addFrame',
    //         {sid: localStorage.getItem('sid'), png: blob, frameNum: frameNum, time: time, stimulusIndex: stimulusIndex})
    // })

    // can't do this with rendering context
    // let offscreen = canvas.transferControlToOffscreen();

    // createImageBitmap(canvas).then(bitmap => {
    //   let offscreen = new OffscreenCanvas(WIDTH, HEIGHT)
    //   let offContext = offscreen.getContext("bitmaprenderer");
    //   offContext.transferFromImageBitmap(bitmap)
    //   let blob = offscreen.convertToBlob()
    //   socket.emit('addFrame',
    //       {sid: localStorage.getItem('sid'), png: blob, frameNum: frameNum, time: time, stimulusIndex: stimulusIndex})
    // })


    // // do this in WW?
    // let blob = offscreen.convertToBlob()

    // // let blob = JSON.stringify(canvas)
    // socket.emit('addFrame',
    //   {sid: localStorage.getItem('sid'), png: blob, frameNum: frameNum, time: time, stimulusIndex: stimulusIndex})

    // bad images (can't be read), also still
    // stuck by toBlob

    // canvasToBlob(canvas).then(blob => {
    //   fetch('/addFrame', {
    //     method: 'POST',
    //     credentials: 'include',
    //     headers: {
    //       sid: sid,
    //       framenum: frameNum,
    //       time: time,
    //       stimulusindex: stimulusIndex,
    //       png: blob
    //     }
    //   });
    // })

    //   canvasToBlob(canvas).then(blob => {
  //     socket.emit('addFrame',
  //         {sid: localStorage.getItem('sid'), png: blob, frameNum: frameNum, time: time, stimulusIndex: stimulusIndex})
  // })
}

export function serverRender() {
    socket.emit('renderVideo',
    {sid: localStorage.getItem('sid')})
}
