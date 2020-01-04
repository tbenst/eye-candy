import { canvasRecorder, registerFrame,
  stopRecorder, startRecorder, canvas } from "/js/captureCanvas.js";


var context = canvas.getContext("2d")
const WIDTH = canvas.width
const HEIGHT = canvas.height

const testBar = {
  "graphicType": "BAR",
  "color": "white",
  "size": {
      "width": 20,
      "height": 300
  },
  "speed": 10,
  "angle": 0,
  "position": {
      "r": 30,
      "theta": 0
  },
  "origin": {
      "x": HEIGHT/2,
      "y": WIDTH/2
  }
}

function renderBar(context, graphic) {
  // might need to translate first if rotation
  context.translate(graphic.origin.x,
      graphic.origin.y)
  context.fillStyle = graphic.color
  // Rotate rectangle to be perpendicular with Center of Canvas
  context.rotate(graphic.position.theta)
  // Draw a rectangle, adjusting for Bar width
  context.fillRect(Math.round(-graphic.size.width/2), Math.round(-graphic.size.height/2),
      graphic.size.width, graphic.size.height)
}

var initTime
function renderLoop(time) {
  if (!initTime) initTime = time;
  context.clearRect(0, 0, WIDTH, HEIGHT)

  context.save()
  // first 5 seconds is black, last 5 seconds is white
  if ((time - initTime) % 10000 > 5000) {
    context.fillStyle = "white"
  } else {
    context.fillStyle = "black"
  }
  context.fillRect(0, 0, canvas.width, canvas.height);
  renderBar(context, testBar)

  setTimeout(() => {
    // mimic expensive rendering
    registerFrame(0,time,0)
  }, 10)

  context.restore()
  requestAnimationFrame(renderLoop)
}

renderLoop()

// record first 2 seconds (black)
// sleep 4 seconds (black -> white)
// record next 2 seconds (white)
console.log("start")
startRecorder()
setTimeout(event => {
  console.log("stop")
  stopRecorder()
  setTimeout(event => {
    console.log("start")
    startRecorder()
    setTimeout(event => {
      console.log("stop")
      stopRecorder()
    }, 2000)
  }, 4000)
}, 2000)