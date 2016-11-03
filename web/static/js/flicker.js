var canvas=document.getElementById("flicker")
var context = canvas.getContext("2d")

canvas.width  = window.innerWidth
canvas.height = window.innerHeight

function numberToColor(f) {
    // gamma compress linear light intensity between zero and one
    let n = Math.ceil((1.055*Math.pow(f,1/2.4)-0.055)*255)
    let hex = n.toString(16)
    return "#"+hex+hex+hex
}

let n
let s
let stimulusIndex
let frame
// once per second
function renderLoop() {
    stimulusIndex = localStorage.getItem("stimulusIndex")
    frame = localStorage.getItem("signalLight")

    if (frame === "STOPPED") {
        context.fillStyle = "black"
    } else {
        if (frame == "FRAME_A") {
            n = -0.075
        } else if (frame == "FRAME_B") {
            n = 0.075
        }
        
        if (stimulusIndex%3===0) {
            s = 0.8
        } else if (stimulusIndex%3===1) {
            s = 0.5
        } else if (stimulusIndex%3===2) {
            s = 0.2
        }
        context.fillStyle = numberToColor(s+n)
    }

    context.fillRect(0, 0, canvas.width, canvas.height);       
    requestAnimationFrame(renderLoop)
}

renderLoop()