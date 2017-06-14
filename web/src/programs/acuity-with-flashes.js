const metadata = {name: "acuity-with-flashes", version: "0.4.2"}

let widths = [...Array(12).keys()].map(x => (x+1)*10)
let speeds = [...Array(8).keys()].map(x => (1+x)*100)
// 12 angles, offset by 22 degrees to reduce diamond artifact
let angles = [...Array(12).keys()].map(x => (x*2+1)*PI/12)
let stimuli = []

let width
let lifespan
let id

for (let speed of speeds) {
	for (let width of widths) {
		lifespan = calcBarLifespan(speed,width,windowHeight,windowWidth)
		id = r.uuid()

		for (let angle of angles) {
			integrityMeta = {group: r.uuid(), label: "integrity"}
			stimuli.push([
				new Wait(1, integrityMeta),
				new Solid(1, "white", integrityMeta),
				new Wait(1, integrityMeta),
				new Bar(lifespan,"black", speed, width, angle, "white",
					{group: id})
			])
		}
	}
}

r.shuffle(stimuli)

let stimulusGenerator = flatten(stimuli)
for (let s of stimulusGenerator) {
	yield s
}
