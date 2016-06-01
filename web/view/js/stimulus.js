(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(factory());
}(this, function () { 'use strict';

	var babelHelpers = {};

	babelHelpers.toConsumableArray = function (arr) {
	  if (Array.isArray(arr)) {
	    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

	    return arr2;
	  } else {
	    return Array.from(arr);
	  }
	};

	babelHelpers;


	var __commonjs_global = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : this;
	function __commonjs(fn, module) { return module = { exports: {} }, fn(module, module.exports, __commonjs_global), module.exports; }

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeGetPrototype = Object.getPrototypeOf;

	/**
	 * Gets the `[[Prototype]]` of `value`.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {null|Object} Returns the `[[Prototype]]`.
	 */
	function getPrototype(value) {
	  return nativeGetPrototype(Object(value));
	}

	/**
	 * Checks if `value` is a host object in IE < 9.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
	 */
	function isHostObject(value) {
	  // Many host objects are `Object` objects that can coerce to strings
	  // despite having improperly defined `toString` methods.
	  var result = false;
	  if (value != null && typeof value.toString != 'function') {
	    try {
	      result = !!(value + '');
	    } catch (e) {}
	  }
	  return result;
	}

	/**
	 * Checks if `value` is object-like. A value is object-like if it's not `null`
	 * and has a `typeof` result of "object".
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 * @example
	 *
	 * _.isObjectLike({});
	 * // => true
	 *
	 * _.isObjectLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isObjectLike(_.noop);
	 * // => false
	 *
	 * _.isObjectLike(null);
	 * // => false
	 */
	function isObjectLike(value) {
	  return !!value && typeof value == 'object';
	}

	/** `Object#toString` result references. */
	var objectTag = '[object Object]';

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/** Used to resolve the decompiled source of functions. */
	var funcToString = Function.prototype.toString;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/** Used to infer the `Object` constructor. */
	var objectCtorString = funcToString.call(Object);

	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objectToString = objectProto.toString;

	/**
	 * Checks if `value` is a plain object, that is, an object created by the
	 * `Object` constructor or one with a `[[Prototype]]` of `null`.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.8.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a plain object,
	 *  else `false`.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 * }
	 *
	 * _.isPlainObject(new Foo);
	 * // => false
	 *
	 * _.isPlainObject([1, 2, 3]);
	 * // => false
	 *
	 * _.isPlainObject({ 'x': 0, 'y': 0 });
	 * // => true
	 *
	 * _.isPlainObject(Object.create(null));
	 * // => true
	 */
	function isPlainObject(value) {
	  if (!isObjectLike(value) ||
	      objectToString.call(value) != objectTag || isHostObject(value)) {
	    return false;
	  }
	  var proto = getPrototype(value);
	  if (proto === null) {
	    return true;
	  }
	  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
	  return (typeof Ctor == 'function' &&
	    Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString);
	}

	var ponyfill = __commonjs(function (module) {
	'use strict';

	module.exports = function symbolObservablePonyfill(root) {
		var result;
		var Symbol = root.Symbol;

		if (typeof Symbol === 'function') {
			if (Symbol.observable) {
				result = Symbol.observable;
			} else {
				result = Symbol('observable');
				Symbol.observable = result;
			}
		} else {
			result = '@@observable';
		}

		return result;
	};
	});

	var require$$0 = (ponyfill && typeof ponyfill === 'object' && 'default' in ponyfill ? ponyfill['default'] : ponyfill);

	var index = __commonjs(function (module, exports, global) {
	/* global window */
	'use strict';

	module.exports = require$$0(global || window || __commonjs_global);
	});

	var $$observable = (index && typeof index === 'object' && 'default' in index ? index['default'] : index);

	/**
	 * These are private action types reserved by Redux.
	 * For any unknown actions, you must return the current state.
	 * If the current state is undefined, you must return the initial state.
	 * Do not reference these action types directly in your code.
	 */
	var ActionTypes = {
	  INIT: '@@redux/INIT'
	};

	/**
	 * Creates a Redux store that holds the state tree.
	 * The only way to change the data in the store is to call `dispatch()` on it.
	 *
	 * There should only be a single store in your app. To specify how different
	 * parts of the state tree respond to actions, you may combine several reducers
	 * into a single reducer function by using `combineReducers`.
	 *
	 * @param {Function} reducer A function that returns the next state tree, given
	 * the current state tree and the action to handle.
	 *
	 * @param {any} [initialState] The initial state. You may optionally specify it
	 * to hydrate the state from the server in universal apps, or to restore a
	 * previously serialized user session.
	 * If you use `combineReducers` to produce the root reducer function, this must be
	 * an object with the same shape as `combineReducers` keys.
	 *
	 * @param {Function} enhancer The store enhancer. You may optionally specify it
	 * to enhance the store with third-party capabilities such as middleware,
	 * time travel, persistence, etc. The only store enhancer that ships with Redux
	 * is `applyMiddleware()`.
	 *
	 * @returns {Store} A Redux store that lets you read the state, dispatch actions
	 * and subscribe to changes.
	 */
	function createStore(reducer, initialState, enhancer) {
	  var _ref2;

	  if (typeof initialState === 'function' && typeof enhancer === 'undefined') {
	    enhancer = initialState;
	    initialState = undefined;
	  }

	  if (typeof enhancer !== 'undefined') {
	    if (typeof enhancer !== 'function') {
	      throw new Error('Expected the enhancer to be a function.');
	    }

	    return enhancer(createStore)(reducer, initialState);
	  }

	  if (typeof reducer !== 'function') {
	    throw new Error('Expected the reducer to be a function.');
	  }

	  var currentReducer = reducer;
	  var currentState = initialState;
	  var currentListeners = [];
	  var nextListeners = currentListeners;
	  var isDispatching = false;

	  function ensureCanMutateNextListeners() {
	    if (nextListeners === currentListeners) {
	      nextListeners = currentListeners.slice();
	    }
	  }

	  /**
	   * Reads the state tree managed by the store.
	   *
	   * @returns {any} The current state tree of your application.
	   */
	  function getState() {
	    return currentState;
	  }

	  /**
	   * Adds a change listener. It will be called any time an action is dispatched,
	   * and some part of the state tree may potentially have changed. You may then
	   * call `getState()` to read the current state tree inside the callback.
	   *
	   * You may call `dispatch()` from a change listener, with the following
	   * caveats:
	   *
	   * 1. The subscriptions are snapshotted just before every `dispatch()` call.
	   * If you subscribe or unsubscribe while the listeners are being invoked, this
	   * will not have any effect on the `dispatch()` that is currently in progress.
	   * However, the next `dispatch()` call, whether nested or not, will use a more
	   * recent snapshot of the subscription list.
	   *
	   * 2. The listener should not expect to see all state changes, as the state
	   * might have been updated multiple times during a nested `dispatch()` before
	   * the listener is called. It is, however, guaranteed that all subscribers
	   * registered before the `dispatch()` started will be called with the latest
	   * state by the time it exits.
	   *
	   * @param {Function} listener A callback to be invoked on every dispatch.
	   * @returns {Function} A function to remove this change listener.
	   */
	  function subscribe(listener) {
	    if (typeof listener !== 'function') {
	      throw new Error('Expected listener to be a function.');
	    }

	    var isSubscribed = true;

	    ensureCanMutateNextListeners();
	    nextListeners.push(listener);

	    return function unsubscribe() {
	      if (!isSubscribed) {
	        return;
	      }

	      isSubscribed = false;

	      ensureCanMutateNextListeners();
	      var index = nextListeners.indexOf(listener);
	      nextListeners.splice(index, 1);
	    };
	  }

	  /**
	   * Dispatches an action. It is the only way to trigger a state change.
	   *
	   * The `reducer` function, used to create the store, will be called with the
	   * current state tree and the given `action`. Its return value will
	   * be considered the **next** state of the tree, and the change listeners
	   * will be notified.
	   *
	   * The base implementation only supports plain object actions. If you want to
	   * dispatch a Promise, an Observable, a thunk, or something else, you need to
	   * wrap your store creating function into the corresponding middleware. For
	   * example, see the documentation for the `redux-thunk` package. Even the
	   * middleware will eventually dispatch plain object actions using this method.
	   *
	   * @param {Object} action A plain object representing “what changed”. It is
	   * a good idea to keep actions serializable so you can record and replay user
	   * sessions, or use the time travelling `redux-devtools`. An action must have
	   * a `type` property which may not be `undefined`. It is a good idea to use
	   * string constants for action types.
	   *
	   * @returns {Object} For convenience, the same action object you dispatched.
	   *
	   * Note that, if you use a custom middleware, it may wrap `dispatch()` to
	   * return something else (for example, a Promise you can await).
	   */
	  function dispatch(action) {
	    if (!isPlainObject(action)) {
	      throw new Error('Actions must be plain objects. ' + 'Use custom middleware for async actions.');
	    }

	    if (typeof action.type === 'undefined') {
	      throw new Error('Actions may not have an undefined "type" property. ' + 'Have you misspelled a constant?');
	    }

	    if (isDispatching) {
	      throw new Error('Reducers may not dispatch actions.');
	    }

	    try {
	      isDispatching = true;
	      currentState = currentReducer(currentState, action);
	    } finally {
	      isDispatching = false;
	    }

	    var listeners = currentListeners = nextListeners;
	    for (var i = 0; i < listeners.length; i++) {
	      listeners[i]();
	    }

	    return action;
	  }

	  /**
	   * Replaces the reducer currently used by the store to calculate the state.
	   *
	   * You might need this if your app implements code splitting and you want to
	   * load some of the reducers dynamically. You might also need this if you
	   * implement a hot reloading mechanism for Redux.
	   *
	   * @param {Function} nextReducer The reducer for the store to use instead.
	   * @returns {void}
	   */
	  function replaceReducer(nextReducer) {
	    if (typeof nextReducer !== 'function') {
	      throw new Error('Expected the nextReducer to be a function.');
	    }

	    currentReducer = nextReducer;
	    dispatch({ type: ActionTypes.INIT });
	  }

	  /**
	   * Interoperability point for observable/reactive libraries.
	   * @returns {observable} A minimal observable of state changes.
	   * For more information, see the observable proposal:
	   * https://github.com/zenparsing/es-observable
	   */
	  function observable() {
	    var _ref;

	    var outerSubscribe = subscribe;
	    return _ref = {
	      /**
	       * The minimal observable subscription method.
	       * @param {Object} observer Any object that can be used as an observer.
	       * The observer object should have a `next` method.
	       * @returns {subscription} An object with an `unsubscribe` method that can
	       * be used to unsubscribe the observable from the store, and prevent further
	       * emission of values from the observable.
	       */

	      subscribe: function subscribe(observer) {
	        if (typeof observer !== 'object') {
	          throw new TypeError('Expected the observer to be an object.');
	        }

	        function observeState() {
	          if (observer.next) {
	            observer.next(getState());
	          }
	        }

	        observeState();
	        var unsubscribe = outerSubscribe(observeState);
	        return { unsubscribe: unsubscribe };
	      }
	    }, _ref[$$observable] = function () {
	      return this;
	    }, _ref;
	  }

	  // When a store is created, an "INIT" action is dispatched so that every
	  // reducer returns their initial state. This effectively populates
	  // the initial state tree.
	  dispatch({ type: ActionTypes.INIT });

	  return _ref2 = {
	    dispatch: dispatch,
	    subscribe: subscribe,
	    getState: getState,
	    replaceReducer: replaceReducer
	  }, _ref2[$$observable] = observable, _ref2;
	}

	/**
	 * Prints a warning in the console if it exists.
	 *
	 * @param {String} message The warning message.
	 * @returns {void}
	 */
	function warning(message) {
	  /* eslint-disable no-console */
	  if (typeof console !== 'undefined' && typeof console.error === 'function') {
	    console.error(message);
	  }
	  /* eslint-enable no-console */
	  try {
	    // This error was thrown as a convenience so that if you enable
	    // "break on all exceptions" in your console,
	    // it would pause the execution at this line.
	    throw new Error(message);
	    /* eslint-disable no-empty */
	  } catch (e) {}
	  /* eslint-enable no-empty */
	}

	/*
	* This is a dummy function to check if the function name has been altered by minification.
	* If the function has been minified and NODE_ENV !== 'production', warn the user.
	*/
	function isCrushed() {}

	if (process.env.NODE_ENV !== 'production' && typeof isCrushed.name === 'string' && isCrushed.name !== 'isCrushed') {
	  warning('You are currently using minified code outside of NODE_ENV === \'production\'. ' + 'This means that you are running a slower development build of Redux. ' + 'You can use loose-envify (https://github.com/zertosh/loose-envify) for browserify ' + 'or DefinePlugin for webpack (http://stackoverflow.com/questions/30030031) ' + 'to ensure you have the correct code for your production build.');
	}

	var _marked = [targetGen, easyGen, orientationSelectivityGen, sampleGen].map(regeneratorRuntime.mark);

	var PI = Math.PI;
	var pow = Math.pow;
	var sqrt = Math.sqrt;
	var sin = Math.sin;
	var cos = Math.cos;

	/************************************************
	REDUX (GLOBAL STATE)
	************************************************/

	// const createStore = Redux.createStore
	// const applyMiddleware = Redux.applyMiddleware

	/***********************************************
	// !!! CHOOSE PROGRAM TO RUN HERE !!!
	************************************************/

	// program = easyGen()
	program = orientationSelectivityGen([500, 1000], [10, 100], 25);
	// program = orientationSelectivityGen([5], [1000], 2)

	// Use this program for aligning projector with MEA
	// program = targetGen()

	/***********************************************/
	// PROGRAMS

	function targetGen() {
	    return regeneratorRuntime.wrap(function targetGen$(_context) {
	        while (1) {
	            switch (_context.prev = _context.next) {
	                case 0:
	                    _context.next = 2;
	                    return { stimulusType: STIMULUS.TARGET, lifespan: 6000,
	                        backgroundColor: 'black' };

	                case 2:
	                case 'end':
	                    return _context.stop();
	            }
	        }
	    }, _marked[0], this);
	}

	function easyGen() {
	    return regeneratorRuntime.wrap(function easyGen$(_context2) {
	        while (1) {
	            switch (_context2.prev = _context2.next) {
	                case 0:
	                    _context2.next = 2;
	                    return { stimulusType: STIMULUS.BAR, lifespan: 300,
	                        backgroundColor: 'black', width: 50, barColor: 'white',
	                        speed: 15, angle: PI };

	                case 2:
	                    _context2.next = 4;
	                    return { stimulusType: STIMULUS.BAR, lifespan: 300,
	                        backgroundColor: 'black', width: 50, barColor: 'white',
	                        speed: 15, angle: PI / 2 };

	                case 4:
	                    _context2.next = 6;
	                    return { stimulusType: STIMULUS.BAR, lifespan: 300,
	                        backgroundColor: 'black', width: 50, barColor: 'white',
	                        speed: 15, angle: 0 };

	                case 6:
	                    _context2.next = 8;
	                    return { stimulusType: STIMULUS.BAR, lifespan: 300,
	                        backgroundColor: 'black', width: 50, barColor: 'white',
	                        speed: 10, angle: PI };

	                case 8:
	                case 'end':
	                    return _context2.stop();
	            }
	        }
	    }, _marked[1], this);
	}

	// angles and widths must have same length
	// generator now calculates lifespan automatically
	// if you want to modify the function (e.g. change the wait times),
	// please copy and create a new function to avoid confusion in
	// analysis
	//
	// speed is pixels / second, width is pixels, angle is radians,
	// lifespan is 1/120 of a second, so 120==1 second
	function orientationSelectivityGen(speeds, widths, numRepeat) {
	    var barColor = arguments.length <= 3 || arguments[3] === undefined ? 'white' : arguments[3];
	    var backgroundColor = arguments.length <= 4 || arguments[4] === undefined ? 'black' : arguments[4];
	    var angles = arguments.length <= 5 || arguments[5] === undefined ? [0, PI / 4, PI / 2, 3 * PI / 4, PI, 5 * PI / 4, 3 * PI / 2, 7 * PI / 4] : arguments[5];
	    var t, i, j, k;
	    return regeneratorRuntime.wrap(function orientationSelectivityGen$(_context3) {
	        while (1) {
	            switch (_context3.prev = _context3.next) {
	                case 0:
	                    _context3.next = 2;
	                    return { stimulusType: STIMULUS.WAIT, lifespan: 120 * 15 };

	                case 2:
	                    t = 0;

	                case 3:
	                    if (!(t < numRepeat)) {
	                        _context3.next = 28;
	                        break;
	                    }

	                    i = 0;

	                case 5:
	                    if (!(i < speeds.length)) {
	                        _context3.next = 25;
	                        break;
	                    }

	                    j = 0;

	                case 7:
	                    if (!(j < widths.length)) {
	                        _context3.next = 22;
	                        break;
	                    }

	                    _context3.next = 10;
	                    return { stimulusType: STIMULUS.WAIT, lifespan: 120 * 5 };

	                case 10:
	                    k = 0;

	                case 11:
	                    if (!(k < angles.length)) {
	                        _context3.next = 19;
	                        break;
	                    }

	                    _context3.next = 14;
	                    return { stimulusType: STIMULUS.BAR,
	                        lifespan: (getDiagonalLength() + widths[j]) / speeds[i] * 120,
	                        backgroundColor: backgroundColor,
	                        width: widths[j],
	                        barColor: barColor,
	                        speed: speeds[i],
	                        angle: angles[k] };

	                case 14:
	                    _context3.next = 16;
	                    return { stimulusType: STIMULUS.WAIT, lifespan: 120 * 1 };

	                case 16:
	                    k++;
	                    _context3.next = 11;
	                    break;

	                case 19:
	                    j++;
	                    _context3.next = 7;
	                    break;

	                case 22:
	                    i++;
	                    _context3.next = 5;
	                    break;

	                case 25:
	                    t++;
	                    _context3.next = 3;
	                    break;

	                case 28:
	                case 'end':
	                    return _context3.stop();
	            }
	        }
	    }, _marked[2], this);
	}

	/***********************************************/
	// STIMULI

	function graphicsDispatcher(width, barColor, backgroundColor, speed, angle) {
	    switch (store.getState().stimulus.stimulusType) {
	        case GRAPHIC.BAR:
	            movingBarDispatcher(width, barColor, backgroundColor, speed, angle);
	            break;
	        case GRAPHIC.TARGET:
	            store.dispatch(setGraphics([{
	                graphicType: GRAPHIC.TARGET
	            }]));
	    }
	}

	function movingBarDispatcher(width, barColor, backgroundColor, speed, angle) {
	    // TODO change to addGraphicAC for flexibility
	    store.dispatch(setGraphics([{
	        graphicType: GRAPHIC.BAR, color: barColor, size: { width: width,
	            height: getDiagonalLength() }, speed: speed, angle: angle
	    }]));
	}

	/***********************************************/
	// ACTIONS

	var TIME_TICK = 'TIME_TICK';
	var STIMULUS_TICK = 'STIMULUS_TICK';
	var SET_STATUS = 'SET_STATUS';
	var GET_NEW_STIMULUS = 'GET_NEW_STIMULUS';
	var SET_GRAPHICS = 'SET_GRAPHICS';
	var ADD_GRAPHIC = 'ADD_GRAPHIC';
	var UPDATE_GRAPHICS = 'UPDATE_GRAPHICS';
	var SET_SIGNAL_LIGHT = 'SET_SIGNAL_LIGHT';

	// Define states for readability
	var STATUS = {
	    STARTED: 'STARTED',
	    STOPPED: 'STOPPED',
	    FINISHED: 'FINISHED'
	};

	var SIGNAL_LIGHT = {
	    FRAME_A: 'FRAME_A',
	    FRAME_B: 'FRAME_B',
	    NEW_STIM: 'NEW_STIM',
	    NEW_STIM_A: 'NEW_STIM_A',
	    NEW_STIM_B: 'NEW_STIM_B'
	};

	var STIMULUS = {
	    BAR: 'BAR',
	    WAIT: 'WAIT',
	    TARGET: 'TARGET'
	};

	var GRAPHIC = {
	    BAR: 'BAR',
	    TARGET: 'TARGET'
	};

	/***********************************************/
	// ACTION CREATORS

	function tickAC(timeDelta) {
	    // check if stimulus expired then update signal light
	    var state = store.getState();
	    if (state.stimulus === undefined || state.stimulus.age >= state.stimulus.lifespan) {
	        store.dispatch(getNewStimulusAC());
	        var _state = store.getState();
	        graphicsDispatcher(_state.stimulus.width, _state.stimulus.barColor, _state.stimulus.backgroundColor, _state.stimulus.speed, _state.stimulus.angle);
	        store.dispatch(setSignalLight(SIGNAL_LIGHT.NEW_STIM));
	    } else {
	        switch (state.signalLight) {
	            case SIGNAL_LIGHT.FRAME_A:
	                store.dispatch(setSignalLight(SIGNAL_LIGHT.FRAME_B));
	                break;
	            case SIGNAL_LIGHT.FRAME_B:
	                store.dispatch(setSignalLight(SIGNAL_LIGHT.FRAME_A));
	                break;
	            case SIGNAL_LIGHT.NEW_STIM:
	                store.dispatch(setSignalLight(SIGNAL_LIGHT.NEW_STIM_A));
	                break;
	            case SIGNAL_LIGHT.NEW_STIM_A:
	                store.dispatch(setSignalLight(SIGNAL_LIGHT.NEW_STIM_B));
	                break;
	            case SIGNAL_LIGHT.NEW_STIM_B:
	                store.dispatch(setSignalLight(SIGNAL_LIGHT.FRAME_A));
	                break;
	        }
	    }
	    store.dispatch(stimulusTickAC(timeDelta));
	    store.dispatch(timeTickAC(timeDelta));
	    store.dispatch(updateGraphicsAC(timeDelta));
	}

	function stimulusTickAC(timeDelta) {
	    return { type: STIMULUS_TICK, timeDelta: timeDelta };
	}

	function timeTickAC(timeDelta) {
	    return { type: TIME_TICK, timeDelta: timeDelta };
	}

	function updateGraphicsAC(timeDelta) {
	    return { type: UPDATE_GRAPHICS, timeDelta: timeDelta };
	}

	function getNewStimulusAC() {
	    return { type: GET_NEW_STIMULUS };
	}

	function makeAccessorAC(type) {
	    for (var _len = arguments.length, argNames = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	        argNames[_key - 1] = arguments[_key];
	    }

	    return function () {
	        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	            args[_key2] = arguments[_key2];
	        }

	        var action = { type: type };
	        argNames.forEach(function (arg, index) {
	            action[argNames[index]] = args[index];
	        });
	        return action;
	    };
	}

	var setStatus = makeAccessorAC(SET_STATUS, 'status');
	// const setProgram = makeAccessorAC(SET_PROGRAM, 'program')
	var setGraphics = makeAccessorAC(SET_GRAPHICS, 'graphics');
	var setSignalLight = makeAccessorAC(SET_SIGNAL_LIGHT, 'signalLight');

	/***********************************************/
	//INITIAL STATE

	var accessorInitialState = {
	    windowHeight: window.innerHeight,
	    windowWidth: window.innerWidth,
	    status: STATUS.STOPPED,
	    signalLight: SIGNAL_LIGHT.FRAME_A,
	    time: 0
	    // graphics
	    // stimulus
	};

	/***********************************************/
	// REDUCERS

	function eyeCandyApp(state, action) {
	    switch (action.type) {
	        case SET_STATUS:
	            return Object.assign({}, state, {
	                status: action.status
	            });
	        case GET_NEW_STIMULUS:
	            var nextStimulus = program.next();
	            if (nextStimulus.done === true) {
	                return Object.assign({}, state, {
	                    status: STATUS.FINISHED
	                });
	            } else {
	                return Object.assign({}, state, {
	                    stimulus: getNewStimulusReducer(nextStimulus.value)
	                });
	            }
	        case SET_GRAPHICS:
	            return Object.assign({}, state, {
	                graphics: action.graphics
	            });
	        case ADD_GRAPHIC:
	            return Object.assign({}, state, {
	                graphics: [].concat(babelHelpers.toConsumableArray(state.graphics), [action.graphic])
	            });
	        case SET_SIGNAL_LIGHT:
	            return Object.assign({}, state, {
	                signalLight: action.signalLight
	            });
	        case TIME_TICK:
	            return Object.assign({}, state, {
	                time: state.time + action.timeDelta
	            });
	        case UPDATE_GRAPHICS:
	            return Object.assign({}, state, {
	                graphics: graphicsReducer(state.graphics, action.timeDelta)
	            });
	        case STIMULUS_TICK:
	            return Object.assign({}, state, {
	                stimulus: stimulusTickReducer(state.stimulus, action.timeDelta)
	            });
	        default:
	            return state;
	    }
	}

	function getNewStimulusReducer(stimulus) {
	    return Object.assign({}, stimulus, {
	        age: 0
	    });
	}

	function stimulusTickReducer(stimulus, timeDelta) {
	    return Object.assign({}, stimulus, {
	        age: stimulus.age + timeDelta
	    });
	}

	function graphicsReducer(graphics, timeDelta) {
	    if (graphics === undefined) {
	        return graphics;
	    } else {
	        return graphics.map(function (graphic) {
	            return tickGraphic(graphic, timeDelta);
	        }); /*.filter((x) => {return x}) // TODO add code to expire graphics*/
	    }
	}

	/***********************************************/
	// GRAPHICS TICK

	function tickGraphic(graphic, timeDelta) {
	    switch (graphic.graphicType) {
	        case GRAPHIC.BAR:
	            return tickBar(graphic, timeDelta);
	        default:
	            return graphic;
	    }
	}

	function tickBar(bar, timeDelta) {
	    var newPosition = undefined;
	    if (bar.position === undefined) {
	        newPosition = { r: getDiagonalLength() / 2, theta: -bar.angle };
	    } else {
	        newPosition = { r: bar.position.r - bar.speed / 120 * timeDelta,
	            theta: bar.position.theta };
	    }
	    var state = store.getState();

	    return Object.assign({}, bar, {
	        position: newPosition,
	        // compensate for bar width & height, translate from polar & translate from center
	        // use height on both to make square
	        origin: { x: bar.size.width / 2 * cos(newPosition.theta) + newPosition.r * cos(newPosition.theta) + state['windowHeight'] / 2,
	            y: bar.size.width / 2 * sin(newPosition.theta) + newPosition.r * sin(newPosition.theta) + state['windowHeight'] / 2 }
	    });
	}

	/************************************************
	// LOGIC
	************************************************/

	// ensure bar always spans window regardless of angle
	function getDiagonalLength() {
	    return sqrt(pow(store.getState()['windowHeight'], 2) + pow(store.getState()['windowHeight'], 2));
	}

	/************************************************
	ANIMATE
	************************************************/

	function render() {
	    context.clearRect(0, 0, WIDTH, HEIGHT);
	    var state = store.getState();
	    document.body.style.backgroundColor = state.stimulus.backgroundColor;

	    if (state.graphics != undefined) {
	        state.graphics.forEach(function (graphic) {
	            context.save();
	            switch (graphic.graphicType) {
	                case GRAPHIC.BAR:
	                    // might need to translate first if rotation
	                    context.translate(graphic.origin.x, graphic.origin.y);
	                    context.fillStyle = graphic.color;
	                    // Rotate rectangle to be perpendicular with Center of Canvas
	                    context.rotate(graphic.position.theta);
	                    // Draw a rectangle, adjusting for Bar width
	                    context.fillRect(-graphic.size.width / 2, -graphic.size.height / 2, graphic.size.width, graphic.size.height);
	                    break;
	                case GRAPHIC.TARGET:
	                    context.strokeStyle = '#ff0000';

	                    context.beginPath();
	                    context.arc(HEIGHT / 2, HEIGHT / 2, HEIGHT / 2, 0, 2 * PI);
	                    context.stroke();

	                    context.beginPath();
	                    context.arc(HEIGHT / 2, HEIGHT / 2, HEIGHT / 3, 0, 2 * PI);
	                    context.stroke();

	                    context.beginPath();
	                    context.arc(HEIGHT / 2, HEIGHT / 2, HEIGHT / 5, 0, 2 * PI);
	                    context.stroke();

	                    context.beginPath();
	                    context.arc(HEIGHT / 2, HEIGHT / 2, HEIGHT / 10, 0, 2 * PI);
	                    context.stroke();

	                    context.beginPath();
	                    context.arc(HEIGHT / 2, HEIGHT / 2, HEIGHT / 100, 0, 2 * PI);
	                    context.stroke();

	                    context.rect(0, 0, HEIGHT, HEIGHT);
	                    context.stroke();
	            }
	            context.restore();
	        });
	    }

	    context.save();

	    // block right edge from screen
	    context.fillStyle = state.stimulus.backgroundColor;
	    context.fillRect(state.windowHeight, 0, state.windowWidth - state.windowHeight, state.windowHeight);

	    // draw flicker

	    switch (state.signalLight) {
	        case SIGNAL_LIGHT.FRAME_A:
	            context.fillStyle = '#949494';
	            break;
	        case SIGNAL_LIGHT.FRAME_B:
	            context.fillStyle = '#6C6C6C';
	            break;
	        default:
	            // this catches NEW_STIMULUS
	            context.fillStyle = 'white';
	            break;
	    }

	    context.fillRect(state.windowHeight + 120, 0, state.windowWidth - state.windowHeight - 100, state.windowHeight / 6);
	    context.restore();
	}

	function sampleGen() {
	    var i;
	    return regeneratorRuntime.wrap(function sampleGen$(_context4) {
	        while (1) {
	            switch (_context4.prev = _context4.next) {
	                case 0:
	                    i = 0;

	                case 1:
	                    if (!(i <= 3)) {
	                        _context4.next = 7;
	                        break;
	                    }

	                    _context4.next = 4;
	                    return i;

	                case 4:
	                    i++;
	                    _context4.next = 1;
	                    break;

	                case 7:
	                case 'end':
	                    return _context4.stop();
	            }
	        }
	    }, _marked[3], this);
	}

	var lastTime = window.performance.now();
	function mainLoop() {
	    var curTime = window.performance.now();

	    switch (store.getState().status) {
	        case STATUS.STOPPED:
	            return 'STOPPED';
	        case STATUS.FINISHED:
	            context.clearRect(0, 0, WIDTH, HEIGHT);
	            document.body.style.backgroundColor = 'black';
	            return 'FINISHED';
	    }

	    var frameTime = curTime - lastTime;
	    lastTime = curTime;

	    // adjust for dropped frames
	    if (frameTime < 10) {
	        // 120 Hz
	        tickAC(1);
	    } else if (frameTime < 20) {
	        // 60 Hz
	        tickAC(2);
	    } else {
	        var toTick = Math.round(frameTime / (1000 / 120));
	        tickAC(toTick);
	    }

	    render();
	    requestAnimationFrame(mainLoop);
	}

	/************************************************
	STORE
	************************************************/

	// USE THIS FOR NO LOGGER
	var store = createStore(eyeCandyApp, accessorInitialState);

	// USE THIS FOR LOGGER
	// let store = createStore(eyeCandyApp, accessorInitialState, applyMiddleware( logger ))

	// GET FROM SERVER (NOT OPERATIONAL)
	// let store = createStore(todoApp, window.STATE_FROM_SERVER)

	/************************************************
	CANVAS
	************************************************/

	var canvas = document.getElementById('eyecandy');
	var context = canvas.getContext('2d');
	var WIDTH = store.getState()['windowWidth'];
	var HEIGHT = store.getState()['windowHeight'];
	context.canvas.width = WIDTH;
	context.canvas.height = HEIGHT;

	/************************************************
	RUN
	************************************************/

	store.dispatch(setStatus(STATUS.STARTED));
	mainLoop();

}));