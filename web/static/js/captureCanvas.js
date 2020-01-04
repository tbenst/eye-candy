import { canvas } from "/js/store.js";
// TODO remove -- below is for debugging with test.js why the extra frame
// sneaks in at begining of video if user doesn't save previous video
// appears to not happen if just a SOLID stimuli as last frame in prev video
// does happen for moving bar

// export var canvas = document.querySelector("canvas");
// canvas.width  = window.innerWidth
// canvas.height = window.innerHeight

// don't capture frames automatically
// https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/captureStream
export let canvasStream = canvas.captureStream(0)
export let canvasStreamTrack = canvasStream.getTracks()[0]

let recordedChunks = [];
// int,int,int,boolean
const initFrameLog = ["framenum,time,stimulusIndex\n"]
let frameLog = initFrameLog.slice()
// const mimeType = "video/webm" // harder to add duration
// const extension = ".webm"
const mimeType = "video/x-matroska"
const extension = ".mkv"

// TODO for some reason, all of profile/constraint/level configuration is ignored + gives same size video
// seems to be good enough for now

// avc1.PPCCLL
// profile number (PP), constraint set flags (CC), and level (LL)
// f4003D is High 4:4:4 Predictive Profile (Hi444PP) level 6.1
const codecs = "codecs=avc1.f4003d"
// The High 4:4:4 Profile constrained to all-intra use, and to using only CAVLC entropy coding.
// const codecs = "codecs=avc1.44003d"
// standard
// const codecs = "codecs=avc1.4d002a"
// super low
// const codecs = "codecs=avc1.424014"

// one day, circa 2021, should switch to av01 when better support
// https://developer.mozilla.org/en-US/docs/Web/Media/Formats/codecs_parameter#AV1
// Professional profile (2), level 5.2 (52), high tier (1), 8-bit depth (08), non-monochrome (0), chroma-subsampling 4:4:4 (000)

// const codecs = "codecs=vp9"
// const codecs = "codecs=av01.1.15H.08.0.000"

let recordOptions = {
  mimeType: `${mimeType}; ${codecs}`
};
export let canvasRecorder = new MediaRecorder(canvasStream, recordOptions);
canvasRecorder.ondataavailable = handleDataAvailable;

function handleDataAvailable(event) {
  // TODO first frame sometimes wrong
  // if user selects save-video for previous run but hits cancel
  // the first saved frame is wrong
  // and is actually last frame recorded from previous run
  console.log("handleDataAvailable", event)
  if (event.data.size > 0) {
    recordedChunks.push(event.data);
    downloadVideo()
    downloadFrameLog()
  } else {
    // ...
  }
}

export function startRecorder() {
  // only start once
  if (canvasRecorder.state!=="recording") {
    recordedChunks = []
    canvasRecorder.start()
  }
}

export function stopRecorder() {
  // only stop once
  if (canvasRecorder.state!=="inactive") {
    canvasRecorder.stop()
  }
}

export function registerFrame(frameNum, time, stimulusIndex) {
  // TODO there is a bug where is download of previous video is declined
  // by user, then 
  // TODO create file for frameNum & time-
  frameLog.push([`${frameNum},${time},${stimulusIndex}\n`])
  canvasStreamTrack.requestFrame()
}

function downloadVideo() {
  // unfortunately, does not include duration due to 
  // https://bugs.chromium.org/p/chromium/issues/detail?id=642012
  // currently should fix with MKVToolNix
  // mkvmerge -o test_mkvtoolnix.mkv --default-duration 1:60/1fps test.mkv
  // TODO fix with polyfill https://github.com/legokichi/ts-ebml
  let blob = new Blob(recordedChunks, {
    type: mimeType
  });
  let url = URL.createObjectURL(blob);
  let a = document.createElement("a");
  document.body.appendChild(a);
  a.style = "display: none";
  a.href = url;
  let dateStr = new Date().toISOString()
  a.download = `${dateStr}_eyecandy${extension}`;
  console.log("pre-click")
  a.click();
  window.URL.revokeObjectURL(url);
  recordedChunks = []
  console.log("post-click", recordedChunks)
  a.remove()
}

function downloadFrameLog() {
  let blob = new Blob(frameLog, {
    type: "text/plain"
  });
  let url = URL.createObjectURL(blob);
  let a = document.createElement("a");
  document.body.appendChild(a);
  a.style = "display: none";
  a.href = url;
  let dateStr = new Date().toISOString()
  a.download = `${dateStr}_eyecandy_frames.log`;
  a.click();
  frameLog = initFrameLog.slice()
  window.URL.revokeObjectURL(url);
  a.remove()
}