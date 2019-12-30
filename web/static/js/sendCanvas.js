export function canvasToBlob(canvas) {
  return new Promise(function(resolve, reject) {
    canvas.toBlob(function(blob) {
      resolve(blob)
    })
  })
}

export function sendFrame(canvas, frameNum, time, stimulusIndex) {
    // toDataURL takes 14-65ms!!! hence this version
    canvasToBlob(canvas).then(blob => {
        socket.emit('addFrame',
            {sid: localStorage.getItem('sid'), png: blob, frameNum: frameNum, time: time, stimulusIndex: stimulusIndex})
    })
}

export function serverRender() {
    socket.emit('renderVideo',
    {sid: localStorage.getItem('sid')})
}
