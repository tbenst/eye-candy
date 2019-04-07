const metadata = {name: "single-video", version: "0.1.0"}

let stimuli = []
let meta = {}

let repetitions = 1

// custom template of dollar sign with curly, will regex sub
// TODO hardcoded for godfather...
// stimuli.push(new Video(5, "black", "${VID_SRC}", meta))

for (var i = 0; i < repetitions; i++) {
    // Video(lifespan, backgroundColor, src, startTime, metadata)
    stimuli.push(new Video(262, "black", "${VID_SRC}", 0, meta))
}


function* stimulusGenerator(renderResults) {
    for (s of stimuli) {
        yield s
    }
}
