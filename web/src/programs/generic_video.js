const metadata = {name: "generic-video", version: "0.1.0"}

let stimuli = []
let meta = {}

stimuli.push!(new Video(1000, "black", DATADIR+"videos/cropped.mp4", meta))


function* stimulusGenerator(renderResults) {
    for (s of stimuli) {
        yield s
    }
}
