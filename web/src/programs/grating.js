const metadata = {name: "grating", version: "0.1.2"}


let repetitions = 75
let durations = [2]
let angles = [PI/4]
let speeds = [200]
let nsizes = 8
let startLogMAR = 2.1
let logMarStep = 0.1


function logMARtoPx(logMAR, pxPerDegree=7.5) {
    let degrees = pow(10,logMAR)/60
    return round(degrees*pxPerDegree)
}

function inverseAngle(angle) {
    return (angle + PI) % (2*PI)
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

let stimuli = []
let left
let right
let before
let after
let id
let cohort

for (let size of sizes) {
    for (let angle of angles) {
        for (let speed of speeds) {
            for (let duration of durations) {
                for (let i = 0; i < repetitions; i++) {
                    // use cohort to maintain balance in analysis
                    cohort = r.uuid()
                    before = new Wait(1, {group: id})
                    
                    id = r.uuid()
                    left = new Grating(duration,"black", speed, size, angle, "white",
                        {group: id, cohort: cohort, class: "FORWARD", block: true})
                    after = new Wait(r.randi(1,1.5), {group: id, block: true})
                    stimuli.push([before,left,after])
                    
                    id = r.uuid()
                    meta = {group: id, block: true}
                    right = new Grating(duration,"black", speed, size, inverseAngle(angle), "white",
                        {group: id, cohort: cohort, class: "REVERSE", block: true})
                    after = new Wait(r.randi(1,1.5), {group: id, block: true})
                    stimuli.push([before,right,after])
                }
            }
        }
    }
}

r.shuffle(stimuli)

let stimulusGenerator = measureIntegrity(flatten(stimuli))
for (let s of stimulusGenerator) {
    yield s
}
