// Compile and run EyeCandy Programming Language
// const {VM} = require('vm'); // TODO security risk, only for debug
const {VM} = require('vm2');
const Types = require("./types")
const Render = require("./render")
const Random = require("./random")
const Misc = require("./misc")
const Generators = require("./generators")

const math = require("./math")
const {DATADIR} = require('../vars.js')
const R = require("ramda")


// this object has all values usable in EPL
// TODO: should this also be available for preRenderFuncWrapper?
let EPL = Object.assign({log: console.log, JSON: JSON, DATADIR: DATADIR}, {R: R},
                        Types, Render, Random, math, Misc, Generators)

function compileJSProgram(programJS,seed, windowHeight, windowWidth) {
    console.log('compiling EPL.')
    // FOR VM2 (production)
    // note: if changing this, also must change preRenderFuncWrapper
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
    // this function will be passed as string and run on client. websocket cannot send a function
    let preRenderFunc = vm.run(
        "if (typeof preRenderFunc !== 'undefined') {" +
            "preRenderFunc.toString()" +
            "} else {" +
                "'function* preRenderFunc() {" +
                        "" +
                    "}'" +
            "}")
    // preRenderArgs is an object that has either args (an array)
    // or keys njobs (int value) and indices (0..njobs-1) with array values

// amazingly, without binding {} to preRenderDefault means object is ignored
// #javascriptquirk

    console.log("eval preRenderArgs")
    let preRenderArgs = vm.run(
        "let preRenderDefault = {args: [undefined]};" +
        "if (typeof preRenderArgs !== 'undefined') {" +
            "preRenderArgs" +
            "} else {" +
                "preRenderDefault" +
            "}")
    console.log("eval preRenderArgs success")

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
    console.log("preRenderArgs", preRenderArgs)
    return {vm: vm, metadata: metadata,
            preRenderFunc: preRenderFunc,
            preRenderArgs: preRenderArgs,
            initialize: initialize,
            next: nextStimulus,
            epl: programJS
        }
}

exports.compileJSProgram = compileJSProgram
