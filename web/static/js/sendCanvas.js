function canvasToBlob(canvas) {
  return new Promise(function(resolve, reject) {
    canvas.toBlob(function(blob) {
      resolve(blob)
    })
  })
}

function sendFrame(canvas, frameNum, time, stimulusIndex) {
    canvasToBlob(canvas).then(blob => {
        socket.emit('addFrame',
            // TODO: toDataURL is taking 14-65ms!!!
            // {sid: localStorage.getItem('sid'), png: canvas.toDataURL(), frameNum: frameNum, time: time, stimulusIndex: stimulusIndex})
            // {sid: localStorage.getItem('sid'), png: canvas.toDataURL(), frameNum: frameNum, time: time, stimulusIndex: stimulusIndex})
            {sid: localStorage.getItem('sid'), png: blob, frameNum: frameNum, time: time, stimulusIndex: stimulusIndex})
    })
}

function serverRender() {
    socket.emit('renderVideo',
    {sid: localStorage.getItem('sid')})
}
