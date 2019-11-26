To use, please open Google Chrome 67 or later.

You also need Docker. Clone this repository to a local folder, change into it, and execute:

```
docker-compose build
docker-compose up
```

Now open 0.0.0.0:3000 in Chrome. be sure to open a 0.0.0.0:3000/stimulus.html window too. Try scrolling to the bottom and hitting start.

# About the Eyecandy Programming Language
Programs are written in the Eyecandy programming language (EPL), a domain specific language that is embedded in javascript, and designed from the ground up for asynchronous stimulation. The core idea is that an EPL program is a generator function that runs on the server & yields a new stimulus each time it is called. This passes control to the client, which displays the stimulus using GPU-accelerated HTML5 canvas. The results of the stimulation are then returned to the server, which passes the values into the EPL program and returns with the next stimulus. Thus, EPL is designed from the ground-up for closed-loop experiments.

Example programs can be found in [src/epl/programs](https://github.com/tbenst/eye-candy/tree/master/web/src/programs).


# Handshake overview:
Client stimulus.html POST '/hello'
    gets SID & stores in localStorage b/c cookies get HTTPOnly flag set for no apparent reason and we need to use SID in socket connection, too.
Client stimulus.html POST '/window'
    sets `windows[sid]` (keeps track of height and width)
Client index.html socket 'load'
    compiles js to `program[sid]` in vm
Server socket emit 'pre-render'
    The server cannot render, so asks the client to pre-render
Client socket emit 'renderResults'
    client returns pre-render results
Client index.html POST '/start-program'
    client informs server of start program button press
Server socket emit 'run'
stimulus.js renderLoop does its thing


# How to add a new stimulus
1. add to types.js
2. add to actions.js
3. add to dispatchers.js
3. add to reducers.js
4. add to static/js/render.js

Or by using Image type, can just define in EPL preRenderFunc! See eyechart-saccade.js for an example.

# How to add new protocol
1. create web/src/epl/programs/myProtocol.js
2. add option tag to index.js

# Dev

## TODOs
replace koa-socket-session with something better supported (1.2.0 fails)
update to koa-socket-2
make sure I didn't break shuffle with new randint
websockets are crapping out on sending random frames, so need to do MT client-side & pass seed..?

### video
- Always save video
- support client-side image specification

### BUGS
- fix race condition on video save (wait for all frames to be received)
- Stimulus should change on global timer (no increasing drift from estimate, make sure not adding frame on stim switch?)

## minified src:
https://github.com/ramda/ramda/blob/master/dist/ramda.min.js
