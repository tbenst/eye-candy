const metadata = {name: "200faces_14looks", version: "0.2.1"}
const duration = 0.5
const repetitions = 1
const scaleX = 1.125
const scaleY = 1.125
const images = [...Array(200).keys()].map(x => String(1+x))
//  assume format like 8b.jpg
const subImages = [...Array(14).keys()].map(x => String(1+x).padStart(2,"0"))

imageBase = "/images/FEI_Face/"
imageExt = ".jpg"
imageSrcs = {} // use as Set
// 24 / minute
stimuli = []
let imageSrc = ""
let id, cohort
let meta = {group: r.uuid(), label: "celltype"}
// TODO fixationPoint is broken / unintuitive
let fixationPoint = {x: 600*scaleX/2, y: 360*scaleY/2} // center the 260 x 360 image
const classLabels = ["Person number", "imageNum"]
for (let rep = 0; rep < repetitions; rep++) {
  cohort = r.uuid()
  for (const n of images) {
    for (const s of subImages) {
      id = r.uuid()
      imageSrc = imageBase + n + "-" + s + imageExt
      imageSrcs[imageSrc] = ""
      imageClass = [ n, s ]
      im = new Image(duration, "black", imageSrc, fixationPoint, [scaleX, scaleY],
      {class: imageClass, classLabels: classLabels,
        group: id, cohort: cohort, block: true})
      before = new Wait(duration, {group: id, block: true})
      after = new Wait(r.randi(30,45)/60, {group: id})
      stimuli.push([before, im, after])
    }
  }
}

r.shuffle(stimuli)
stimuli = flatten(stimuli)

function* stimulusGenerator() {
    for (s of stimuli) {
        yield s
    }
}