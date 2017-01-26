const metadata = {name: "acuity", version: "0.3.0"}

function linearToHex(f) {
    // gamma compress linear light intensity between zero and one
    let n = ceil((1.055*pow(f,1/2.4)-0.055)*255)
    let hex = n.toString(16)
    return "#"+hex+hex+hex
}

function* measureIntegrity(stimuli,every=5*60) {
	// every N seconds, do a flash
	let elapsedTime = every
	for (let s of stimuli) {
		if (elapsedTime>=every && !s.metadata.block) {
			yield new Wait(120)
			yield new Solid(60)
			yield new Wait(240)
			elapsedTime = 0
			yield s
		} else {
			yield s
			elapsedTime=elapsedTime+s["lifespan"]/120
		}
	}
}

let widths = [...Array(16).keys()].map(x => (x+1)*10)
let speeds = [...Array(16).keys()].map(x => (1+x)*60)
// 16 angles, offset by 22 degrees to reduce diamond artifact
let angles = [...Array(16).keys()].map(x => (x*2+1)*PI/16)
let stimuli = []

let width
let lit
let lifespan
let group = Array(3)
let id
let before

for (let speed of speeds) {
	for (let width of widths) {
		lifespan = calcBarLifespan(speed,width,windowHeight,windowWidth)
		id = r.uuid()

		for (let angle of angles) {
			stimuli.push(new Bar(lifespan,"black",
				speed, width, angle, "white", {group: id}))
		}
		
		// block means "do not insert a integrity check after me"
		lit = new Solid(ceil(width/speed*120), "white", {group: id, block: true})
		before = new Wait(floor((lifespan-lit)/2), {group: id, block: true})
		after = new Wait(ceil((lifespan-lit)/2), {group: id})

		// before + lit + after = lifespan
		// this pads the white flash
		stimuli.push([before, lit, after])
	}
}

r.shuffle(stimuli)

let stimulusGenerator = measureIntegrity(flatten(stimuli))
for (let s of stimulusGenerator) {
	yield s
}
