const metadata = {name: "eyechart-saccade", version: "0.1.0"}

let repetitions = 100

let nsizes = 8
let startLogMAR = 2.1
let logMarStep = 0.1
let fixationTime = 0.5

const nrows = nsizes
const ncols = 5

function logMARtoLetterPx(logMAR, pxPerDegree=12.524) {
    let degrees = pow(10,logMAR)/60
    // letter E has 2.5 wavelengths
    return round(degrees*pxPerDegree*2.5)
}

function* balancedLetterMatrix(nrows,ncols, reps=repetitions) {
    // 3d tensor
    let toReturn = [...Array(nrows).keys()].map(x => Array(ncols))

    for (var row = 0; row < nrows; row++) {
        for (var column = 0; column < ncols; column++) {
            toReturn[row][column] = repeatedLetterCohorts(letters, reps)
        }
        
    }

    for (var i = 0; i < reps; i++) {
        // yield 2D tensor
        yield toReturn.map(row =>
            row.map(column => 
                column[i]))
    }
}

function renderLetter(context, letter, size, color, x, y) {
    context.fillStyle = color
    context.font = size+'px Sloan'
    context.fillText(letter, x, y)
}


function makeEyechart(size, padding, fixationTime) {
    const fullSize  = size + padding

    const width = nrows * fullSize
    const height = ncols * fullSize

    // pre-render eyechart
    var image = document.createElement("canvas");
    image.width = width;
    image.height = height;
    const letterMatrix = balancedLetterMatrix(nrows, ncols, 1)[0]
    let letter, x, y, fixationPoints, fixationTimes
    for (var i = 0; i < nrows; i++) {
        for (var j = 0; j < ncols; j++) {
            letter = letterMatrix[i][j]
            x = j*fullSize+padding/2
            y = i*fullSize+size+padding/2
            renderLetter(image, letter, size, color, x, y)
            fixationPoints.push({fixationX: x+size/2,
                                 fixationY: y+size/2})
            fixationTimes.push(fixationTime)
        }    
    }
    return new ImageSaccade(sum(fixationTimes),'black',image,
                            fixationPoints, fixationTimes)
}

function preRender(reps=repetitions) {
    // TODO
    let renders = []
    for (var i = 0; i < reps; i++) {
        // yield 2D tensor
        yield toReturn.map(row =>
            row.map(column => 
                column[i]))
    }
}

let eyechart = makeEyechart(100,100,1)
stimuli = [new ImageSaccade(eyechart.lifespan,'black',eyechart.image,
                            eyechart.fixationPoints,
                            eyechart.fixationTimes)]


let stimulusGenerator = stimuli
