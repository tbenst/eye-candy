To use, please open Google Chrome 67 or later.

You also need Docker. Clone this repository to a local folder, `cd` or `chdir` into it, and execute:

```
docker-compose build
docker-compose up
```

Now open 0.0.0.0:3000 in Chrome. be sure to open a 0.0.0.0:3000/stimulus.html window too. Try scrolling to the bottom and hitting start.

# About the Eyecandy Programming Language
Programs are written in the Eyecandy programming language (EPL), a domain specific language that is embedded in javascript, and designed from the ground up for asynchronous stimulation. The core idea is that an EPL program is a generator function that runs on the server & yields a new stimulus each time it is called. This passes control to the client, which displays the stimulus using GPU-accelerated HTML5 canvas. The results of the stimulation are then returned to the server, which passes the values into the EPL program and returns with the next stimulus. Thus, EPL is designed from the ground-up for closed-loop experiments.

Here's a trivial EPL program:
```
const metadata = {name: "test", version: "0.1.0"}

function* stimulusGenerator() {
    yield new Wait(1)
    yield new Solid(2, "white")
    yield new Wait(1)
}
```

More sophisticated example programs can be found in [src/epl/programs](https://github.com/tbenst/eye-candy/tree/master/web/src/programs).

## Supported stimuli
A variety of stimulation types are included. These are all defined in https://github.com/tbenst/eye-candy/blob/master/web/src/epl/types.js. 
- Wait (black screen)
- Solid (full-field flash of any valid HTML color)
- Bar (single moving square-bar)
- Chirp (full-field frequency-swept cosine)
- ChirpAmplitude (full-field amplitude-swept cosine)
- Grating (square-wave moving grating)
- SinusoidalGrating (sinusoidal-wave moving grating)
- Checkerboard
- Letter (using ETDRS optotype)
- TiledLetter (repeated ETDRS optotype that files full-field)
- EyeChart (mimics changing focus on an ETDRS eyechart)
- Image (display arbitrary images, either pre-rendered or served from the server's `/data/eye-candy/images`)
- Video (display video from mounted volume, by defualt this is in `/data/eye-candy/videos`, see https://github.com/tbenst/eye-candy/blob/master/docker-compose.yml)

## Deterministic randomness
Programs are initialized with a seed value for the Mersenne Twister, a deterministic pseudo-random number generator. Thus, each time an experiment is run random parameters can be randomly sampled, and by saving the seed we can re-run the exact same experiment.

## Pre-rendering
Rendering can often be computationally expensive, especially when generating millions of random numbers is required. To allow for pre-rendering complex stimuli like random binary masks that are balanced over time such that each pixel sums to the same value, EPL supports two special objects: `preRenderFunc` and `preRenderArgs`. These objects are used on the client (the webbrowser) to render frames that are then cached in the browser using IndexedDB. Thus, EPL programs execute both on the server and on the client. Cached frames can be reused between sessions as `preRenderFunc` is memoized: two sessions with identical `preRenderArgs` as well as canvas height and width for `stimulus.html` will retrieve the previously computed pre-rendered frames from IndexedDB.

Clearing the cache can be done in Developer Tools (ctrl-shift-c) -> Storage -> IndexedDB -> eyeCandyDB -> right click myStore -> Clear.


## How to add new protocol
Two options: for quick testing you can use the `custom` dropdown selection, or you can create `web/src/epl/programs/myProtocol.js`. You need to reload `index.html` for the dropdown to display `myProtocol.js`, but once it's there, any changes are hot-loaded by the server when you click `load`

# Dev notes

## How to add a new stimulus
1. add to types.js
2. add to actions.js
3. add to dispatchers.js
3. add to reducers.js
4. add to static/js/render.js

Or by using Image type, can just define in EPL preRenderFunc! See eyechart-saccade.js for an example.


## Handshake overview:
- Client stimulus.html POST '/hello'
    -  gets SID & stores in localStorage b/c cookies get HTTPOnly flag set for no apparent reason and we need to use SID in socket connection, too.
- Client stimulus.html POST '/window'
    - sets `windows[sid]` (keeps track of height and width)
- Client index.html socket 'load'
    - compiles js to `program[sid]` in vm
- Server socket emit 'pre-render'
    - The server cannot render, so asks the client to pre-render
- Client socket emit 'renderResults'
    - client returns pre-render results
- Client index.html POST '/start-program'
    - client informs server of start program button press
- Server socket emit 'run'
- stimulus.js renderLoop does its thing


## TODOs
- replace koa-socket-session with something better supported (1.2.0 fails)
- update to koa-socket-2
- Chunk number of stimmuli returned by server to lower number of requsets
- fix black frame between binary static by buffering one frame & first swapping canvas on rAF and then rendering next frame to off-frame

### video
- Always save video
- support client-side image specification

### BUGS
- Stimulus should change on global timer (no increasing drift from estimate, make sure not adding frame on stim switch?)

## minified src:
https://github.com/ramda/ramda/blob/master/dist/ramda.min.js
