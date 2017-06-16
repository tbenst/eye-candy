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

function renderTarget(context, graphic) {
    context.strokeStyle = "#ff0000"

    context.beginPath()
    context.arc(HEIGHT/2,HEIGHT/2,HEIGHT/2,0,2*PI)
    context.stroke()

    context.beginPath()
    context.arc(HEIGHT/2,HEIGHT/2,HEIGHT/3,0,2*PI)
    context.stroke()

    context.beginPath()
    context.arc(HEIGHT/2,HEIGHT/2,HEIGHT/5,0,2*PI)
    context.stroke()

    context.beginPath()
    context.arc(HEIGHT/2,HEIGHT/2,HEIGHT/10,0,2*PI)
    context.stroke()

    context.beginPath()
    context.arc(HEIGHT/2,HEIGHT/2,HEIGHT/100,0,2*PI)
    context.stroke()

    context.rect(0,0,HEIGHT,HEIGHT)
    context.stroke()
}

function renderPattern(context, pattern,angle) {
    context.fillStyle = pattern;
    context.translate(WIDTH/2,HEIGHT/2)
    context.rotate(-angle)
    const diag = getDiagonalLength()
    context.translate(-diag/2,-diag/2)
    context.fillRect(0,0, diag, diag);

}

function renderGrating(context, pattern, width, angle, position) {
    context.fillStyle = pattern;
    // move to the center of the canvas
    context.translate(WIDTH/2,HEIGHT/2)
    context.rotate(-angle)
    const diag = getDiagonalLength()
    context.translate(-diag/2,-diag/2)
    const x = width*2 - position
    context.translate(x,0)
    context.fillRect(-width*2,0, diag+width*2, diag);

}



function render(state) {
    context.clearRect(0, 0, WIDTH, HEIGHT)
    document.body.style.backgroundColor = state.stimulus.backgroundColor

    // if (state.graphics != undefined) {
        state.graphics.forEach(graphic => {
            context.save()
            switch (graphic.graphicType) {
                case GRAPHIC.BAR:
                    renderBar(context, graphic)
                    break
                case GRAPHIC.TARGET:
                    renderTarget(context, graphic)
                    break
                case GRAPHIC.PATTERN:
                    renderPattern(context, graphic.pattern, graphic.angle)
                    break
                case GRAPHIC.GRATING:
                    renderGrating(context, graphic.pattern, graphic.width, graphic.angle, graphic.position)
                    break
                case GRAPHIC.LETTER:
                    context.fillStyle = graphic.color
                    context.font = graphic.size+'px Sloan'
                    context.fillText(graphic.letter, graphic.x, graphic.y)
                    break
            }
            context.restore()
        })
    // }
}


var lastTime
function renderLoop(time) {
    if (!lastTime) lastTime = time;

    // seconds
    const timeDelta = (time - lastTime)/1000
    lastTime = time


    switch (store.getState().status) {
        case STATUS.STOPPED:
            context.clearRect(0, 0, WIDTH, HEIGHT)
            document.body.style.backgroundColor = "black"
            break
        case STATUS.FINISHED:
            context.clearRect(0, 0, WIDTH, HEIGHT)
            document.body.style.backgroundColor = "black"
            break
        case STATUS.STARTED:
            tickDispatcher(timeDelta)
            render(store.getState())
            break
    }
    requestAnimationFrame(renderLoop)
}

