const bodyParser = require("koa-bodyparser");
const koaSession = require("koa-generic-session");

const Koa = require("koa");
const router = require("koa-router")();
const path = require("path")
const co = require("co");
const cookie = require("cookie")
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

const io = new IO()
const store = new redisStore({host: "redis"})

var session = koaSession({
    store: store,
    secret: "1nkj98sdfa1will",
    resave: true,
    saveUninitialized: true
});


app.keys = ["8r92scsdf6", "jnt356gc"];
app
    .use(convert(session))
    .use(bodyParser({jsonLimit: '50mb', formLimit: "50mb"}));

io.use(koaSocketSession(app, session))


router.post("/window", (ctx) => {
    // console.log("got window")
    var session = ctx.session;
    session.windowHeight = ctx.request.header.windowheight
    session.windowWidth = ctx.request.header.windowwidth
    ctx.body = session;   
});

router.post("/next-stimulus",  (ctx) => {
    // console.log("next-stimulus", ctx.session)
    const sid = cookie.parse(ctx.request.header.cookie)["koa.sid"];
    const stimulus = program[sid].next()
    console.log(stimulus)
    ctx.body = stimulus
    ctx.status = 200
});

router.get("/hello", ctx => {
    ctx.body = 'Hello Koaer3';
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
    var session = ctx.session
    console.log("height,width",session.windowHeight,session.windowWidth)
    const sid = cookie.parse(ctx.request.header.cookie)["koa.sid"];
    let labNotebook = Object.assign({},ctx.request.body)
    let {submitButton} = labNotebook
    delete labNotebook.submitButton

    if (labNotebook.program==="custom") {
        // program already loaded in labNotebook.epl
    } else {
        // this is likely a security vulnerability but sure is convenient
        // convention over customization
        labNotebook.epl = fs.readFileSync(
            '/www/src/programs/'+labNotebook.program+'.js',
            "utf-8")
    }
    program[sid] = compileJSProgram(sid, labNotebook.epl, labNotebook.seed, session.windowHeight,
        session.windowWidth)

    if (submitButton==="start") {

        let stimulusQueue = []
        for (var i = 0; i < 5; i++) {
            stimulusQueue.push(program[sid].next())
        }
        console.log(stimulusQueue)
        io.broadcast("run", stimulusQueue)

        labNotebook.windowHeight = session.windowHeight
        labNotebook.windowWidth = session.windowWidth
        const date = new Date()
        labNotebook.date = date
        labNotebook.version = 0.5
        labNotebook.flickerVersion = 0.3


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


// Return the program id
router.post("/analysis/start-program", ctx => {
    const sid = uuid.v4()
    const body = ctx.request.body
    if (body.programType==="YAML") {
        ctx.body = "YAML deprecated"
        ctx.status = 501
    } else if (body.programType==="javascript") {
        // legacy
        program[sid] = compileJSProgram(sid, body.program, body.seed, body.windowHeight,
            body.windowWidth)

        ctx.body = sid
        ctx.status = 200
    } else {
        program[sid] = compileJSProgram(sid, body.epl, body.seed, body.windowHeight,
            body.windowWidth)

        ctx.body = sid
        ctx.status = 200
    }

})

// give the next value for a given program (id)
router.get("/analysis/program/:sid", ctx => {
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

io.on("reset", ctx => {
    io.broadcast("reset")
})

io.on("target", ctx => {
    io.broadcast("target")
})
// ctx.session.on("error", function (err) {
//     console.log("Redis error " + err);
// });

app.listen(3000);