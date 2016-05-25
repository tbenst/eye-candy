'use strict';

var Koa = require('koa');
var app = new Koa();

app.use(function (ctx) {
  ctx.body = 'Hello World';
});

app.listen(3000);