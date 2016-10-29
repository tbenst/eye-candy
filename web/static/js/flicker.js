const canvas=document.getElementById("flicker")
var context = canvas.getContext("2d")

canvas.width  = window.innerWidth
canvas.height = window.innerHeight

// let i = 0
// function renderLoop() {
//     if (i%60 == 0) {
//         console.log("flash")
//         context.fillStyle = "white"
//         context.fillRect(0, 0, canvas.width, canvas.height);
//     } else {
//         context.fillStyle = "black"
//         context.fillRect(0, 0, canvas.width, canvas.height);       
//     }
//     i++
//     requestAnimationFrame(renderLoop)
// }

function renderLoop() {
    if (localStorage.getItem("newStimulus")==="true") {
        context.fillStyle = "white"
        context.fillRect(0, 0, canvas.width, canvas.height);
        localStorage.setItem("newStimulus", false)
    } else {
        context.fillStyle = localStorage.getItem("signalLight")
        context.fillRect(0, 0, canvas.width, canvas.height);       
    }
    requestAnimationFrame(renderLoop)
}

renderLoop()