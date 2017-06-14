const metadata = {name: "wedge", version: "0.2.0"}


// "light wedge" of different durations
let solid = []

// .1 second steps through 6 seconds
for (let i=0.1; i<=6; i=i+0.1) {
	solid.push(new Solid(i))
}

yield new Wait(2)
// 5 repetitions
for (let i = 0; i < 5; i++) {
	r.shuffle(solid)
	for (let stimulus of solid) {
		yield stimulus
		yield new Wait(2)
	}
}
