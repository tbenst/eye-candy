// Compile and run EyeCandy Programming Language
const {VM} = require('vm2');
const Types = require("./types")
const Render = require("./render")
const Random = require("./random")
const Misc = require("./misc")

const math = require("./math")


// this object has all values usable in EPL
let EPL = Object.assign({log: console.log},Types,Render,Random,math,Misc)

function compileJSProgram(sid,programJS,seed, windowHeight, windowWidth) {
    console.log('compiling EPL.')
    const vm = new VM({
        sandbox: Object.assign({
            windowHeight: windowHeight,
            windowWidth: windowWidth,
            seed: seed
        }, EPL),
        console: 'inherit'
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
    let metadata = () => {return vm.run('metadata;')}
    return {vm: vm, next: functionInSandbox, metadata: metadata}
}
exports.compileJSProgram = compileJSProgram