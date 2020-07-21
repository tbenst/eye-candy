const metadata = {name: "celltyping", version: "0.2.0"}

const binaryNoiseDuration = 1*60
const hz = 5
const chunkSize = 50
const binaryNoiseNframes = hz*binaryNoiseDuration
const nJobs = ceil(binaryNoiseNframes / chunkSize)

const preRenderFunc = celltypingPreRender

const renderSeed = 242424
// can update version to invalidate cache
// special object for pre-rendering
// const preRenderArgs = {args: [binaryNoiseNframes, renderSeed, "binary_noise_v1"]}

let preRenderArgs = { nJobs: nJobs, startIdx: [], version: "binary_noise_v1.1"}
let startIdx = 0
for (let i = 0; i < nJobs; i++) {
  if (i === (nJobs - 1) && remainder !== 0) {
    preRenderArgs[i] = [remainder, renderSeed+i, checkerH, checkerW]
  } else {
    preRenderArgs[i] = [chunkSize, renderSeed+i, checkerH, checkerW]
  }
  preRenderArgs["startIdx"].push(startIdx)
  startIdx = startIdx + chunkSize
}

const stimulusGenerator = celltyping(randomSeed, windowHeight, windowWidth,
                                     binaryNoiseDuration, hz, chunkSize)