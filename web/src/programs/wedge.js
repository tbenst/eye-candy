const metadata = {name: "wedge", version: "0.1.1"}


// "light wedge" of different durations
let solid = []

// .1 second steps through 6 seconds
for (let i=12; i<=6*120; i=i+12) {
	solid.push(new Solid(i))
}

yield new Wait(240)
// 5 repetitions
for (let i = 0; i < 5; i++) {
	r.shuffle(solid)
	for (let stimulus of solid) {
		yield stimulus
		yield new Wait(240)
	}
}
