/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/client/Main.purs":
/* unknown exports provided */
/* all exports used */
/*!******************************!*\
  !*** ./src/client/Main.purs ***!
  \******************************/
/***/ (function(module, exports) {

"use strict";
eval("throw new Error(\"Module build failed: Error: compilation failed\\n    at ChildProcess.<anonymous> (/www/node_modules/purs-loader/lib/Psc.js:48:16)\\n    at emitTwo (events.js:106:13)\\n    at ChildProcess.emit (events.js:192:7)\\n    at maybeClose (internal/child_process.js:890:16)\\n    at Process.ChildProcess._handle.onexit (internal/child_process.js:226:5)\");//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvY2xpZW50L01haW4ucHVycy5qcyIsInNvdXJjZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZVJvb3QiOiIifQ==");

/***/ }),

/***/ "./src/client/main.js":
/* unknown exports provided */
/* all exports used */
/*!****************************!*\
  !*** ./src/client/main.js ***!
  \****************************/
/***/ (function(module, exports, __webpack_require__) {

eval("var Main = __webpack_require__(/*! ./Main.purs */ \"./src/client/Main.purs\");\n// vanilla hot module reloading\n// @see https://webpack.github.io/docs/hot-module-replacement.html\nif(false) {\n\tvar main = Main.main();\n\n\tmodule.hot.accept();\n} else {\n\tMain.main();\n}//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvY2xpZW50L21haW4uanMuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvY2xpZW50L21haW4uanM/MjY5OSJdLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgTWFpbiA9IHJlcXVpcmUoJy4vTWFpbi5wdXJzJyk7XG4vLyB2YW5pbGxhIGhvdCBtb2R1bGUgcmVsb2FkaW5nXG4vLyBAc2VlIGh0dHBzOi8vd2VicGFjay5naXRodWIuaW8vZG9jcy9ob3QtbW9kdWxlLXJlcGxhY2VtZW50Lmh0bWxcbmlmKG1vZHVsZS5ob3QpIHtcblx0dmFyIG1haW4gPSBNYWluLm1haW4oKTtcblxuXHRtb2R1bGUuaG90LmFjY2VwdCgpO1xufSBlbHNlIHtcblx0TWFpbi5tYWluKCk7XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvY2xpZW50L21haW4uanNcbi8vIG1vZHVsZSBpZCA9IC4vc3JjL2NsaWVudC9tYWluLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VSb290IjoiIn0=");

/***/ }),

/***/ 0:
/* unknown exports provided */
/* all exports used */
/*!**********************************!*\
  !*** multi ./src/client/main.js ***!
  \**********************************/
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /www/src/client/main.js */"./src/client/main.js");


/***/ })

/******/ });