const metadata = {name: "checkerboard-contrast", version: "0.3.0", inverted: false}
// 0.3 introduces new gamma compression

let repetitions = 25
let durations = [0.5]
// 0 is 1 (max) contrast, -1 is 0.1 contrast, -2 is 0.01
// -2.2 is minimal contrast, <=-2.3 is same color for 8 bit color
let logContrast = [0, -1, -2.3]
let linearColors = [[0.55,0.45],[0.75,0.25],[1,0]]
let angle = PI/4
let nsizes = 8
let startLogMAR = 2.1
let logMarStep = 0.1


function linearToHex(f) {
    // gamma compress linear light intensity between zero and one
    let n = Math.round(Math.pow(f,1/2.4)*255)
    let hex =""
    if (n < 10) {hex = "0"}
    hex = hex + n.toString(16)
    return "#"+hex+hex+hex
}

function logContrastToLinear(logC) {
    let c = pow(10,logC)/2
    return [0.5+c, 0.5-c]
}

function logMARtoPx(logMAR, pxPerDegree=7.5) {
    let degrees = pow(10,logMAR)/60
    return round(degrees*pxPerDegree)
}


let sizes = [...Array(nsizes).keys()].map(
    x => x*logMarStep+startLogMAR).map(
    x => logMARtoPx(x))

let colors = logContrast.map(
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

function checkerboard_group(class1, class2, duration, size, cohort, colorPair) {
    const id = r.uuid()
    let target
    let color1
    let color2
    if (class1=='A') {
        color1 = colorPair
    } else {
        color1 = [colorPair[1], colorPair[0]]
    }

    if (class2=='A') {
        color2 = colorPair
    } else {
        color2 = [colorPair[1], colorPair[0]]
    }

    if (class1===class2) {
        target = 'SAME'
    } else {
        target = 'DIFFERENT'
    }
    const before = new Wait(1, {group: id})
    const first = new Checkerboard(duration, color1[0], color1[1], size, angle,
        {group: id, cohort: cohort, block: true, class: class1,
                   target: target})
    const second = new Checkerboard(duration, color2[0], color2[1], size, angle,
        {group: id, cohort: cohort, block: true, class: class2,
                   target: target})
    const after = new Wait(r.randi(1,1.5), {group: id, block: true})
    return [before, first, second, after]
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
                stimuli.push(checkerboard_group('A','B', duration,size,
                    cohort, colorPair))
                stimuli.push(checkerboard_group('A','A', duration,size,
                    cohort, colorPair))
                stimuli.push(checkerboard_group('B','B', duration,size,
                    cohort, colorPair))
                stimuli.push(checkerboard_group('B','A', duration,size,
                    cohort, colorPair))
            }
        }
    }
}

r.shuffle(stimuli)

let stimulusGenerator = measureIntegrity(flatten(stimuli))
for (let s of stimulusGenerator) {
    yield s
}
