const metadata = {name: "letters", version: "0.2.0", inverted: false}

let repetitions = 40
let durations = [120]

let sizes = [1000,500,250,125,75,50,25]


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
        cohort = r.uuid()
        for (let i = 0; i < repetitions; i++) {
            id = r.uuid()
            a = new Checkerboard(duration, "white", "black", size,
                duration, {group: id, cohort: cohort, block: true, class: 'A'})
            before = new Wait(120, {group: id})
            after = new Wait(r.randi(60,120), {group: id, block: true})
            stimuli.push([before, a, after])

            id = r.uuid()
            b = new Checkerboard(duration, "black", "white", size,
                duration, {group: id, cohort: cohort, block: true, class: 'B'})
            before = new Wait(120, {group: id})
            after = new Wait(r.randi(60,120), {group: id, block: true})
            stimuli.push([before, b, after])
        }
    }
}

r.shuffle(stimuli)

let stimulusGenerator = measureIntegrity(flatten(stimuli))
for (let s of stimulusGenerator) {
    yield s
}
