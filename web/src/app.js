// const Koa = require('koa');
// const router = require('koa-router')();
// const path = require('path')

// require("babel-polyfill");
import Koa from 'koa';
const router = require('koa-router')();
import path from 'path'
import co from 'co';
import render from 'koa-ejs';
const serve = require('koa-static');
import {orientationSelectivityGen} from './programs'


const app = new Koa();
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
let x = 0

router.post('/new-program', async (ctx) => {
    program = orientationSelectivityGen([500, 1000], [10, 100], 25)
    ctx.status = 200
});

router.get('/next-stimulus', async (ctx) => {
    console.log(program.next())
    ctx.body = program.next()
});

app
    .use(serve('view'))
    .use(router.routes())
    .use(router.allowedMethods());

app.listen(3000);