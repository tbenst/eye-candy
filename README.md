To run, must Download Google Chrome Canary and start using the following flags: --js-flags="-harmony-async-await"

Mac:
/Applications/Google\ Chrome\ Canary.app/Contents/MacOS/Google\ Chrome\ Canary --js-flags="-harmony-async-await"

example YAML:
---
- bar:
    width: 10
    speed: 20
    angle: PI
    barColor: white
    backgroundColor: black
- bar:
    width: items[0]
    speed: items[1]
    angle: items[2]
    barColor: white
    backgroundColor: black
  with_nested:
    - [10, 100]
    - [500, 1000]
    - [0, PI/4, PI/2, 3*PI/4, PI, 5*PI/4, 3*PI/2, 7*PI/4]