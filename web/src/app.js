// const Koa = require('koa');
// const router = require('koa-router')();
// const path = require('path')

// require("babel-polyfill");
const bodyParser = require('koa-bodyparser');
import Koa from 'koa';
const router = require('koa-router')();
import path from 'path'
import co from 'co';
import render from 'koa-ejs';
const serve = require('koa-static');

import {orientationSelectivityGen, easyGen} from './programs'


const app = new Koa();
// app.use(bodyParser());
// app.use(ctx => {
//     console.log('request p', ctx )
// });

render(app, {
    root: path.join(__dirname, '../view'),
    layout: 'template',
    viewExt: 'html',
    cache: false,
    debug: true
});

app.context.render = co.wrap(app.context.render);

router.get('/', async (ctx) => {
    await ctx.render('index');
});

// router.get('/stimulus', async (ctx) => {
//     ctx.body = "yes" //{x: 'test'}
// });

let program = {}

router.post('/new-program', async (ctx) => {
    const height = ctx.request.header.windowheight
    const width = ctx.request.header.windowwidth
    // program = orientationSelectivityGen(height, width, [500, 1000], [10, 100], 25)
    program  = easyGen()
    ctx.status = 200
});

router.post('/next-stimulus', function (ctx) {
    ctx.body = program.next()
    ctx.status = 200
});



app
    .use(serve('view'))
    .use(router.routes())
    .use(router.allowedMethods());

app.listen(3000);