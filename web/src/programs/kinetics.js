const metadata = {name: "kinetics", version: "0.1.0"}

let stimuli = []
let group
let meta

// "kinetic wedge" of different gap sizes
// .1 second steps through 6 seconds
for (let i=12; i<=6*120; i=i+12) {
	meta = {group: r.uuid()}
	group = [
		new Wait(120, meta),
		new Solid(120, "white", meta),
		new Wait(i, meta),
		new Solid(120, "white", meta),
		new Wait(120, meta)
	]
	stimuli.push(group)
}

// 5 repetitions
for (let i = 0; i < 5; i++) {
	r.shuffle(stimuli)
	for (let group of stimuli) {
		for (let stimulus of group) {
			yield stimulus
		}
	}
}
