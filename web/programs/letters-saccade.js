const metadata = {name: "letters-saccade", version: "0.1.0", inverted: false}
// TODO pre-render letters

let nsizes = 3
let repetitions = 100
let startLogMAR = 2.1
let logMarStep = 0.1
let duration = 1
let saccadeDuration = 0.1
let nSaccades = 10 // 1 second
const color = 'white'
let letterX =  0 // move the letter
let letterY =  0 // move the letter
let saccadeSize = 3 // 2*saccadeSize pixels

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


function logMARtoLetterPx(logMAR, pxPerDegree=12.524) {
    let degrees = pow(10,logMAR)/60
    // letter E has 2.5 wavelengths
    return round(degrees*pxPerDegree*2.5)
}

let sizes = [...Array(nsizes).keys()].map(
    x => x*logMarStep+startLogMAR).map(

    x => logMARtoLetterPx(x))
// big to small
sizes.reverse()

let letters = ["C", "D", "H", "K", "N", "O", "R", "S", "V", "Z"]

// special function for pre-rendering. This is passed as a string
// and run client-side
function* preRenderFunc(nFrames, sizes, letters, color) {
    console.log("In preRender...")
    function renderLetter(size, letter, color) {
        var canvas = document.createElement("canvas");
        var context = canvas.getContext("2d")
        canvas.width = size
        canvas.height = size
        // var x = size/2
        var x = 0
        var y = size
        context.fillStyle = color
        context.font = size+'px Sloan'
        context.fillText(letter, x, y)
        return canvas
    }

    // actual function start
    // console.log('TENSOR', letterR)

    let renderedLetters = []
    let l, image, idx, s
    let nsizes = sizes.length
    for (let i = 0; i < letters.length; i++) {
        l = letters[i]
        for (let j = 0; j < nsizes; j++) {
            // console.log(i, j)
            s = sizes[j]
            image = renderLetter(s, l, color)
            // commented out for switch to
            // generator function
            // I think still correct as row-major
            // idx = i*nsizes + j
            // renderedLetters[idx] = image
            yield image
        }
    }
}

// special object for pre-rendering
const nFrames = letters.length * sizes.length
const preRenderArgs = [nFrames, sizes, letters, color, "letters-saccade-v1"]

let size, letter, idx, fixationPoint, id, cohort, before, after, l, group, x, y
let stimuli = []
for (let n = 0; n < repetitions; n++) {
    for (let j = 0; j < nsizes; j++) {
        size = sizes[j]
        cohort = r.uuid()
        for (let i = 0; i < letters.length; i++) {
            letter = letters[i]
            idx = i*nsizes + j
            id = r.uuid()
            group = []
            group.push(new Wait(duration, {group: id}))
            for (let s = 0; s < nSaccades; s++) {
                x = r.randi(-saccadeSize,saccadeSize) + size/2 - letterX
                y = r.randi(-saccadeSize,saccadeSize) + size/2 - letterY
                fixationPoint = {x: x, y: y}
                l = new Image(saccadeDuration, 'black', idx, fixationPoint,
                    {target: letter, cohort: cohort, group: id,
                    block: true, parameter: size, parameterType: "size"})
                group.push(l)
            }
            group.push(new Wait(r.randi(0.5,1), {group: id, block: true}))

            stimuli.push(group)
        }
    }
}

r.shuffle(stimuli)

stimuli = measureIntegrity(flatten(stimuli))

function* stimulusGenerator() {
    for (let s of stimuli) {
        yield s
    }
}
