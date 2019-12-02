const metadata = {name: "test", version: "0.1.0"}

let stimuli = []
let meta = {}

stimuli.push(new Wait(1, meta))
stimuli.push(new Solid(2, "white", meta))
stimuli.push(new Wait(1, meta))


function* stimulusGenerator() {
    for (s of stimuli) {
        yield s
    }
}
