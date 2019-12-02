const metadata = {name: "acuity", version: "0.3.2"}

function* measureIntegrity(stimuli,every=5*60) {
	// every N seconds, do a flash
	let integrityMeta
	let elapsedTime = 0
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


// special function for pre-rendering. This is passed as a string
// and run client-side
function* preRenderFunc(binaryNoiseNframes, randomSeed) {
    console.log("In preRender...")

    function renderFrame(flatPixelArray) {
        var canvas = document.createElement("canvas");
        var context = canvas.getContext("2d")
        canvas.width = WIDTH
        canvas.height = HEIGHT
		imageData = new ImageData(flatPixelArray, WIDTH, HEIGHT)
        context.putImageData(imageData, 0, 0)
        return canvas
    }

	console.assert(binaryNoiseNframes % 2 == 0)
	// client-side
	let r = new DeterministicRandom(randomSeed)

	// render random binary frames that are balanced
	// so average intensity per pixel over time is 0.5
	// nframes must be even!
	let nPixels = HEIGHT * WIDTH
// TODO delete / benchmark
	// let r = new DeterministicRandom(10)
	// let binaryNoiseNframes =14
	let pixelArrays = []
	let singlePixel = Uint8ClampedArray.from(Array(binaryNoiseNframes/2).fill(0).concat(Array(binaryNoiseNframes/2).fill(255)))
	// RGBA array https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas


	// chunk N frame increments to avoid memory overflow
	let chunkNframes = 100
	let chunkFrames
	for (var i = 0; i < binaryNoiseNframes; i = i + chunkNframes) {
		// equal to chunkNframes except for final iteration
		chunkNframes = Math.min(chunkNframes, binaryNoiseNframes-i)
		chunkFrames = new Uint8ClampedArray(chunkNframes*nPixels*4)

		// create balanced pixel assignments
		pixelArrays = []
		for (var p = 0; p < nPixels; p++) {
			// benchmark: 50% of time is from shuffle
			r.shuffle(singlePixel)
			// ... allows for array copy
			pixelArrays.push([...singlePixel])
			if (p % 10000 == 0) {
				console.log("pushed array for pixel: ", p)
			}
		}

		// assign values of each pixel over time
		for (var p = 0; p < nPixels; p++) {
			singlePixel = pixelArrays[p]
			for (var n = 0; n < chunkNframes; n++) {
				// For example, to read the blue component's value from the pixel at column 200, row 50 in the image, you would do the following:
				// blueComponent = imageData.data[(50 * (imageData.width * 4)) + (200 * 4) + 2]
				chunkFrames[p*4 + n*nPixels*4] = singlePixel[n] // red
				chunkFrames[1+p*4 + n*nPixels*4] = singlePixel[n] // green
				chunkFrames[2+p*4 + n*nPixels*4] = singlePixel[n] // blue
				chunkFrames[3+p*4 + n*nPixels*4] = 255 // alpha
			}
			if (p % 10000 == 0) {
				console.log("pushed array for pixel: ", p)
			}
		}
		// yield each frame from chunk
		for (var n = 0; n < chunkNframes; n++) {
			yield renderFrame(chunkFrames.slice(n*nPixels*4,(n+1)*nPixels*4))
		}
	}
}

// special object for pre-rendering
const binaryNoiseDuration = 5*60
const frameRate = 60
const hz = 5
const binaryNoiseLifespan = 1 / hz
const binaryNoiseNframes = hz*binaryNoiseDuration

// deterministic seed for caching
const renderSeed = 242424
// third argument, although unused in function, is memoized on client
// can be updated to invalidate cache
const preRenderArgs = [binaryNoiseNframes, renderSeed, "binary_noise_v1"]

// cell type assay
let celltypeStimuli = []
// CHIRP
const celltypeMeta = {group: r.uuid(), label: "celltype"}

// let fixationPoint = {x: 0, y: 0}
let fixationPoint = {x: windowWidth/2, y: windowHeight/2}
for (var n = 0; n < binaryNoiseNframes; n++) {
	if (n==0) {
		celltypeStimuli.push(new Image(binaryNoiseLifespan, 'black', n, fixationPoint, {"randomSeed": renderSeed}))
	} else {
		celltypeStimuli.push(new Image(binaryNoiseLifespan, 'black', n, fixationPoint))
	}
}

// shuffle binary frames that are cached instead of slow
// pre-rendering each time
r.shuffle(celltypeStimuli)

celltypeStimuli.push(new Wait(3, celltypeMeta))
celltypeStimuli.push(new Solid(3, "white", celltypeMeta))
celltypeStimuli.push(new Wait(3, celltypeMeta))
// gray is #808080 or 0.5*"white"
celltypeStimuli.push(new Solid(3, "gray", celltypeMeta))
// start at 0.5 and increase
// baden params: 8 sec, f1~=0.75Hz, f1~=20Hz (or 40??).
// negative PI/2 to rise first from (127,127,127)
celltypeStimuli.push(new Chirp(8, 0.75, 15, 127.5, 127.5, 8, -PI/2, celltypeMeta))
celltypeStimuli.push(new Wait(3, celltypeMeta))
// baden params: 8 sec, 2Hz, constrast: 1/30, 1/30, 1/15, 1/10, ... linear to full contrast
celltypeStimuli.push(new Chirp(8, 2, 2, 4, 127.5, 8, -PI/2, celltypeMeta))

// moving bars
// baden params: 0.3 × 1 mm bright bar moving at 1 mm s−1
// width (px) = deg/um * (xpix/deg + ypix/deg)/2 * 300 um
// 110 px = (1/34.91*(13.09+12.54)/2 * 300)
// speed = deg/um * (xpix/deg + ypix/deg)/2 * um / s^2
// 0.367 px / um; 367 px / mm
let width = 110
let speed = 367
let angles = [...Array(24).keys()].map(x => (x*2+1)*PI/24)
let lifespan = calcBarLifespan(speed,width,windowHeight,windowWidth)
let id = r.uuid()
for (let angle of angles) {
	celltypeStimuli.push(new Wait(2, celltypeMeta))
	celltypeStimuli.push(new Bar(lifespan,"black",
		speed, width, angle, "white", celltypeMeta))
}


celltypeStimuli.push(new Wait(2, celltypeMeta))
celltypeStimuli.push(new Solid(3, "green", celltypeMeta))
celltypeStimuli.push(new Wait(3, celltypeMeta))
celltypeStimuli.push(new Solid(3, "blue", celltypeMeta))
celltypeStimuli.push(new Wait(3, celltypeMeta))

// perfectly balanced random sequence at 5 Hz yielding a total running time of 5 min
// TODO write binary dense noise stim
// implement as pre-generated images??

// end cell type assay

let stimuli = []

let widths = [...Array(12).keys()].map(x => (x+1)*10)
let speeds = [...Array(8).keys()].map(x => (1+x)*100)
// 12 angles, offset by 22 degrees to reduce diamond artifact
angles = [...Array(12).keys()].map(x => (x*2+1)*PI/12)

let lit
let group = Array(3)
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
stimuli = measureIntegrity(flatten(stimuli))
stimuli = celltypeStimuli.concat(stimuli)

function* stimulusGenerator() {
    for (s of stimuli) {
        yield s
    }
}
