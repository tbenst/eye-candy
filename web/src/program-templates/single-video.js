const metadata = {name: "single-video", version: "0.1.0"}

let stimuli = []
let meta = {}

// custom template of dollar sign with curly, will regex sub
// TODO hardcoded for godfather...
stimuli.push(new Video(5, "black", "${VID_SRC}", meta))
// stimuli.push(new Video(262, "black", "${VID_SRC}", meta))


function* stimulusGenerator(renderResults) {
    for (s of stimuli) {
        yield s
    }
}
