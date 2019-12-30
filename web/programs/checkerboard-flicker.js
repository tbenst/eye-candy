const metadata = {name: "checkerboard-flicker", version: "0.1.0", inverted: false}

let repetitions = 15
let durations = [1]
// 0 is 1 (max) contrast, -1 is 0.1 contrast, -2 is 0.01
// -2.2 is minimal contrast, <=-2.3 is same color for 8 bit color
let startLogContrast = 0
let logContrastStep = -0.1
let ncontrasts = 8
let flickerDuration = 0.1
let angle = PI/4
let nsizes = 8
let startLogMAR = 1.9
let logMarStep = 0.1



function logMARtoPx(logMAR, pxPerDegree=12.524) {
    let degrees = pow(10,logMAR)/60
    return round(degrees*pxPerDegree)
}


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

function checkerboard_group(class1, target, duration, flickerDuration, size, cohort, colorPair) {
    const id = r.uuid()
    let color
    if (class1=='A') {
        color = colorPair
    } else if (class1=='B') {
        color = [colorPair[1], colorPair[0]]
    }
    let group = []

    group.push(new Wait(1, {group: id}))

    let time = 0
    let i = 0
    let color1
    let color2
    while (time+flickerDuration<=duration) {
        if (target=='SAME') {
            color1 = color[0]
            color2 = color[1]
        } else if (target=='DIFFERENT') {
            color1 = color[i % 2]
            color2 = color[(i+1)%2]
        }
        group.push(new Checkerboard(flickerDuration, color1, color2, size, angle,
            {group: id, cohort: cohort, block: true, class: class1,
                target: target}))
        i++
        time = time + flickerDuration
    }

    group.push(new Wait(r.randi(60,75)/60, {group: id, block: true}))
    return group
}

let x
let y
let stimuli = []
let l
let before
let after
let id
let cohort

for (let size of sizes) {
    for (let colorPair of colors) {
        for (let duration of durations) {
            for (let i = 0; i < repetitions; i++) {
                // use cohort to maintain balance in analysis
                cohort = r.uuid()
                stimuli.push(checkerboard_group('A','SAME', duration,flickerDuration, size, cohort, colorPair))
                stimuli.push(checkerboard_group('A','DIFFERENT', duration,flickerDuration, size, cohort, colorPair))
                stimuli.push(checkerboard_group('B','SAME', duration,flickerDuration, size, cohort, colorPair))
                stimuli.push(checkerboard_group('B','DIFFERENT', duration,flickerDuration, size, cohort, colorPair))
            }
        }
    }
}

r.shuffle(stimuli)

let stimulusGenerator = measureIntegrity(flatten(stimuli))
for (let s of stimulusGenerator) {
    yield s
}
