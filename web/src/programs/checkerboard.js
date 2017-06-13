const metadata = {name: "checkerboard", version: "0.2.0", inverted: false}

let repetitions = 50
let durations = [60]
let nsizes = 10
let startLogMAR = 1.6
let logMarStep = 0.2


function logMARtoPx(logMAR, pxPerDegree=7.5) {
    let degrees = pow(10,logMAR)/60
    return round(degrees*pxPerDegree)
}


let sizes = [...Array(nsizes).keys()].map(
    x => x*logMarStep+startLogMAR).map(
    x => logMARtoPx(x))


function* measureIntegrity(stimuli,every=5*60) {
    // every N seconds, do a flash
    let integrityMeta
    let elapsedTime = every
    for (let s of stimuli) {
        if (elapsedTime>=every && s.metadata.block===undefined) {
            integrityMeta = {group: r.uuid(), label: "integrity"}
            yield new Wait(120, integrityMeta)
            yield new Solid(60, "white", integrityMeta)
            yield new Wait(240, integrityMeta)
            elapsedTime = 0
            yield s
        } else {
            yield s
        }
        elapsedTime=elapsedTime+s["lifespan"]/120
    }
}

function checkerboard_group(class1, class2, duration, size, cohort) {
    const id = r.uuid()
    let target
    let color1
    let color2
    if (class1=='A') {
        color1 = ["white","black"]
    } else {
        color1 = ["black", "white"]
    }

    if (class2=='A') {
        color2 = ["white","black"]
    } else {
        color2 = ["black", "white"]
    }

    if (class1===class2) {
        target = 'SAME'
    } else {
        target = 'DIFFERENT'
    }
    const before = new Wait(120, {group: id})
    const first = new Checkerboard(duration, color1[0], color1[1], size,
        {group: id, cohort: cohort, block: true, class: class1,
                   target: target})
    const second = new Checkerboard(duration, color2[0], color2[1], size,
        {group: id, cohort: cohort, block: true, class: class2,
                   target: target})
    const after = new Wait(r.randi(120,180), {group: id, block: true})
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
    for (let duration of durations) {
        for (let i = 0; i < repetitions; i++) {
            // use cohort to maintain balance in analysis
            cohort = r.uuid()
            stimuli.push(checkerboard_group('A','B', duration,size, cohort))
            stimuli.push(checkerboard_group('A','A', duration,size, cohort))
            stimuli.push(checkerboard_group('B','B', duration,size, cohort))
            stimuli.push(checkerboard_group('B','A', duration,size, cohort))
        }
    }
}

r.shuffle(stimuli)

let stimulusGenerator = measureIntegrity(flatten(stimuli))
for (let s of stimulusGenerator) {
    yield s
}
