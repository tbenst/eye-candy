const MT = require("mersenne-twister")

let mt

function seed(i) {
    mt = MT(i)
} 

// return random on [0,1)
function random() {
    return mt.random()
}

// [start,end)
function randi(start,end) {
    const range = end - start
    // sample must be divisible by range
    const maxint = 2147483647
    const max = maxint - (maxint%range)
    let r = mt.int()
    while (r>max) {
        r = mt.int()
    }

    return r%range + start

}

// using Fisher and Yates
function shuffle(array) {
    let j
    let a
    for (var i = array.length - 1; i >= 1; i--) {
        j = randi(0,i+1)
        a = array[i]
        array[i] = array[j]
        array[j] = a
    }
    return array
}

exports = {
    seed: seed,
    random: random,
    randi: randi,
    shuffle: shuffle,
}