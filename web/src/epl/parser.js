const yaml = require('js-yaml');
const {calcLifespan} = require("./epl")
const orientationSelectivityGen = programs.orientationSelectivityGen
const YAMLstimulusCreator = programs.YAMLstimulusCreator


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
					yield YAMLstimulusCreator(toYield, windowHeight, windowWidth)
				}
				n = nestedGen.next()
			}
		} else {
			yield YAMLstimulusCreator(stimJSON, windowHeight, windowWidth)
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

function YAMLstimulusCreator(stimulusJSON, windowHeight, windowWidth) {
    // console.log('YAMLstimulusCreator', stimulusJSON)
    const stimType = Object.keys(stimulusJSON)[0]
    const unprocessed_stimulus = jsonValueToNum(stimulusJSON[stimType])
    const speed = unprocessed_stimulus.speed
    const width = unprocessed_stimulus.width
    const time = unprocessed_stimulus.time
    const frames = unprocessed_stimulus.frames
    var lifespan
    if (time>0 || frames>0) {
        lifespan = calcLifespan(time,frames)
    }
    var stimulus
    switch (stimType.toUpperCase()) {
        case STIMULUS.BAR:
            stimulus = barSC({"lifespan":
                calcBarLifespan(speed, width, windowHeight, windowWidth),
                "backgroundColor": unprocessed_stimulus.backgroundColor,
                "barColor": unprocessed_stimulus.barColor,
                "speed": speed, "width": width,
                "angle": unprocessed_stimulus.angle})
            break
        case STIMULUS.SOLID:
            stimulus = solidSC(lifespan,
                          unprocessed_stimulus.backgroundColor)
            break
        case STIMULUS.WAIT:
            stimulus = waitSC(lifespan)
            break
        case STIMULUS.TARGET:
            stimulus = {stimulusType: STIMULUS.TARGET, lifespan: lifespan,
                backgroundColor: 'black'}
            break
        case STIMULUS.GRATING:
            stimulus = gratingSC(calcGratingLifespan(speed, width, windowHeight, windowWidth, unprocessed_stimulus.wavelength,
                unprocessed_stimulus.numberOfBars, unprocessed_stimulus.time),
                unprocessed_stimulus.backgroundColor, unprocessed_stimulus.barColor,
                speed, width, unprocessed_stimulus.angle, unprocessed_stimulus.wavelength,
                unprocessed_stimulus.numberOfBars)
            break
        case STIMULUS.CHECKERBOARD:
            stimulus = checkerboardSC(lifespan,unprocessed_stimulus.size,unprocessed_stimulus.period,
                unprocessed_stimulus.color,unprocessed_stimulus.alternateColor)
            break
    }
    return stimulus
}

exports.YAMLstimulusCreator = YAMLstimulusCreator

function jsonValueToNum(myJSON) {
    // console.log('jsonValueToNum', myJSON)
    const keys = Object.keys(myJSON)
    let retJSON = Object.assign({}, myJSON)
    for (var i = 0; i < keys.length; i++) {
        if (['angle', 'speed', 'width', 'time', 'wavelength', "frames"].includes(keys[i])) {
            retJSON[keys[i]] = valueToNum(retJSON[keys[i]])
        }
    }
    return retJSON
}

function valueToNum(myString) {
    const pattern = /^([\d\*\+\-\/]|PI|pow|sqrt|sin|cos)+$/
    if (pattern.exec(myString)) {
        return eval(myString)
    }
}