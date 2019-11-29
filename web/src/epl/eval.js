// Compile and run EyeCandy Programming Language
// const {VM} = require('vm'); // TODO security risk, only for debug
const {VM} = require('vm2');
const Types = require("./types")
const Render = require("./render")
const Random = require("./random")
const Misc = require("./misc")

const math = require("./math")
const {DATADIR} = require('../vars.js')
const R = require("ramda")


// this object has all values usable in EPL
let EPL = Object.assign({log: console.log, JSON: JSON, DATADIR: DATADIR}, {R: R},
                        Types,Render,Random,math,Misc)

function compileJSProgram(programJS,seed, windowHeight, windowWidth) {
    console.log('compiling EPL.')
    // FOR VM2 (production)
    const vm = new VM({
        sandbox: Object.assign({
            windowHeight: windowHeight,
            windowWidth: windowWidth,
            seed: seed,
        }, EPL),
        console: 'inherit'
    })
    // ---- FOR VM2 ----

    // FOR VM (testing)
    // const sandbox = Object.assign({
    //     windowHeight: windowHeight,
    //     windowWidth: windowWidth,
    //     seed: seed,
    // }, EPL)
    // const vm = VM.createContext(sandbox)
    // ---- FOR VM ----

    // initialize program
    vm.run("let r = new DeterministicRandom(seed);" + programJS)

    console.log("reading program metadata")
    const metadata = vm.run("metadata")
    // this function will be passed as string and run on client
    let preRenderFunc = vm.run(
            "if (typeof preRenderFunc !== 'undefined') {" +
                "preRenderFunc.toString()" +
                "} else {" +
                    "'function* preRenderFunc() {" +
                            "" +
                        "}'" +
                "}")
    let preRenderArgs = vm.run(
            "if (typeof preRenderArgs !== 'undefined') {" +
                "preRenderArgs" +
                "} else {" +
                    "[undefined]" +
                "}")

    console.log("eval preRenderFunc")

    function initialize() {
        console.log("Initializing EPL stimulus generator")

        vm.run("let generator = stimulusGenerator(); " +
                "let s='uninitialized'; let si = 0;");
    }

    function nextStimulus() {
        return vm.run(
        's = generator.next();'+
        's.stimulusIndex=si; si++;'+
        's;')
    }

    return {vm: vm, metadata: metadata,
            preRenderFunc: preRenderFunc,
            preRenderArgs: preRenderArgs,
            initialize: initialize,
            next: nextStimulus,
            epl: programJS
        }
}

exports.compileJSProgram = compileJSProgram
