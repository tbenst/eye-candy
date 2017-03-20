const metadata = {name: "letters", version: "0.1.0", inverted: false}

let repetitions = 12
let sizes = [200,400,600]
let durations = [60,120,180]


function* measureIntegrity(stimuli,every=5*60) {
    // every N seconds, do a flash
    let integrityMeta
    let elapsedTime = every
    for (let s of stimuli) {
        if (elapsedTime>=every && !s.metadata.block) {
            integrityMeta = {group: r.uuid(), label: "integrity"}
            yield new Wait(120, integrityMeta)
            yield new Solid(60, "white", integrityMeta)
            yield new Wait(240, integrityMeta)
            elapsedTime = 0
            yield s
        } else {
            yield s
            elapsedTime=elapsedTime+s["lifespan"]/120
        }
    }
}

let letters = ["C", "D", "H", "K", "N", "O", "R", "S", "V", "Z"]
let x
let y
let stimuli = []
let l
let before
let after
let id
let cohort

for (let i = 0; i < repetitions; i++) {
    for (let size of sizes) {
        for (let duration of durations) {
            cohort = r.uuid(i)
            for (let letter of letters) {
                id = r.uuid(i)
                // block means "do not insert a integrity check before me"
                // backgroundColor, letter, x, y, size, color
                x = windowWidth/2 - size/2
                y = windowHeight/2 + size/2
                l = new Letter(duration, "black", letter,x,y,size, 
                    "white", {group: id, cohort: cohort, block: true})
                before = new Wait(r.randi(60,120), {group: id})
                after = new Wait(r.randi(60,120), {group: id, block: true})

                // before + lit + after = lifespan
                // this pads the white flash
                stimuli.push([before, l, after])
            }
        }
    }
}

r.shuffle(stimuli)

let stimulusGenerator = measureIntegrity(flatten(stimuli))
for (let s of stimulusGenerator) {
    yield s
}
