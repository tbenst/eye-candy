## Dev notes
The key entry file for the server is [web/src/app.js](https://github.com/tbenst/eye-candy/blob/master/web/src/app.js). For the client, see [static/stimulus.html](https://github.com/tbenst/eye-candy/blob/master/web/static/stimulus.html) and [static/js/stimulus.js](https://github.com/tbenst/eye-candy/blob/master/web/static/js/stimulus.js), following the rabbit-hole of imports (e.g. [`renderLoop`](https://github.com/tbenst/eye-candy/blob/b9fe9e1f2e131cfaa82b98e8b313ca9fa76616fa/web/static/js/render.js#L175)).

The client-side follows the [Redux](https://redux.js.org/) pattern, while the server side uses [koa](https://koajs.com/) middleware pattern + [socket.io](https://socket.io/) for high-performance web sockets.

If you see
```
Failed to load module script: The server responded with a non-JavaScript MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec
```
Then your import path is wrong. relative does not work (`./`) nor does leaving off `.js`

## Favicon
generated using https://realfavicongenerator.net/
