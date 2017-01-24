const MT = require("mersennetwister")

class DeterministicRandom {
    constructor(seed) {
        this.mt = new MT(seed)
    }

    // using Fisher and Yates
    shuffle(array) {
        let j
        let a
        for (var i = array.length - 1; i >= 1; i--) {
            j = this.randi(0,i+1)
            a = array[i]
            array[i] = array[j]
            array[j] = a
        }
        return array
    }
    
    // return random on [0,1)
    random() {
        return this.mt.random()
    }

    // [start,end)
    randi(start,end) {
        const range = end - start
        // sample must be divisible by range
        const maxint = 2147483647
        const max = maxint - (maxint%range)
        let r = this.mt.int()
        while (r>max) {
            r = this.mt.int()
        }

        return r%range + start

    }
}

exports.DeterministicRandom = DeterministicRandom