To use, please first download the latest [Chrome Canary](https://www.google.com/chrome/browser/canary.html)

On Windows, create a chrome canary desktop shortcut & right-click it. Click properties and modify target to: `"C:\[...]\chrome.exe" --js-flags="-harmony-async-await"` with whatever the actual path is instead of [...].

On mac, open terminal and type `/Applications/Google\ Chrome\ Canary.app/Contents/MacOS/Google\ Chrome\ Canary --js-flags="-harmony-async-await"`

```
docker-compose build
docker-compose up
```

Now open 172.16.37.82:3000 to run. be sure to open a 172.16.37.82:3000/stimulus.html window too.
example YAML:
```
- with_nested:
    - [1 2 3 4]
    - [50]
    - [750, 1250]
    - [0, PI/4]
    - ['#ffffff', '#d0d0d0', '#a3a3a3', '#505050']
  list:
    - wait:
        time: 1
    - solid:
        time: 1
        backgroundColor: items[4]
    - wait:
        time: 2
    - grating:
       width: items[1]
       speed: items[2]
       angle: items[3]
       barColor: items[4]
       backgroundColor: black
       wavelength: 250
       time: 3
```
