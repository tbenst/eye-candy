const yaml = require('js-yaml');
import {orientationSelectivityGen, calcLifespan, stimulusCreator} from './programs'
// import {store} from './store'

const STIMULUS = {
    BAR: 'BAR',
    SOLID: 'SOLID',
    WAIT: 'WAIT',
    TARGET: 'TARGET'
}

export function* buildGenerator(formYAML) {
	const userProgram = yaml.safeLoad(formYAML)

	for (var i = 0; i < userProgram.length; i++) {
		const stimJSON = userProgram[i]
		const stimType = Object.keys(stimJSON)[0]
		const stimulus = stimJSON[stimType]
		if (stimJSON.with_nested != undefined) {
			let nestedGen = buildNestedGen(stimJSON.with_nested)
			let n = nestedGen.next()
			while (n.done === false) {
				let toYield = {}
				toYield[stimType] = stimulusCreator(fillInItems(stimulus, n.value))
				// get name/key of stimulus
				// console.log('buildGenerator', stimulus, n.value, fillInItems(stimulus, n.value))
				yield toYield
				n = nestedGen.next()
			}
		} else {
			yield stimulusCreator(stimulus)
		}
	}
}

// replace all 'items[i]' with ith item from arr
function fillInItems(stimulusJSON, arr) {
	let retJSON = Object.assign({}, stimulusJSON)
	const pattern = /items\[(\d+)\]/;
	const keys = Object.keys(retJSON)
	for (var i = 0; i < keys.length; i++) {
		const match = pattern.exec(retJSON[keys[i]]);
		if (match) {
			retJSON[keys[i]] = arr[Number(match[1])].toString()
		}
	}
	// console.log('fillInItems return ', retJSON)
	return retJSON
}


// for example:
// x = buildNestedGen([['a','b'], [0,1,2,3], ['x','y','z']]);
// x.next()
// would first return ['a', '0', 'x'], then ['a', '0', 'y']...
function buildNestedGen(arg) {
    // let r = []
    const max = arg.length-1;
    function* helper(arg, arr, i) {
        for (var j=0, l=arg[i].length; j<l; j++) {
            var a = arr.slice(0); // clone arr
            a.push(arg[i][j]);
            if (i==max) {
                yield a;
            } else {
                yield* helper(arg, a, i+1);
            }
        }
    }

    return helper(arg, [], 0);
}
