import { socket, canvas, context, WIDTH, HEIGHT, sid } from "/js/store.js";
// TODO: make toBlob run in WebWorker
export function canvasToBlob(canvas) {
  return new Promise(function(resolve, reject) {
    canvas.toBlob(function(blob) {
      resolve(blob)
    })
  })
}

export function sendFrame(canvas, frameNum, time, stimulusIndex) {
    // TODO rethink. each frame is 1000x1000x4=4MB
    // at 60fps, that's 240MB/s !!! 868 GB / hr !!!!
    // https://jsperf.com/serialize-canvas/
    // SOLUTION?!? https://developers.google.com/web/updates/2016/10/capture-stream
    // will VP9 be up to the task for binary noise?
    
    //
    // toDataURL takes 14-65ms!!!
    // toBlob is faster, but still too slow
    // hence this version

    // this sends empty frames :/
    // createImageBitmap(canvas, 0, 0, WIDTH, HEIGHT).then(blob => {
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

    // 5 fps with socket yikes (4MB per frame)
    // let blob = context.getImageData(0, 0, WIDTH, HEIGHT).data.buffer;
    
    // maybe faster but only 300kb per frame??!
    let blob = canvas.toDataURL()

    /////// GENERIC socket for blob
    socket.emit('addFrame',
      {sid: localStorage.getItem('sid'), png: blob, frameNum: frameNum, time: time, stimulusIndex: stimulusIndex})
    
    /////// GENERIC POST for blob
    // fetch('/addFrame', {
    //   method: 'POST',
    //   credentials: 'include',
    //   headers: {
    //     sid: sid,
    //     framenum: frameNum,
    //     time: time,
    //     stimulusindex: stimulusIndex,
    //     png: blob
    //   }
    // });


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
