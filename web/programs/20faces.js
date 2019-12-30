const metadata = {name: "10faces", version: "0.1.0"}
const duration = 0.5
const repetitions = 60
const scaleX = 2
const scaleY = 2
const maleImages = [1,2,3,4,5,6,7,8,9,10]
const femaleImages = [11,12,15,21,25,26,28,29,37,39]
const images = maleImages.concat(femaleImages)
//  assume format like 8b.jpg
const subImages = ["a", "b"]

imageBase = "/images/FEI_Face/"
imageExt = ".jpg"
imageSrcs = {} // use as Set
// 24 / minute
stimuli = []
stimuli.push(new Wait(1))
let imageSrc = ""
let id, cohort, isMale
let meta = {group: r.uuid(), label: "celltype"}
// TODO fixationPoint is broken / unintuitive
let fixationPoint = {x: 260*scaleX/2, y: 360*scaleY/2} // center the 260 x 360 image
const classLabels = ["Person number", "isMale", "isSmiling"]
for (let rep = 0; rep < repetitions; rep++) {
  cohort = r.uuid()
  for (const n of images) {
    for (const s of subImages) {
      id = r.uuid()
      imageSrc = imageBase + n + s + imageExt
      imageSrcs[imageSrc] = ""
      isMale = maleImages.includes(n)
      isSmiling = s==="b"
      imageClass = [ n, isMale, isSmiling ]
      im = new Image(duration, "black", imageSrc, fixationPoint, [scaleX, scaleY],
      {class: imageClass, classLabels: classLabels,
        group: id, cohort: cohort, block: id})
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

// should be unecessary with new async queue of new images
// const preRenderArgs = {args: [imageSrcs, "10faces.js_v1"]}

// function* preRenderFunc(imageSrcs) {
//   function preloadImage(url) {
//     var img=new Image();
//     img.src=url;
//   }
//   console.log(imageSrcs)
//   for (const imageSrc of Object.keys(imageSrcs)) {
//     console.log("loading", imageSrc)
//     preloadImage(imageSrc)
//   }
//   // we don't yield as nothing to store in IndexedDB (browser will cache image)
//   return "finished"
// }
