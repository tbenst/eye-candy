const yaml = require('js-yaml');
const programs = require("./programs")
const orientationSelectivityGen = programs.orientationSelectivityGen
const stimulusCreator = programs.stimulusCreator

// import {store} from './store'

const STIMULUS = {
    BAR: 'BAR',
    SOLID: 'SOLID',
    WAIT: 'WAIT',
    TARGET: 'TARGET',
    GRATING: 'GRATING',
    CHECKERBOARD: "CHECKERBOARD"
}

function* buildGenerator(formYAML, windowHeight, windowWidth) {
	const userProgram = yaml.safeLoad(formYAML)

	for (var i = 0; i < userProgram.length; i++) {
		const stimJSON = userProgram[i]
		if ('with_nested' in stimJSON) {
			let nestedGen = buildNestedGen(stimJSON.with_nested)
			let n = nestedGen.next()
			while (n.done === false) {
				let list = stimJSON.list
				for (var j = 0; j < list.length; j++) {
					// console.log('on list item ', list[j])
					const innerStimType = Object.keys(list[j])[0]
					const stimulus = list[j][innerStimType]
					let toYield = {}
					toYield[innerStimType] = fillInItems(stimulus, n.value)
					// get name/key of stimulus
					// console.log('buildGenerator', stimulus, n.value, fillInItems(stimulus, n.value))
					yield stimulusCreator(toYield, windowHeight, windowWidth)
				}
				n = nestedGen.next()
			}
		} else {
			yield stimulusCreator(stimJSON, windowHeight, windowWidth)
		}
	}
}

exports.buildGenerator = buildGenerator

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

// function formToLabNotebook(formJSON) {	
// }