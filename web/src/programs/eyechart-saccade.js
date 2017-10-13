const metadata = {name: "eyechart-saccade", version: "0.1.0"}

let repetitions = 1

let nsizes = 8
let startLogMAR = 2.1
let logMarStep = 0.1
let fixationTime = 0.5
const nrows = nsizes
const color = 'black'

// hardcoded
const ncols = 5

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

// hardcoded 10 letters and 5 columns
function twoLetterMatrices(nrows) {
    // retain balance per cohort while random letters within
    let letterMatrices = []
    let newLetters
    letterMatrices[0] = [...Array(nrows).keys()].map(x => Array(ncols))
    letterMatrices[1] = [...Array(nrows).keys()].map(x => Array(ncols))
    for (var i = 0; i < nrows; i++) {
        r.shuffle(letters)
        newLetters = letters.slice()
        for (var j = 0; j < ncols; j++) {
            letterMatrices[0][i][j] = newLetters[j]
            letterMatrices[1][i][j] = newLetters[j+5]
        }
    }
    log("letterMatrices!!", letterMatrices)
    return letterMatrices
}

// function balancedLetterMatrix(nrows,ncols, reps) {
//     // 3d tensor
//     let toReturn = [...Array(nrows).keys()].map(x => Array(ncols))

//     for (var row = 0; row < nrows; row++) {
//         for (var column = 0; column < ncols; column++) {
//             toReturn[row][column] = repeatedLetterCohorts(letters, reps)
//         }
        
//     }

//     return toReturn
// }

let letterTensor = []

for (var rep = 0; rep < repetitions; rep++) {
    // one cohort is two eyecharts (10 letters each size)
    let [firstLetterMatrix, secondLetterMatrix] = twoLetterMatrices(nrows)
    letterTensor.push(firstLetterMatrix)
    letterTensor.push(secondLetterMatrix)
}



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
                console.log("about to log letter", i, j)
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
    console.log('TENSOR', letterTensor)

    let nrows = sizes.length
    let eyecharts = []
    
    let eyeFixations = []
    for (var i = 0; i < letterTensor.length; i++) {
        console.log("letterTensor[i]", letterTensor[i])
        let [image, fixationPoints] = makeEyechart(sizes, fixationTime, ncols,
                                                   letterTensor[i], color)
        eyecharts.push(image)
        eyeFixations.push(fixationPoints)
    }
    return {renders: eyecharts,
            yield: {eyeFixations: eyeFixations}}
}

// special object for pre-rendering
const preRenderArgs = [sizes, repetitions, fixationTime, ncols, color, letterTensor]

function* stimulusGenerator(renderResults) {
    log("got shit", renderResults)
    let eyeFixations = renderResults.eyeFixations
    let fixationPoints
    for (var i = 0; i < eyeFixations.length; i++) {
        fixationPoints = eyeFixations[i]
        for (fixation of fixationPoints) {
            // we use index to refer to client-side render
            // // TODO include cohort (pairs)
            yield new Image(fixationTime, 'black', i, fixation)
        }
    }
}
    // let eyecharts = renderResults.eyecharts
    // let eyeFixations = renderResults.eyeFixations
    // for (eyechart of eyecharts) {
    //     for (fixation of eyeFixations) {
    //         stimuli.push(new Image(duration, eyechart, fixation))
    //     }
    // }    
