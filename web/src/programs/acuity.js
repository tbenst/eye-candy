const metadata = {"name": "acuity", "version": "0.3.0"}

function linearToHex(f) {
    // gamma compress linear light intensity between zero and one
    let n = Math.ceil((1.055*Math.pow(f,1/2.4)-0.055)*255)
    let hex = n.toString(16)
    return "#"+hex+hex+hex
}

function* wrapSolid(stimuli) {
	// insert a wait before and after
	for (let s of stimuli) {
		if (s.stimulusType==="SOLID") {
			yield new Wait(120)
			yield s
			yield new Wait(240)
		} else {
			yield s
		}
	}
}

function* measureIntegrity(stimuli,every=5*60) {
	// every N seconds, do a flash
	let elapsedTime = every
	for (let s of stimuli) {
		if (elapsedTime>=every) {
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
let stimuli = []

let width
let duration
let lifespan
let group = Array(3)
let id

for (let speed of speeds) {
	for (let width of widths) {
		lifespan = calcBarLifespan(speed,width,windowHeight,windowWidth)
		// we use an offset to avoid diamond pixel artifacts
		id = uuid()
		stimuli.push(new Bar(lifespan,"black",
			speed, width, PI/8, "white", {group: id}))
		duration = Math.ceil(width/speed*120)
		group = whiteFlashLifetime.add(duration)
	}
}

let colors = [0.2,0.4,0.6,0.8].map(linearToHex)

for (let i = 3; i < EQspeeds.length-1; i++) {
	// skip the slow speeds & the fastest

	speed = EQspeeds[i]
	exponent = 7+i<1 ? 7+i : 10
	// widths of [16,32,64,128,256]
	for (let w = 4; w <= 8; w++) {
		width = Math.pow(2,w)
		lifespan = calcBarLifespan(speed,width,windowHeight,windowWidth)
		duration = Math.ceil(width/speed*120)
		
		// Here we do Direction selectively
		for (var j=1; j<=7;j++) {
			// 8 angles, offset by 22 degrees to reduce diamond artifact
			stimuli.push(new Bar(lifespan,"black", speed, width, (j*2+1)*PI/8,
				"white"))
		}
	}
}

for (let s of whiteFlashLifetime) {
	stimuli.push(new Solid(s))
}


r.shuffle(stimuli)

let stimulusGenerator = measureIntegrity(wrapSolid(stimuli))
for (let s of stimulusGenerator) {
	yield s
}
