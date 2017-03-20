
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
                barDispatcher(stimulus.width, stimulus.barColor, stimulus.backgroundColor,
                    stimulus.speed, stimulus.angle, stimulus.lifespan)
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
                backgroundColor: stimulus.backgroundColor,
                x:  stimulus.x,
                y: stimulus.y,
                age: 0
            }]))
            break
        case STIMULUS.GRATING:
            if (stimulus.age === 0) {
                const lifespan = calcBarLifespan(speed, width)
                barDispatcher(stimulus.width, stimulus.barColor, stimulus.backgroundColor,
                    stimulus.speed, stimulus.angle)
                // increment count by 1 after bar is dispatched
                store.dispatch(setStimulusAC(Object.assign({}, stimulus, {
                    count: stimulus.count + 1
                })))
            }
            
            // console.log("XXX grating comparison", stimulus.speed / 120 * stimulus.age)
            // console.log(">= XXX grating comparison", stimulus.wavelength * stimulus.count)

            gratingDispatcherHelper()
            break
        case STIMULUS.CHECKERBOARD:
            if (stimulus.age === 0) {
                checkerboardDispatcher(stimulus.time,stimulus.size,stimulus.period,stimulus.color,stimulus.alternateColor)
            } else {
                 if (stimulus.age > stimulus.period * stimulus.count / 2 * 120) {
                    if (stimulus.count % 2 == 0) {
                        store.dispatch(setStimulusAC(Object.assign({}, stimulus, {
                            count: stimulus.count+1,
                            backgroundColor: stimulus.alternateColor,
                        })))
                    } else {
                        store.dispatch(setStimulusAC(Object.assign({}, stimulus, {
                            count: stimulus.count+1,
                            backgroundColor: stimulus.color,
                        })))
                    }
                 }
            }
    }
}

function checkerboardDispatcher(time,size,period,color,alternateColor) {
    const height = store.getState()["windowHeight"]
    const width = store.getState()["windowWidth"]
    const numberOfRows = Math.ceil(height/size)
    const numberOfCols = Math.ceil(width/size)
    // we will only create every other square and alternate colors with the background
    for (var i = 0; i < numberOfCols; i=i+2) {
        for (var j = 0; j < numberOfRows; j=j+2) {
            store.dispatch(addGraphicAC({
                graphicType: GRAPHIC.CHECKER,
                startX: i*size,
                startY: j*size,
                size: size,
                period: period, 
                color: color,
                alternateColor: alternateColor,
                count: 1,
                lifespan: time*120,
                age: 0
            }))
        }
    }

    for (var i = 1; i < numberOfCols; i=i+2) {
        for (var j = 1; j < numberOfRows; j=j+2) {
            store.dispatch(addGraphicAC({
                graphicType: GRAPHIC.CHECKER,
                startX: i*size,
                startY: j*size,
                size: size,
                period: period, 
                color: color,
                alternateColor: alternateColor,
                count: 1,
                lifespan: time*120,
                age: 0
            }))
        }
    }
}

function barDispatcher(width, barColor, backgroundColor, speed, angle, lifespan,
    startR=getDiagonalLength()/2) {

    store.dispatch(addGraphicAC({
        graphicType: GRAPHIC.BAR, age: 0, color: barColor, size: {width: width,
            height: getDiagonalLength()}, speed: speed, angle: angle,
            lifespan: lifespan, startR: startR
    }))
}

function gratingDispatcherHelper() {

    const state = store.getState()
    const stimulus = state.stimulus

    // first bar is reference origin
    const originR = getDiagonalLength()/2
    const distanceTraveled = stimulus.speed / 120 * stimulus.age
    const refOrigin = originR - distanceTraveled


    // adjust for > 0 or else wavelength will be off
    // due to frame timing
    // refOrigin must have move by at least this much to dispatch new bar
    let count = stimulus.count
    let nextStartDistance = stimulus.wavelength * count

    // user can give numberOfBars or time. 
    if (stimulus.numberOfBars===undefined || count<stimulus.numberOfBars) {
        // aggregate position (distance traveled) spawns new bars
        // once equal to wavelength
        // 500 / 120 * 290 >= 300 * 0
        if (distanceTraveled  >= nextStartDistance) {
            console.log("XXX will dispatch new bar ", refOrigin+nextStartDistance)
            const startR = refOrigin + nextStartDistance
            const lifespan = calcBarLifespan(speed, width, startR)
            barDispatcher(stimulus.width, stimulus.barColor, stimulus.backgroundColor,
                stimulus.speed, stimulus.angle, lifespan, startR)
            // we use count to keep track of how many bars have been
            // cumulatively dispatched
            count = count + 1
            store.dispatch(setStimulusAC(Object.assign({}, stimulus, {
                count: count
            })))
        }

        // need to have bars at least speed / 120 * 3 pixels past originR (3 frames)
        // const bufferDistance = stimulus.speed / 120 * 3
        nextStartDistance = stimulus.wavelength * count

        // This likely creates stack problems with large numbers of bars (eg <10 width and <10 wavelength)
        if (distanceTraveled  >= nextStartDistance) {
            gratingDispatcherHelper()
        }
    }
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
