function flatten(arr) {
    return arr.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), [])
}

exports.flatten = flatten
