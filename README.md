To run, must Download Google Chrome Canary and start using the following flags: --js-flags="-harmony-async-await"

Mac:
/Applications/Google\ Chrome\ Canary.app/Contents/MacOS/Google\ Chrome\ Canary --js-flags="-harmony-async-await"

Remove old:
docker-compose stop && docker-compose rm

Deploy:
docker-compose build && docker-compose up -d