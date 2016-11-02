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
var uuid = require("node-uuid");
const logger = require("koa-logger")
const yaml = require("js-yaml")
const {VM} = require('vm2');

const random = require("./random")
const buildGenerator = require("./parser").buildGenerator
const programs = require("./programs")
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
    const sid = cookie.parse(ctx.request.header.cookie)["koa.sid"];
    const form = ctx.request.body
    if (form.programType=="YAML") {
        createYAMLProgram(sid, form.program, form.seed, session.windowHeight,
            session.windowHeight)
    } else if (form.programType=="javascript") {
        createJSProgram(sid, form.program, form.seed, session.windowHeight,
            session.windowHeight)
    }
    if (form.submitButton==="start") {

        let stimulusQueue = []
        for (var i = 0; i < 5; i++) {
            stimulusQueue.push(program[sid].next())
        }
        console.log(stimulusQueue)
        io.broadcast("run", stimulusQueue)

        let labNotebook = ctx.request.body
        labNotebook.windowHeight = session.windowHeight
        labNotebook.windowWidth = session.windowWidth
        const date = new Date()
        labNotebook.date = date
        labNotebook.windowWidth = session.windowWidth
        labNotebook.version = 0.4

        ctx.body = "---\n" + yaml.safeDump(labNotebook)
    } else if (form.submitButton==="preview") {
        let s = program[sid].next()
        ctx.body = ""
        while (s.done===false) {
            ctx.body=ctx.body+JSON.stringify(s.value)+"\n"
            s = program[sid].next()
        }
    } else if (form.submitButton==="estimate duration") {
        let s = program[sid].next()
        let lifespan = 0
        while (s.done===false) {
            lifespan=lifespan+s.value.lifespan
            s = program[sid].next()
        }
        let seconds = lifespan/120
        let minutes = Math.floor(seconds/60)
        seconds = Math.ceil(seconds%60)
        ctx.body = minutes+" minutes "+seconds+" seconds"
    }
    ctx.status = 200
})

// store all vms here
let program = {}

function createJSProgram(sid,programJS,seed, windowHeight, windowWidth) {
    const vm = new VM({
        sandbox: {checkerboardSC: programs.checkerboardSC,
            solidSC: programs.solidSC,
            waitSC: programs.waitSC,
            barSC: programs.barSC,
            gratingSC: programs.gratingSC,
            getDiagonalLength: programs.getDiagonalLength,
            calcGratingLifespan: programs.calcGratingLifespan,
            calcBarLifespan: programs.calcBarLifespan,
            DeterministicRandom: random.DeterministicRandom,
            windowHeight: windowHeight,
            windowWidth: windowWidth,
            seed: seed
        },
    });
    // we use stimulus index to ensure correct order and avoid race condition
    vm.run("let r = new DeterministicRandom(seed);"+
        "const p = function* () {" +
        programJS +
        "}; let generator = p(); " +
        "let s='uninitialized'; let si = 0;");
    let functionInSandbox = () => {return vm.run(
        's = generator.next();'+
        's.stimulusIndex=si; si++;'+
        's;')}
    program[sid] = {vm: vm, next: functionInSandbox}
}

function createYAMLProgram(sid,programYAML,seed, windowHeight, windowWidth) {
        const vm = new VM({
            sandbox: {buildGenerator: buildGenerator,
                programYAML: programYAML,
                windowHeight: windowHeight,
                windowWidth: windowWidth,
                seed: seed
            },
        });
        // we use stimulus index to ensure correct order and avoid race condition
        vm.run("let generator = buildGenerator("+
            "programYAML,windowHeight,windowWidth);"+
            "let s='uninitialized'; let si = 0;");
        let functionInSandbox = () => {return vm.run(
            's = generator.next();'+
            's.stimulusIndex=si; si++;'+
            's;')}
        program[sid] = {vm: vm, next: functionInSandbox}
}

// Return the program id
router.post("/analysis/start-program", ctx => {
    const sid = uuid.v4()
    const body = ctx.request.body
    if (programType==="YAML") {
        createYAMLProgram(sid, body.program, body.seed, body.windowHeight,
            body.windowHeight)
    } else if (programType==="javascript") {
        createJSProgram(sid, body.program, body.seed, body.windowHeight,
            body.windowHeight)
    }

    ctx.body = sid
    ctx.status = 200
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