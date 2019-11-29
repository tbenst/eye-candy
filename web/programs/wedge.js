const metadata = {name: "wedge", version: "0.3.0"}


// "light wedge" of different durations
let solid = []
let meta
// .1 second steps through 6 seconds
for (let i=0.1; i<=6; i=i+0.1) {
	meta = {group: r.uuid()}
	group = []
	group.push(new Wait(1, meta))
	group.push(new Solid(i, "white", meta))
	group.push(new Wait(1, meta))
	solid.push(group)
}

let stimuli = []
// 5 repetitions
for (let i = 0; i < 5; i++) {
	r.shuffle(solid)
	for (let group of solid) {
		for (let stimulus of group)
		stimuli.push(stimulus)
	}
}

stimuli = stimuli

function* stimulusGenerator() {
    for (s of stimuli) {
        yield s
    }
}