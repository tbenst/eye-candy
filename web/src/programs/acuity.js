
// v2

// acuity to bars of different widths and speeds

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
			yield waitSC(120)
			yield s
			yield waitSC(240)
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
			yield waitSC(120)
			yield solidSC(60)
			yield waitSC(240)
			elapsedTime = 0
			yield s
		} else {
			yield s
			elapsedTime=elapsedTime+s["lifespan"]/120
		}
	}
}

let widths = new Set()
let EQspeeds = [15,30,60,120,240,480,960,1920]
let whiteFlashLifetime = new Set()
let colorFlashLifetime = new Set()
let stimuli = []

let steps = 8
let widthStep = 2
let maxWidth = widthStep * steps

let width
let duration
let lifespan
let speed
let exponent

for (let i = 0; i < EQspeeds.length; i++) {
	speed = EQspeeds[i]
	exponent = 7+i<10 ? 7+i : 10

	for (let w = 0; w <= exponent; w++) {
		width = Math.pow(2,w)
		lifespan = calcBarLifespan(speed,width,windowHeight,windowWidth)
		// we use an offset to avoid diamond pixel artifacts
		stimuli.push(barSC(lifespan,"black","white",speed,width,PI/8))
		duration = Math.ceil(width/speed*120)
		whiteFlashLifetime.add(duration)
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
			stimuli.push(barSC(lifespan,"black","white",speed,width,(j*2+1)*PI/8))
		}

		// and now we do contrast
		for (let c of colors) {
			stimuli.push(barSC(lifespan,"black",c,speed,width,PI/8))
			colorFlashLifetime.add(duration,c)
		}
	}
}

for (let s of whiteFlashLifetime) {
	stimuli.push(solidSC(s))
}

for (let s of colorFlashLifetime) {
	for (let c of colors) {
		stimuli.push(solidSC(s,c))
	}
}

r.shuffle(stimuli)

let stimulusGenerator = measureIntegrity(wrapSolid(stimuli))
for (let s of stimulusGenerator) {
	yield s
}
