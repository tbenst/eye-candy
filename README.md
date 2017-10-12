To use, please open Google Chrome 57 or later. Go to chrome://flags and enable "Experimental JavaScript."

You also need Docker. Clone this repository to a local folder, change into it, and execute:

```
docker-compose build
docker-compose up
```

Now open 0.0.0.0:3000 in Chrome. be sure to open a 0.0.0.0:3000/stimulus.html window too. Try scrolling to the bottom and hitting start.


# Dev notes:
Client stimulus.html POST '/hello'
    gets SID & stores in localStorage b/c cookies get HTTPOnly flag set for no apparent reason
Client stimulus.html POST '/window'
    sets `windows[sid]`
Client index.html socket 'load'
    compiles js to `program[sid]` in vm
Server socket emit 'pre-render'
Client socket emit 'renderResults'
Client index.html POST '/start-program'

