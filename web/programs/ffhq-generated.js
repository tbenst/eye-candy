const metadata = {name: "ffhq-generated", version: "0.1.0"}
const duration = 0.5
const repetitions = 1
const scaleX = 1.1
const scaleY = 1.1
let images = [...Array(10000).keys()].map(x => String(x).padStart(4,"0"))

// First 5000 images only
images = images.slice(0,5000)

// Second 5000 images only
// images = images.slice(5000,10000)

const imageBase = "/images/ffhq/seed"
const imageExt = ".png"
// 24 / minute
let stimuli = []
let id, cohort
// TODO fixationPoint is broken / unintuitive
let fixationPoint = {x: 640*scaleX/2, y: 640*scaleY/2} // center the 260 x 360 image
const classLabels = ["seed"]
for (let rep = 0; rep < repetitions; rep++) {
  cohort = r.uuid()
  for (const n of images) {
    id = r.uuid()
    imageSrc = imageBase + n + imageExt
    imageClass = [ n ]
    im = new Image(duration, "black", imageSrc, fixationPoint, [scaleX, scaleY],
    {class: imageClass, classLabels: classLabels,
      group: id, cohort: cohort, block: true})
    before = new Wait(duration, {group: id, block: true})
    after = new Wait(r.randi(30,45)/60, {group: id, block: false})
    stimuli.push([before, im, after])
  }
}

r.shuffle(stimuli)
stimuli = flatten(stimuli)
stimuli = measureIntegrity(stimuli)

let celltyping_generator = celltyping(r, windowHeight, windowWidth, 25,40)()

function* stimulusGenerator() {
    // run celltyping first
    for (s of celltyping_generator) {
      yield s
    }
    // then run ffhq
    for (s of stimuli) {
        yield s
    }
}