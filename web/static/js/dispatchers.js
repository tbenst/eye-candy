
/***********************************************
DISPATCHERS
************************************************/

function graphicsDispatcher() {
    const state = store.getState()
    const stimulus = state.stimulus
    // console.log("in graphicsDispatcher", stimulus)
    // console.log("stim type", stimulus.stimulusType)
    switch (stimulus.stimulusType) {
        case STIMULUS.BAR:
            if (stimulus.age === 0) {
                // console.log("len is 0")
                barDispatcher(stimulus.lifespan, stimulus.width, stimulus.barColor, stimulus.backgroundColor,
                    stimulus.speed, stimulus.angle)
            }
            break
        case STIMULUS.TARGET:
            store.dispatch(setGraphicsAC([{
                graphicType: GRAPHIC.TARGET,
                age: 0,
                lifespan: 6000
            }]))
            break
        case STIMULUS.LETTER:
            // TODO wrap in an if ?
            store.dispatch(setGraphicsAC([{
                graphicType: GRAPHIC.LETTER,
                letter: stimulus.letter,
                lifespan: stimulus.lifespan,
                size: stimulus.size,
                color: stimulus.color,
                // backgroundColor: stimulus.backgroundColor,
                x:  stimulus.x,
                y: stimulus.y,
                age: 0
            }]))
            break
        case STIMULUS.EYECHART:
            if (stimulus.age === 0) {
                eyeChartDispatcher(stimulus.lifespan, stimulus.letterMatrix, stimulus.size,
                    stimulus.padding, stimulus.color)
            }
            break
        case STIMULUS.IMAGE:
            if (stimulus.age === 0) {
                imageDispatcher(stimulus.lifespan,
                    stimulus.backgroundColor, stimulus.image,
                    stimulus.fixationPoint)
            }
            break
        case STIMULUS.VIDEO:
            if (stimulus.age === 0) {
                videoDispatcher(stimulus.lifespan,
                    stimulus.backgroundColor, stimulus.src,
                    stimulus.startTime)
            }
            break
        case STIMULUS.GRATING:
            if (stimulus.age === 0) {
                gratingDispatcher(stimulus.lifespan, stimulus.width, stimulus.barColor, stimulus.backgroundColor,
                    stimulus.speed, stimulus.angle)
                // increment count by 1 after bar is dispatched
            }
            break
        case STIMULUS.SINUSOIDAL_GRATING:
            if (stimulus.age === 0) {
                gratingDispatcher(stimulus.lifespan, stimulus.width, stimulus.barColor, stimulus.backgroundColor,
                    stimulus.speed, stimulus.angle,
                    sinusoidal=true)
                // increment count by 1 after bar is dispatched
            }
            break
        case STIMULUS.CHIRP:
            if (stimulus.age === 0) {
                chirpDispatcher(stimulus.lifespan, stimulus.f0,
                    stimulus.f1, stimulus.a0, stimulus.a1,
                    stimulus.t1, stimulus.phi)
            }
            break
        case STIMULUS.CHECKERBOARD:
            if (stimulus.age === 0) {
                checkerboardDispatcher(stimulus.lifespan, stimulus.size,
                    stimulus.color,stimulus.alternateColor, stimulus.angle)
            }
            break
        case STIMULUS.TILED_LETTER:
            if (stimulus.age === 0) {
                // checkerboardDispatcher(stimulus.lifespan, stimulus.size,
                    // stimulus.color,stimulus.backgroundColor, stimulus.angle)
                tiledLetterDispatcher(stimulus.lifespan, stimulus.letter, stimulus.size,
                    stimulus.padding, stimulus.color,stimulus.backgroundColor, stimulus.angle)
            }
            break
    }
}


function eyeChartDispatcher(lifespan, letterMatrix, size, padding, color) {
    const height = store.getState()["windowHeight"]
    const width = store.getState()["windowWidth"]
    const fullSize  = size + padding
    const numberOfRows = Math.ceil(height/fullSize)
    const numberOfCols = Math.ceil(width/fullSize)

    for (var i = 0; i < numberOfRows; i++) {
        for (var j = 0; j < numberOfCols; j++) {
            store.dispatch(addGraphicAC({
                graphicType: GRAPHIC.LETTER,
                x: j*fullSize+padding/2,
                y: i*fullSize+size+padding/2,
                letter: letterMatrix[i][j],
                size: size,
                color: color,
                lifespan: lifespan,
                age: 0
            }))
        }
    }
}


function imageDispatcher(lifespan, backgroundColor, image,
                                fixationPoint) {
    let img = new Image()
    // TODO test if deleting onload messes up image src on server
    // img.onload = (event) => {
    //     if (fixationPoint===undefined) {
    //         fixationPoint = {x: img.width / 2, y: img.height / 2}
    //     }
    //     store.dispatch(setGraphicsAC([{
    //             graphicType: GRAPHIC.IMAGE,
    //             image: img,
    //             fixationPoint: fixationPoint,
    //             lifespan: lifespan,
    //             age: 0
    //     }]))
    // }
    if (typeof(image)==="string") {
        // assume image src (get from server)
        img.src = image
    } else {
        // TODO can this be deleted? Or maybe used for older letter rendering?
        img = image
    }

    if (fixationPoint===undefined) {
        // race condition?
        fixationPoint = {x: img.width / 2, y: img.height / 2}
    }

    store.dispatch(setGraphicsAC([{
            graphicType: GRAPHIC.IMAGE,
            image: img,
            fixationPoint: fixationPoint,
            lifespan: lifespan,
            age: 0
    }]))
}

function videoDispatcher(lifespan, backgroundColor, src, startTime) {
    let video = document.createElement("video")
    // add extra 1s to endTime to avoid loop to begining if expiration of stimulus happens late
    const endTime = startTime + lifespan + 1
    // construct media fragment to stream only desired clip
    const timeStr = "#t=" + startTime + "," + endTime
    video.src = src + timeStr
    video.preload = "auto" // this means yes
    video.autoPlay = false
    video.loop = false
    video.muted = true
    // TODO might not run if cached..?
    video.addEventListener('durationchange', (event) => {
        const scale = Math.min(
                             WIDTH / video.videoWidth,
                             HEIGHT / video.videoHeight);

        store.dispatch(setGraphicsAC([{
                graphicType: GRAPHIC.VIDEO,
                video: video,
                scale: scale,
                lifespan: lifespan,
                age: 0
        }]))
    })
}

function tiledLetterDispatcher(lifespan, letter, size, padding, color, backgroundColor, angle) {
    var canvasPattern = document.createElement("canvas");
    canvasPattern.width = size+padding;
    canvasPattern.height = size+padding;
    var contextPattern = canvasPattern.getContext("2d");

    contextPattern.fillStyle = backgroundColor
    contextPattern.fillRect(0, 0, canvasPattern.width, canvasPattern.height);

    contextPattern.fillStyle = color
    contextPattern.font = size+'px Sloan'
    contextPattern.fillText(letter, padding/2, padding/2+size)

    var pattern = context.createPattern(canvasPattern,"repeat");

    store.dispatch(addGraphicAC({
        graphicType: GRAPHIC.PATTERN,
        pattern: pattern,
        angle: angle,
        lifespan: lifespan,
        age: 0
    }))
}

function checkerboardDispatcher(lifespan, size,color,alternateColor, angle) {

    var canvasPattern = document.createElement("canvas");
    canvasPattern.width = size*2;
    canvasPattern.height = size*2;
    var contextPattern = canvasPattern.getContext("2d");

    contextPattern.fillStyle = alternateColor
    contextPattern.fillRect(0, 0, canvasPattern.width, canvasPattern.height);

    contextPattern.fillStyle = color
    contextPattern.fillRect(0, 0, size, size)
    contextPattern.fillRect(size, size, size, size)

    var pattern = context.createPattern(canvasPattern,"repeat");

    store.dispatch(addGraphicAC({
        graphicType: GRAPHIC.PATTERN,
        pattern: pattern,
        angle: angle,
        lifespan: lifespan,
        age: 0
    }))
}

function barDispatcher(lifespan, width, barColor, backgroundColor, speed, angle,
    startR=getDiagonalLength()/2) {

    store.dispatch(addGraphicAC({
        graphicType: GRAPHIC.BAR, age: 0, color: barColor, size: {width: width,
            height: getDiagonalLength()}, speed: speed, angle: angle,
            lifespan: lifespan, startR: startR
    }))
}

function gratingDispatcher(lifespan, width, barColor, backgroundColor, speed, angle, sinusoidal=false) {

    var canvasPattern = document.createElement("canvas")
    canvasPattern.width = width*2
    canvasPattern.height = width
    var contextPattern = canvasPattern.getContext("2d")

    // console.log("GRATING")
    if (sinusoidal) {
        let maxColor = colorToRGB(barColor)
        let minColor = colorToRGB(backgroundColor)
        let colorScale = {}
        colorScale.r = (maxColor.r-minColor.r)/2
        colorScale.g = (maxColor.g-minColor.g)/2
        colorScale.b = (maxColor.b-minColor.b)/2

        let scale, graphicType
        let rgb = {}
        for (var x = 0; x < width*2; x++) {
            scale = sin(x/width*PI)
            // (b-a)/2 * sin(x) + a + (b-a)/2
            rgb.r = Math.round(colorScale.r * scale + minColor.r + colorScale.r)
            rgb.g = Math.round(colorScale.g * scale + minColor.g + colorScale.g)
            rgb.b = Math.round(colorScale.b * scale + minColor.b + colorScale.b)
            contextPattern.fillStyle = rgbToHex(rgb)
            contextPattern.fillRect(x, 0, x+1, canvasPattern.height)
        }
    } else {
        contextPattern.fillStyle =  backgroundColor
        contextPattern.fillRect(0, 0, canvasPattern.width, canvasPattern.height);

        contextPattern.fillStyle = barColor
        contextPattern.fillRect(0, 0, width, width)
    }
    // console.log("MADE PATTERN")
    var pattern = context.createPattern(canvasPattern,"repeat");

    store.dispatch(addGraphicAC({
        graphicType: GRAPHIC.GRATING,
        width: width,
        speed: speed,
        angle: angle,
        pattern: pattern,
        lifespan: lifespan,
        age: 0
    }))
}

function chirpDispatcher(lifespan, f0, f1, a0, a1, t1, phi) {
    const scale = Math.cos(phi)
    // stay centered around gray
    const colorVal = Math.round(a0 * scale + 127.5)
    const initColor = {r: colorVal, g: colorVal, b: colorVal}

    store.dispatch(addGraphicAC({
        graphicType: GRAPHIC.CHIRP,
        f0: f0,
        f1: f1,
        a0: a0,
        a1: a1,
        t1: t1,
        phi: phi,
        color: rgbToHex(initColor),
        // TODO remove
        debug: "updated",
        lifespan: lifespan,
        age: 0
    }))
}

function removeGraphicDispatcher(index) {
    store.dispatch(removeGraphicAC(index))
}

function cleanupGraphicsDispatcher() {
    const graphics = store.getState().graphics
    for (var i = 0; i < graphics.length; i++) {
        const graphic = graphics[i]
        if (graphic.age >= graphic.lifespan) {
            removeGraphicDispatcher(i)
        }
    }
}

// The mother of all dispatchers: the render loop affects the world
// by dispatching a time tick
function tickDispatcher(timeDelta) {
    const state = store.getState()

    // initialize for time=0
    if (state.stimulus!=undefined ) {
        store.dispatch(timetickAC(timeDelta))
        store.dispatch(stimulusTickAC(timeDelta))
    }

    // check if stimulus expired then update signal light
    if (state.stimulus===undefined ||
        state.stimulus.age >= state.stimulus.lifespan) {

        newStimulusDispatcher()
    }
    switch(state.signalLight) {
        case SIGNAL_LIGHT.STOPPED:
            store.dispatch(setSignalLightAC(SIGNAL_LIGHT.FRAME_A))
            break
        case SIGNAL_LIGHT.FRAME_A:
            store.dispatch(setSignalLightAC(SIGNAL_LIGHT.FRAME_B))
            break
        case SIGNAL_LIGHT.FRAME_B:
            store.dispatch(setSignalLightAC(SIGNAL_LIGHT.FRAME_A))
            break
    }
    // graphicsDispatcher will initialize graphics
    graphicsDispatcher()
    // graphicsTickAC will initialize correct position
    store.dispatch(graphicsTickAC(timeDelta))
    cleanupGraphicsDispatcher()
}

function newStimulusDispatcher() {
    queueStimulusDispatcher()
    const state = store.getState()
    const stimulusIndex = state.stimulusIndex
    const nextStimulus = state.stimulusQueue[stimulusIndex+1]

    if (nextStimulus.done===true) {
        store.dispatch(setStatusAC(STATUS.FINISHED))
        store.dispatch(setSignalLightAC(SIGNAL_LIGHT.STOPPED))
        if (state.status==STATUS.VIDEO) {
            serverRender()
        }
    } else {
        store.dispatch(incrementStimulusIndexAC())
        store.dispatch(setStimulusAC(nextStimulus.value))
        store.dispatch(setGraphicsAC([]))
        // For debugging, may be useful to remove this such that stimulusQueue is not removed after being shown
        store.dispatch(removeStimulusValueAC(stimulusIndex))
    }

}

async function queueStimulusDispatcher() {
    const stimulus = await nextStimulus()
    const stimulusIndex = stimulus.stimulusIndex
    const preRenderHash = localStorage.getItem("preRenderHash")
    let image
    if (stimulus.value !== undefined &&
        stimulus.value.image !== undefined &&
        typeof(stimulus.value.image)==="number") {
        // retrieve image from indexedDB
        try {
            image = await SimpleIDB.get(preRenderHash+"-render-"+stimulus.value.image)
            stimulus.value.image = image
        } catch (err) {
            console.warn("Failed to get preRender: " + err)
        }
    }
    store.dispatch(addStimulusAC(stimulus, stimulusIndex))
}
