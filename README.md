To use, please open Google Chrome 57 or later. Go to chrome://flags and enable "Experimental JavaScript."

You also need Docker. Clone this repository to a local folder, change into it, and execute:

```
docker-compose build
docker-compose up
```

Now open 0.0.0.0:3000 in Chrome. be sure to open a 0.0.0.0:3000/stimulus.html window too. Try scrolling to the bottom and hitting start.

# About the Eyecandy Programming Language
Programs are written in the Eyecandy programming language (EPL), a domain specific language that is embedded in javascript, and designed from the ground up for asynchronous stimulation. The core idea is that an EPL program is a generator function that runs on the server & yields a new stimulus each time it is called. This passes control to the client, which displays the stimulus using GPU-accelerated HTML5 canvas. The results of the stimulation are then returned to the server, which passes the values into the EPL program and returns with the next stimulus. Thus, EPL is designed from the ground-up for closed-loop experiments.
