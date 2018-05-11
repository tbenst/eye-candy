// Compile and run EyeCandy Programming Language
const {VM} = require('vm2');
const Types = require("./types")
const Render = require("./render")
const Random = require("./random")
const Misc = require("./misc")

const math = require("./math")
const R = require("ramda")


// this object has all values usable in EPL
let EPL = Object.assign({log: console.log, JSON: JSON}, {R: R},
                        Types,Render,Random,math,Misc)

function compileJSProgram(programJS,seed, windowHeight, windowWidth) {
    console.log('compiling EPL.')
    let renderResults = {}
    const vm = new VM({
        sandbox: Object.assign({
            windowHeight: windowHeight,
            windowWidth: windowWidth,
            seed: seed,
            renderResults: renderResults
        }, EPL),
        console: 'inherit'
    });

    // initialize program
    vm.run("let r = new DeterministicRandom(seed);" + programJS)

    const metadata = vm.run("metadata")
    
    // this function will be passed as string and run on client
    let preRenderFunc = vm.run(
            "if (typeof preRenderFunc !== 'undefined') {" +
                "preRenderFunc.toString()" +
                "} else {" +
                    "'function preRenderFunc() {" +
                            "return {renders: undefined, yield: undefined}" +
                        "}'" +
                "}")
    let preRenderArgs = vm.run(
            "if (typeof preRenderArgs !== 'undefined') {" +
                "preRenderArgs" +
                "} else {" +
                    "[undefined]" +
                "}")

    console.log("eval preRenderFunc")
    function initialize(clientResults) {
        console.log("Initializing EPL stimulus generator")
        // TODO warning: will this potentially break with multiple connections?
        renderResults.yield = clientResults
        // console.log("renderResults outside VM:", renderResults)
        // let r
        // if (renderResults===undefined) {
        //     r = "undefined"
        // } else {
        //     r = renderResults.toString()
        // }
        // console.log("renderResults", renderResults.yield)
        // we use stimulus index to ensure correct order and
        // avoid race condition
        // vm.run("log('renderResults inside VM:', renderResults.yield)")
        vm.run("let generator = stimulusGenerator(renderResults.yield); " +
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
        }
}

exports.compileJSProgram = compileJSProgram
