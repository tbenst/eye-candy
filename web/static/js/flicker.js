const canvas=document.getElementById("flicker")
var context = canvas.getContext("2d")

canvas.width  = window.innerWidth
canvas.height = window.innerHeight

function renderLoop() {
    if (context.getImageData(1,1,1,1).data[0]===255) {
        localStorage.setItem("newStimulus", false)
    }
    
    if (localStorage.getItem("newStimulus")==="true") {
        context.fillStyle = "white"
        context.fillRect(0, 0, canvas.width, canvas.height);
        // verify it was drawn
    } else {
        context.fillStyle = localStorage.getItem("signalLight")
        context.fillRect(0, 0, canvas.width, canvas.height);       
    }
    requestAnimationFrame(renderLoop)
}

renderLoop()