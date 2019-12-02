const metadata = {name: "test", version: "0.1.0"}

function* stimulusGenerator(renderResults) {
    yield new Wait(2)
    yield new Solid(2, "white")
    yield new Wait(2)
    yield new Wait(2)
    yield new Solid(2, "white")
    yield new Wait(2)
}
