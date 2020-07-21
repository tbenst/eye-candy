const {Bar, Grating, Image, Video, Solid,
       Chirp, Wait, Checkerboard, WhiteNoise} = require("./types")
const {PI, ceil, floor, pow, sqrt, cos, sin, round} = require("./math")
const {calcBarLifespan} = require("./render")
const {flatten} = require("./misc")
// functions to be included in EPL namespace

// If updating celltyping, be sure to bump version in celltypeMeta
// also note that this is currently dangerous to update, as it will
// change the execution of EPL from older versions and result in bad .stim files

// TODO remove need for this function by saving the .stim file directly
// may want to wait for the electron code rebasing first

// run each generator sequentially
function* concat_generators(...generators) {
  for (var g of generators) {
    for (stimulus of g) {
      yield stimulus
    }
  }
}
exports.concat_generators = concat_generators

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
exports.measureIntegrity = measureIntegrity

// **** CELL TYPE ASSAY ****
// we need to create closure that includes the random number generator,
// so we use the function factory pattern
function createCelltypingGen(r, windowHeight, windowWidth, nRows, nCols) {
  
  // Note: still must define stimulusGenerator in EPL
  // e.g. `stimulusGenerator = celltyping`
  
  let celltypeMeta = {group: r.uuid(), label: "celltype"}
  
  celltypeStimuli = []
  celltypeStimuli.push(new Wait(3, celltypeMeta))
  celltypeStimuli.push(new Solid(0.5, "white", celltypeMeta))
  celltypeStimuli.push(new Wait(3, celltypeMeta))
  // gray is #808080 or 0.5*"white"
  celltypeStimuli.push(new Solid(2, "gray", celltypeMeta))
  // frequency chirp.
  // negative PI/2 to rise first from (127,127,127)
  celltypeStimuli.push(new Chirp(8, 0.5, 5, 127.5, 127.5, 8, -PI/2, celltypeMeta))
  celltypeStimuli.push(new Wait(3, celltypeMeta))
  
  // Amplitude chirp
  // baden params: 8 sec, 2Hz,
  // constrast: 1/30, 1/30, 1/15, 1/10, ... linear to full contrast
  celltypeStimuli.push(new Chirp(8, 2, 2, 4, 127.5, 8, -PI/2, celltypeMeta))
  celltypeStimuli.push(new Wait(2, celltypeMeta))
  
  // moving bars
  // baden params: 0.3 × 1 mm bright bar moving at 1 mm s−1
  // width (px) = deg/um * (xpix/deg + ypix/deg)/2 * 300 um
  // 110 px = (1/34.91*(13.09+12.54)/2 * 300)
  // speed = deg/um * (xpix/deg + ypix/deg)/2 * um / s^2
  // 0.367 px / um; 367 px / mm

  // new group for moving bars
  celltypeMeta = {group: r.uuid(), label: "celltype"}

  let ctWidth = 110
  let ctSpeed = 367
  let ctAngles = [...Array(32).keys()].map(x => (x*2+1)*PI/32)
  let ctLifespan = calcBarLifespan(ctSpeed,ctWidth,windowHeight,windowWidth)

  let barStimuli = []
  for (let angle of ctAngles) {
    barStimuli.push(new Bar(ctLifespan,"black",
      ctSpeed, ctWidth, angle, "white", celltypeMeta))
  }

  // add wait in between
  r.shuffle(barStimuli)
  for (let stim of barStimuli) {
    celltypeStimuli.push(new Wait(1, celltypeMeta))
    celltypeStimuli.push(stim)
  }

  // new group for color flashes
  celltypeMeta = {group: r.uuid(), label: "celltype"}
  
  celltypeStimuli.push(new Wait(3, celltypeMeta))
  celltypeStimuli.push(new Solid(0.5, "red", celltypeMeta))
  celltypeStimuli.push(new Wait(3, celltypeMeta))
  celltypeStimuli.push(new Solid(0.5, "green", celltypeMeta))
  celltypeStimuli.push(new Wait(3, celltypeMeta))
  celltypeStimuli.push(new Solid(0.5, "blue", celltypeMeta))
  celltypeStimuli.push(new Wait(3, celltypeMeta))
  
  // new group for binary noise
  celltypeMeta = {group: r.uuid(), label: "celltype"}

  celltypeStimuli.push(new WhiteNoise(60*5, nRows, nCols, false, celltypeMeta))
  
  function* stimulusGenerator() {
    for (s of celltypeStimuli) {
      yield s
    }
  }
  return stimulusGenerator
}  

exports.celltyping = createCelltypingGen