const metadata = {name: "eyechart-saccade", version: "0.1.0"}

let repetitions = 1

let nsizes = 8
let startLogMAR = 2.1
let logMarStep = 0.1
let fixationTime = 0.5

const nrows = nsizes
const ncols = 5
const color = 'black'

function logMARtoLetterPx(logMAR, pxPerDegree=12.524) {
    let degrees = pow(10,logMAR)/60
    // letter E has 2.5 wavelengths
    return round(degrees*pxPerDegree*2.5)
}

let sizes = [...Array(nsizes).keys()].map(
    x => x*logMarStep+startLogMAR).map(
    x => logMARtoLetterPx(x))

// big to small
sizes.reverse()


let letters = ["C", "D", "H", "K", "N", "O", "R", "S", "V", "Z"]

function repeatedLetterCohorts(letters, reps) {
    // retain balance per cohort while random letters within
    let newLetters = []
    for (var i = 0; i < reps; i++) {
        r.shuffle(letters)
        newLetters = newLetters.concat(letters.slice())
    }
    return newLetters
}

function balancedLetterMatrix(nrows,ncols, reps) {
    // 3d tensor
    let toReturn = [...Array(nrows).keys()].map(x => Array(ncols))

    for (var row = 0; row < nrows; row++) {
        for (var column = 0; column < ncols; column++) {
            toReturn[row][column] = repeatedLetterCohorts(letters, reps)
        }
        
    }

    return toReturn
}

let letterTensor = balancedLetterMatrix(nrows, ncols, repetitions)


// special function for pre-rendering
function preRenderFunc(sizes, reps, fixationTime, ncols, color, letterTensor) {


    function renderLetter(context, letter, size, color, x, y) {
        console.log("renderLetter")
        context.fillStyle = color
        context.font = size+'px Sloan'
        context.fillText(letter, x, y)
    }


    function makeEyechart(sizes, fixationTime, ncols, letterMatrix, color) {
        console.log("makeEyechart")
        let width = Math.max(...sizes) * (ncols*2+1)
        let nrows = sizes.length
        let size
        let height = 0

        for (size of sizes) {
            // proportional padding
            height = height + 2*size
        }
        console.log(letterMatrix)
        console.log(sizes)
        // pre-render eyechart
        var canvas = document.createElement("canvas");
        var context = canvas.getContext("2d")
        canvas.width = width;
        canvas.height = height;
        let x = 0
        let y = 0
        let fixationPoints = []
        let letter
        for (var i = 0; i < nrows; i++) {
            size = sizes[i]
            console.log("size", size)
            // padding
            x = x + size
            for (var j = 0; j < ncols; j++) {
                // padding
                y = y + size
                console.log("about to log letter")
                letter = letterMatrix[i][j]
                console.log("letter", letter)
                renderLetter(context, letter, size, color, x, y)
                fixationPoints.push({x: x+size/2,
                                     y: y+size/2})

                // start next col beside letter
                y = y + size
            }
            y = 0
            // start next row below letter
            x = x + size 
        }
        return [canvas, fixationPoints]
    }

    // actual function start

    let nrows = sizes.length
    let eyecharts = []
    
    let eyeFixations = []
    for (var rep = 0; rep < reps; rep++) {
        let [image, fixationPoints] = makeEyechart(sizes, fixationTime, ncols,
                                                   letterTensor[rep], color)
        eyecharts.push(image)
        eyeFixations.push(fixationPoints)
    }
    return {eyecharts: eyecharts, eyeFixations: eyeFixations}
}

// special object for pre-rendering
const preRenderArgs = [sizes, repetitions, fixationTime, ncols, color, letterTensor]

function* stimulusGenerator(renderResults) {
    let eyecharts = renderResults.eyecharts
    let eyeFixations = renderResults.eyeFixations
    for (eyechart of eyecharts) {
        for (fixation of eyeFixations) {
            stimuli.push(new Image(duration, eyechart, fixation))
        }
    }    
}

