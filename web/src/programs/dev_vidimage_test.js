const metadata = {name: "single-video", version: "0.1.0"}

let stimuli = []
let meta = {}

let repetitions = 5

// custom template of dollar sign with curly, will regex sub
// TODO hardcoded for godfather...
// stimuli.push(new Video(5, "black", "videos/godfather_michael_4min.mp4", meta))

for (var i = 0; i < repetitions; i++) {
    // Video(lifespan, backgroundColor, src, startTime, metadata)
    stimuli.push(new Video(5, "black", "videos/godfather_michael_4min.mp4", 0, meta))
stimuli.push(new Image(5, "black", "images/fish.png", undefined, meta))
}


function* stimulusGenerator(renderResults) {
    for (s of stimuli) {
        yield s
    }
}