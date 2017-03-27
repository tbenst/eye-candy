const metadata = {name: "kinetics", version: "0.2.0"}

let stimuli = []
let group = []
let meta
let onTime = 120

// "kinetic wedge" of different gap sizes
// .1 second steps through 6 seconds
for (let i=12; i<=6*120; i=i+12) {
	meta = {group: r.uuid()}
	group = []
	group.push(new Wait(120, meta))
	// 5 repetitions
	group.push(new Solid(onTime, "white", meta))
	for (let j = 0; j < 4; j++) {
		group.push(new Wait(i, meta))
		group.push(new Solid(onTime, "white", meta))
	}
	group.push(new Wait(120, meta))

	stimuli.push(group)
}


r.shuffle(stimuli)
for (let group of stimuli) {
	for (let stimulus of group) {
		yield stimulus
	}
}
