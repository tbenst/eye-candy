
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
            PI: Math.PI,
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
    return {vm: vm, next: functionInSandbox}
}

function createYAMLProgram(sid,programYAML,seed, windowHeight, windowWidth) {
        const vm = new VM({
            sandbox: {buildGenerator: buildGenerator,
                programYAML: programYAML,
                windowHeight: windowHeight,
                windowWidth: windowWidth,
                PI: Math.PI,
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
        return {vm: vm, next: functionInSandbox}
}