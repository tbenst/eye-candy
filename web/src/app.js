// const Koa = require('koa');
// const router = require('koa-router')();
// const path = require('path')

// require("babel-polyfill");
const bodyParser = require('koa-bodyparser');
const koaSession = require('koa-generic-session');

import Koa from 'koa';
const router = require('koa-router')();
import path from 'path'
import co from 'co';
import render from 'koa-ejs';
const serve = require('koa-static');
const convert = require('koa-convert');
const IO = require( 'koa-socket' )
const koaSocketSession = require('koa-socket-session')
const redisStore = require('koa-redis')


import {buildGenerator} from './parser'
// import session from './session'

const app = new Koa();
const io = new IO()
const store = new redisStore({host: 'redis'})

var session = koaSession({
    store: store,
    secret: '1nkj98sdfa1',
    resave: true,
    saveUninitialized: true
});


app.keys = ['8r92scsdf6', 'jnt356gc'];
app
    // .use(convert(session))
    .use(convert(session))
    .use(bodyParser());

io.use(koaSocketSession(app, session))

render(app, {
    root: path.join(__dirname, '../view'),
    layout: 'template',
    viewExt: 'html',
    cache: false,
    debug: true
});

app.context.render = co.wrap(app.context.render);


router.post('/window', (ctx) => {
    // console.log('got window')
    var session = ctx.session;
    session.windowHeight = ctx.request.header.windowheight
    session.windowWidth = ctx.request.header.windowwidth
    ctx.body = session;   
});

router.post('/next-stimulus',  (ctx) => {
    // console.log('next-stimulus', ctx.session)
    ctx.body = program.next()
    ctx.status = 200
});

router.get('/count', ctx => {
    // console.log('count', ctx.req)
    var session = ctx.session;
    session.count = session.count || 0;
    session.count++;
    ctx.body = session;
})

let program

router.post('/start-program', ctx => {

    program = buildGenerator(ctx.request.body.programYAML,
        ctx.session)
    let stimulusQueue = []
    for (var i = 0; i < 5; i++) {
        stimulusQueue.push(program.next())
    }
    // console.log(stimulusQueue)
    io.broadcast('run', stimulusQueue)
    ctx.body = stimulusQueue
    ctx.status = 200
})

// IO
// var clients = [];
io.on('connection', function (ctx) {
  // console.log( 'User connected!!!' )
  // clients.push(socket.id);
});


io.on("disconnect", function(ctx) {
    //https://github.com/LearnBoost/socket.io-client/issues/251
    // console.log( 'User disconnected' )
    socket.socket.reconnect();

});

io.on('window', (ctx, data) => {
    // console.log('in window')
    // console.log('got windowHeight', data.windowHeight)
    ctx.session.windowHeight = data.windowHeight
    ctx.session.windowWidth = data.windowWidth
})

io.on('test', (ctx) => {
    var session = ctx.session;
    session.count = session.count || 0;
    session.count++;
    // console.log('test', ctx.session)
    // console.log('test get windowHeight', ctx.session.windowHeight)
})

io.on('reset', ctx => {
    io.broadcast('reset')
})

io.on('target', ctx => {
    io.broadcast('target')
})

io.attach( app )

app
    // .use(logger())
    .use(serve('static'))
    .use(router.routes())
    .use(router.allowedMethods());

// ctx.session.on("error", function (err) {
//     console.log("Redis error " + err);
// });

app.listen(3000);