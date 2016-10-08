const canvas=document.getElementById("flicker")
var context = canvas.getContext("2d")

context.canvas.width  = innerWidth
context.canvas.height = window.innerHeight
window.addEventListener('storage', function(e) {  
  if (e.key=="signalLight") {
    // document.body.style.backgroundColor = e.newValue
    // context.clearRect(0, 0, WIDTH, HEIGHT)
    context.fillStyle = e.newValue
    context.fillRect(0, 0, canvas.width, canvas.height);
  }
})