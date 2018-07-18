function sendFrame(canvas, frameNum, time, stimulusIndex) {
    socket.emit('addFrame',
        {sid: localStorage.getItem('sid'), png: canvas.toDataURL(), frameNum: frameNum, time: time, stimulusIndex: stimulusIndex})
}

function serverRender() {
    socket.emit('renderVideo',
    {sid: localStorage.getItem('sid')})
}
