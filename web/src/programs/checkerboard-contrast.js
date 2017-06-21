const metadata = {name: "checkerboard-contrast", version: "0.2.4", inverted: false}

let repetitions = 25
let durations = [0.5]
let contrasts = [0,0.1,1]
let angle = PI/4
let nsizes = 8
let startLogMAR = 2.1
let logMarStep = 0.1


function linearToHex(f) {
    // gamma compress linear light intensity between zero and one
    let n = Math.ceil((1.055*Math.pow(f,1/2.4)-0.055)*255)
    let hex = n.toString(16)
    return "#"+hex+hex+hex
}

function logMARtoPx(logMAR, pxPerDegree=7.5) {
    let degrees = pow(10,logMAR)/60
    return round(degrees*pxPerDegree)
}


let sizes = [...Array(nsizes).keys()].map(
    x => x*logMarStep+startLogMAR).map(
    x => logMARtoPx(x))

let colors = contrasts.map(
    x => linearToHex(x))


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

function checkerboard_group(class1, class2, duration, size, cohort, color) {
    const id = r.uuid()
    let target
    let color1
    let color2
    if (class1=='A') {
        color1 = [color,"black"]
    } else {
        color1 = ["black", color]
    }

    if (class2=='A') {
        color2 = [color,"black"]
    } else {
        color2 = ["black", color]
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
    for (let color of colors) {
        for (let duration of durations) {
            for (let i = 0; i < repetitions; i++) {
                // use cohort to maintain balance in analysis
                cohort = r.uuid()
                stimuli.push(checkerboard_group('A','B', duration,size,
                    cohort, color))
                stimuli.push(checkerboard_group('A','A', duration,size,
                    cohort, color))
                stimuli.push(checkerboard_group('B','B', duration,size,
                    cohort, color))
                stimuli.push(checkerboard_group('B','A', duration,size,
                    cohort, color))
            }
        }
    }
}

r.shuffle(stimuli)

let stimulusGenerator = measureIntegrity(flatten(stimuli))
for (let s of stimulusGenerator) {
    yield s
}
