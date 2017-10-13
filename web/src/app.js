const bodyParser = require("koa-bodyparser");
const koaSession = require("koa-generic-session");

const Koa = require("koa");
const router = require("koa-router")();
var assert = require('assert');
const path = require("path")
const co = require("co");
const render = require("koa-ejs");
const serve = require("koa-static");
const convert = require("koa-convert");
const IO = require( "koa-socket" )
const koaSocketSession = require("koa-socket-session")
const redisStore = require("koa-redis")
var uuid = require("uuid");
const logger = require("koa-logger")
const yaml = require("js-yaml")
const fs = require('fs')

const random = require("./epl/random")
const {compileYAMLProgram, compileJSProgram} = require("./epl/eval")
// import {buildGenerator} from "./parser"
// import session from "./session"

const app = new Koa();
app.use(logger())

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
});

const io = new IO()
const store = new redisStore({host: "redis"})

// WARNING. session is mostly broken, using hacks e.g. localstorage
// and the variable `windows`

var session = koaSession({
    store: store,
    secret: "1nkj98sdfa1will",
    resave: true,
    saveUninitialized: true,

    cookie: {
      path: '/',
      httpOnly: false,
      maxAge: 24 * 60 * 60 * 1000, //one day in ms
      rewrite: true,
      signed: true
    }
});


app.keys = ["8r92scsdf6", "jnt356gc"];
app
    .use(session)
    // .use(convert(session))
    .use(bodyParser({jsonLimit: '50mb', formLimit: "50mb"}));

io.use(koaSocketSession(app, session))


function getSIDfromCookie(cookie) {
    return /koa\.sid=([\d\w\W]+)(;|$)/.exec(cookie)[1]
}

router.post("/window", (ctx) => {
    var session = ctx.session;
    const sid = ctx.request.header.sid
    session.windowHeight = ctx.request.header.windowheight
    session.windowWidth = ctx.request.header.windowwidth
    windows[sid] = {windowHeight: session.windowHeight,
                    windowWidth: session.windowWidth}
    ctx.body = session;
});

router.post("/next-stimulus",  (ctx) => {
    // console.log("next-stimulus", ctx.session)
    const sid = ctx.request.header.sid
    const stimulus = program[sid].next()
    console.log("next stimulus:", stimulus)
    ctx.body = stimulus
    ctx.status = 200
});


// initialize cookie
router.get("/get-sid", ctx => {
    const sid = uuid.v4()
    ctx.session.sid = sid
    ctx.body = sid;
    ctx.status = 200
})

router.get("/count", ctx => {
    // console.log("count", ctx.req)
    var session = ctx.session;
    session.count = session.count || 0;
    session.count++;
    ctx.body = session;
})


router.post("/start-program", ctx => {
    io.broadcast("reset")
    let labNotebook = Object.assign({},ctx.request.body)
    let {submitButton, sid} = labNotebook
    delete labNotebook.submitButton
    delete labNotebook.sid
    console.log('start program sid:', sid)
    assert(sid!==undefined, "assert sid is not undefined")

    if (labNotebook.program==="custom") {
        // program already loaded in labNotebook.epl
    } else {
        // this is likely a security vulnerability but sure is convenient
        // convention over customization
        labNotebook.epl = fs.readFileSync(
            '/www/src/programs/'+labNotebook.program+'.js',
            "utf-8")
    }
    // program[sid] = compileJSProgram(labNotebook.epl, labNotebook.seed, session.windowHeight,
    //     session.windowWidth)

    if (submitButton==="start") {

        let stimulusQueue = []
        console.log("start program")
        try {
            assert(program[sid]!==undefined, "No program found")
        } catch(err) {
            console.log("sid, program:", sid, program)
            throw err
        }
        for (var i = 0; i < 5; i++) {
            stimulusQueue.push(program[sid].next())
        }
        console.log(stimulusQueue)
        io.broadcast("run", stimulusQueue)

        labNotebook.windowHeight = windows[sid].windowHeight
        labNotebook.windowWidth = windows[sid].windowWidth
        // TODO generate date cllient side
        const date = new Date()
        labNotebook.date = date
        labNotebook.version = 0.5
        labNotebook.flickerVersion = 0.3

        console.log("labNotebook", labNotebook)
        ctx.body = "---\n" + yaml.safeDump(labNotebook)
    } else if (submitButton==="preview") {
        let s = program[sid].next()
        ctx.body = ""
        while (s.done===false) {
            ctx.body=ctx.body+JSON.stringify(s.value)+"\n"
            s = program[sid].next()
        }
    } else if (submitButton==="estimate duration") {
        let s = program[sid].next()
        let lifespan = 0
        while (s.done===false) {
            lifespan=lifespan+s.value.lifespan
            s = program[sid].next()
        }
        let seconds = lifespan
        let minutes = Math.floor(seconds/60)
        seconds = Math.ceil(seconds%60)
        ctx.body = minutes+" minutes "+seconds+" seconds"
    } else if (submitButton==="view source code") {
        ctx.body = labNotebook.epl
    }
    ctx.status = 200
})

// store all vms here
let program = {}
let windows = {}
let notebooks = {}


// Return the program id
router.post("/analysis/start-program", ctx => {
    const sid = uuid.v4()
    const body = ctx.request.body
    if (body.programType==="YAML") {
        ctx.body = "YAML deprecated"
        ctx.status = 501
    } else if (body.programType==="javascript") {
        // legacy
        program[sid] = compileJSProgram(body.program, body.seed, body.windowHeight,
            body.windowWidth)

        ctx.body = sid
        ctx.status = 200
    } else {
        program[sid] = compileJSProgram(body.epl, body.seed, body.windowHeight,
            body.windowWidth)

        ctx.body = sid
        ctx.status = 200
    }

})
router.post("/analysis/run-program", ctx => {
    const sid = uuid.v4()
    const body = ctx.request.body
    let p = compileJSProgram(body.epl, body.seed, body.windowHeight,
            body.windowWidth)

    let metadata = p.metadata
    let stimulusList = []
    let n = p.next()
    while ( n.done===false) {
        stimulusList.push(n)
        n = p.next()
    }
    delete p
    ctx.body = {metadata: metadata, stimulusList: stimulusList}
    ctx.status = 200

})

// give metadata for a given program (id)
router.get("/analysis/metadata/:sid", ctx => {
    const sid = ctx.params.sid
    ctx.body = program[sid].metadata
    ctx.status = 200
})


// give the next value for a given program (id)
router.get("/analysis/run/:sid", ctx => {
    const sid = ctx.params.sid
    ctx.body = program[sid].next()
    if (ctx.body.done===true) {
        delete program[sid]
    }
    ctx.status = 200
})



app
    .use(serve("static"))
    .use(router.routes())
    .use(router.allowedMethods());

render(app, {
    root: path.join(__dirname, "../view"),
    layout: false,
    viewExt: "html",
    cache: false,
    debug: true
});

app.context.render = co.wrap(app.context.render);

app.use(async (ctx, next) => {
    await ctx.render("index");
});

// IO
io.attach( app )
// var clients = [];
io.on("connection", function (ctx) {
  // console.log( "User connected!!!" )
  // clients.push(socket.id);
});


io.on("disconnect", function(ctx) {
    //https://github.com/LearnBoost/socket.io-client/issues/251
    // console.log( "User disconnected" )
    // io.reconnect();

});

// io.on("window", (ctx, data) => {
//     // console.log("in window")
//     console.log("got windowHeight", data.windowHeight)
//     ctx.session.windowHeight = data.windowHeight
//     ctx.session.windowWidth = data.windowWidth
// })

io.on("test", (ctx) => {
    var session = ctx.session;
    session.count = session.count || 0;
    session.count++;
    // console.log("test", ctx.session)
    // console.log("test get windowHeight", ctx.session.windowHeight)
})

io.on("reset", (ctx, data) => {
    console.log("socket 'reset'")

    const sid = data.sid
    io.broadcast("reset")
    delete program[sid]
})

io.on("load", (ctx, data) => {
    const sid = data.sid
    const eplProgram = data.program
    const seed = data.seed
    let epl = data.epl
    console.log("windows", windows, sid)
    const windowHeight = windows[sid].windowHeight
    const windowWidth = windows[sid].windowWidth
    console.log(windowHeight, windowWidth)
    if (eplProgram==="custom") {
        // program already loaded in epl
    } else {
        // this is likely a security vulnerability but sure is convenient
        // convention over customization
        epl = fs.readFileSync(
            '/www/src/programs/'+eplProgram+'.js',
            "utf-8")
    }
    console.log("socket 'load': compiling for sid", sid)
    program[sid] = compileJSProgram(epl, seed, windowHeight,
        windowWidth)
    // let f = "() => {console.log(" + program[sid].preRender()+")}"
    // io.broadcast("pre-render", {preRender: f})
    console.log("finished loading, triggering pre-render")
    io.broadcast("pre-render", {func: program[sid].preRenderFunc,
        args: program[sid].preRenderArgs})
})

io.on("renderResults", (ctx, data) => {
    console.log("socket 'renderResults'")
    const sid = data.sid
    program[sid].initialize(data.renderResults)
})

io.on("target", ctx => {
    console.log("socket 'target'")
    io.broadcast("target")
})
// ctx.session.on("error", function (err) {
//     console.log("Redis error " + err);
// });

app.listen(3000);
