const metadata = {name: "single-video", version: "0.1.0"}

let stimuli = []
let meta = {}

let repetitions = 10

// custom template of dollar sign with curly, will regex sub
// TODO hardcoded for godfather...

for (var i = 0; i < repetitions; i++) {
    // Video(lifespan, backgroundColor, src, startTime, metadata)
    stimuli.push(new Video(5, "black", "videos/godfather_michael_4min.mp4", 5*i, meta))
    stimuli.push(new Image(5, "black", "images/scary_hawk.jpg", undefined, meta))
}


function* stimulusGenerator() {
    for (s of stimuli) {
        yield s
    }
}
