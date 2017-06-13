const metadata = {name: "acuity", version: "0.3.2"}

function* measureIntegrity(stimuli,every=5*60) {
	// every N seconds, do a flash
	let integrityMeta
	let elapsedTime = every
	for (let s of stimuli) {
		if (elapsedTime>=every && s.metadata.block===undefined) {
			integrityMeta = {group: r.uuid(), label: "integrity"}
			yield new Wait(1, integrityMeta)
			yield new Solid(0.5, "white", integrityMeta)
			yield new Wait(2, integrityMeta)
			elapsedTime = 0
			yield s
		} else {
			yield s
		}
		elapsedTime=elapsedTime+s["lifespan"]
	}
}

let widths = [...Array(12).keys()].map(x => (x+1)*10)
let speeds = [...Array(8).keys()].map(x => (1+x)*100)
// 12 angles, offset by 22 degrees to reduce diamond artifact
let angles = [...Array(12).keys()].map(x => (x*2+1)*PI/12)
let stimuli = []

let width
let lit
let lifespan
let group = Array(3)
let id
let before
let after
let solid

for (let speed of speeds) {
	for (let width of widths) {
		lifespan = calcBarLifespan(speed,width,windowHeight,windowWidth)
		id = r.uuid()

		for (let angle of angles) {
			stimuli.push(new Bar(lifespan,"black",
				speed, width, angle, "white", {group: id}))
		}
		
		// block means "do not insert a integrity check before me"
		lit = width/speed
		solid = new Solid(lit, "white", {group: id, block: true})
		before = new Wait(floor((lifespan-lit)/2), {group: id})
		after = new Wait(ceil((lifespan-lit)/2), {group: id, block: true})

		// before + lit + after = lifespan
		// this pads the white flash
		stimuli.push([before, solid, after])
	}
}

r.shuffle(stimuli)

let stimulusGenerator = measureIntegrity(flatten(stimuli))
for (let s of stimulusGenerator) {
	yield s
}
