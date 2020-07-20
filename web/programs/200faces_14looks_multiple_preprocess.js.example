const metadata = {name: "200faces_14looks", version: "0.2.0"}
const duration = 0.5
const repetitions = 1
const scaleX = 1.125
const scaleY = 1.125
const images = [...Array(200).keys()].map(x => String(1+x))
//  assume format like 8b.jpg
const subImages = [...Array(14).keys()].map(x => String(1+x).padStart(2,"0"))
// array of string that describes image preprocessing
// e.g. "" would give "130-09.jpg", "_BnW_edges" would give "130-09_BnW_edges.jpg"
const preProcessPath = ["", "_BnW_edges"]
// used for imageClass
const preProcess = [...Array(preProcessPath.length)]
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
const classLabels = ["Person number", "imageNum", "preprocess"]
for (let rep = 0; rep < repetitions; rep++) {
  cohort = r.uuid()
  for (const n of images) {
    for (const s of subImages) {
      for (const p of preProcess) {
        id = r.uuid()
        imageSrc = imageBase + n + "-" + s + preProcessPath[p] + imageExt
        imageSrcs[imageSrc] = ""
        imageClass = [ n, s, p ]
        im = new Image(duration, "black", imageSrc, fixationPoint, [scaleX, scaleY],
        {class: imageClass, classLabels: classLabels,
          group: id, cohort: cohort, block: id})
        before = new Wait(duration, {group: id, block: true})
        after = new Wait(r.randi(30,45)/60, {group: id})
        stimuli.push([before, im, after])
      }
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
