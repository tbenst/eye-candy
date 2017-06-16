
/***********************************************
DISPATCHERS
************************************************/

function graphicsDispatcher() {
    const state = store.getState()
    const stimulus = state.stimulus
    console.log("in graphicsDispatcher", stimulus)
    switch (stimulus.stimulusType) {
        case STIMULUS.BAR:
            if (stimulus.age === 0) {
                console.log("len is 0")
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
        case STIMULUS.GRATING:
            if (stimulus.age === 0) {
                gratingDispatcher(stimulus.lifespan, stimulus.width, stimulus.barColor, stimulus.backgroundColor,
                    stimulus.speed, stimulus.angle)
                // increment count by 1 after bar is dispatched
            }
            break
        case STIMULUS.CHECKERBOARD:
            if (stimulus.age === 0) {
                checkerboardDispatcher(stimulus.lifespan, stimulus.size,
                    stimulus.color,stimulus.alternateColor, stimulus.angle)
            }
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

function uniformLetterDispatcher(lifespan, letter, size, padding, color) {
    // body...
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

function gratingDispatcher(lifespan, width, barColor, backgroundColor, speed, angle) {

    var canvasPattern = document.createElement("canvas");
    canvasPattern.width = width*2;
    canvasPattern.height = width;
    var contextPattern = canvasPattern.getContext("2d");

    contextPattern.fillStyle =  backgroundColor
    contextPattern.fillRect(0, 0, canvasPattern.width, canvasPattern.height);

    contextPattern.fillStyle = barColor
    contextPattern.fillRect(0, 0, width, width)

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
    const nextStimulus = state.stimulusQueue[stimulusIndex]

    if (nextStimulus.done===true) {
        store.dispatch(setStatusAC(STATUS.FINISHED)) 
        store.dispatch(setSignalLightAC(SIGNAL_LIGHT.STOPPED))
    } else {
        store.dispatch(incrementStimulusIndexAC())
        store.dispatch(setStimulusAC(nextStimulus.value))
        store.dispatch(setGraphicsAC([]))
    }

}

async function queueStimulusDispatcher() {
    const stimulus = await nextStimulus()
    const stimulusIndex = stimulus.stimulusIndex
    store.dispatch(addStimulusAC(stimulus, stimulusIndex))
}
