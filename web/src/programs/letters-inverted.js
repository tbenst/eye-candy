const metadata = {name: "letters", version: "0.2.0", inverted: true}

let repetitions = 12
let sizes = [200,400,600]
let durations = [0.5,1,1.5]


function* measureIntegrity(stimuli,every=5*60) {
    // every N seconds, do a flash
    let integrityMeta
    let elapsedTime = every
    for (let s of stimuli) {
        if (elapsedTime>=every && s.metadata.block===undefined) {
            integrityMeta = {group: r.uuid(), label: "integrity"}
            yield new Solid(1, "white",integrityMeta)
            yield new Solid(0.5, "black", integrityMeta)
            yield new Solid(2, "white",integrityMeta)
            elapsedTime = 0
            yield s
        } else {
            yield s
        }
        elapsedTime=elapsedTime+s["lifespan"]
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
                l = new Letter(duration, "white", letter,x,y,size, 
                    "black", {group: id, cohort: cohort, block: true})
                before = new Solid(1, "white", {group: id})
                after = new Solid(r.randi(0.5,1), "white", {group: id, block: true})

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
