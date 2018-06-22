const metadata = {name: "grating-contrast", version: "0.1.0"}


let repetitions = 25
let durations = [1]
// 0 is 1 (max) contrast, -1 is 0.1 contrast, -2 is 0.01
// -2.2 is minimal contrast, <=-2.3 is same color for 8 bit color
let startLogContrast = 0
let logContrastStep = -0.1
let ncontrasts = 5
let angles = [PI/4]
let speed = 100
let nsizes = 6
let startLogMAR = 1.8
let logMarStep = 0.2


function linearToHex(f) {
    // gamma compress linear light intensity between zero and one
    let n = Math.round(Math.pow(f,1/2.2)*255)
    let hex =""
    if (n < 10) {hex = "0"}
    hex = hex + n.toString(16)
    return "#"+hex+hex+hex
}

function logContrastToLinear(logC) {
    let c = pow(10,logC)/2
    return [0.5+c, 0.5-c]
}

function logMARtoPx(logMAR, pxPerDegree=12.524) {
    let degrees = pow(10,logMAR)/60
    return round(degrees*pxPerDegree)
}

function inverseAngle(angle) {
    return (angle + PI) % (2*PI)
}


let sizes = [...Array(nsizes).keys()].map(
    x => x*logMarStep+startLogMAR).map(
    x => logMARtoPx(x))



let colors = [...Array(ncontrasts).keys()].map(
    x => x*logContrastStep+startLogContrast).map(
    logC => logContrastToLinear(logC).map(
        c => linearToHex(c)))


function* measureIntegrity(stimuli,every=5*60) {
    // every N seconds, do a flash
    let integrityMeta
    let elapsedTime = every
    for (let s of stimuli) {
        if (elapsedTime>=every && s.metadata.block===undefined) {
            integrityMeta = {group: r.uuid(), label: "integrity"}
            yield new Wait(1, integrityMeta)
            yield new Solid(0.5, "white", integrityMeta)
            yield new Wait(2, integrityMeta)
            elapsedTime = 0
            yield s
        } else {
            yield s
        }
        elapsedTime=elapsedTime+s["lifespan"]
    }
}

function* insertBreaks(stimuli,every=10*60) {
    // every N seconds, do a WAIT
    let integrityMeta
    let elapsedTime = 0
    for (let s of stimuli) {
        if (elapsedTime>=every && s.metadata.block===undefined) {
            integrityMeta = {group: r.uuid(), label: "break"}
            yield new Wait(60, integrityMeta)
            elapsedTime = 0
            yield s
        } else {
            yield s
        }
        elapsedTime=elapsedTime+s["lifespan"]
    }
}

let stimuli = []
let left
let right
let before
let after
let id
let cohort

for (let size of sizes) {
    for (let angle of angles) {
        for (let colorPair of colors) {
            for (let duration of durations) {
                for (let i = 0; i < repetitions; i++) {
                    // use cohort to maintain balance in analysis
                    cohort = r.uuid()
                    before = new Wait(1, {group: id})

                    id = r.uuid()
                    left = new Grating(duration,colorPair[0], speed, size, angle, colorPair[1],
                        {group: id, cohort: cohort, class: "FORWARD", block: true})
                    after = new Wait(r.randi(1,1.5), {group: id, block: true})
                    stimuli.push([before,left,after])

                    id = r.uuid()
                    meta = {group: id, block: true}
                    right = new Grating(duration,colorPair[0], speed, size, inverseAngle(angle), colorPair[1],
                        {group: id, cohort: cohort, class: "REVERSE", block: true})
                    after = new Wait(r.randi(1,1.5), {group: id, block: true})
                    stimuli.push([before,right,after])
                }
            }
        }
    }
}

r.shuffle(stimuli)

stimuli = insertBreaks(measureIntegrity(flatten(stimuli)))

function* stimulusGenerator(renderResults) {
    for (s of stimuli) {
        yield s
    }
}
