"use strict";
// var Main = require("Mfain")

// // https://github.com/CapillarySoftware/purescript-requestAnimationFrame
// // module DOM.RequestAnimationFrame 

var requestAnimationFrame = null;
var wrapper = null;

// http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
exports.requestAnimationFrame = function(window_) {
    if (!requestAnimationFrame) {
        requestAnimationFrame = (function() {
            return window_.requestAnimationFrame ||
                window_.webkitRequestAnimationFrame ||
                window_.mozRequestAnimationFrame ||
                function(callback) {
                    window_.setTimeout(callback, 1000 / 60);
                };
        })();
    }
    return function(action) {
        wrapper = function(t) {
            return action(t)()
        }
        return function() {
            return requestAnimationFrame(wrapper);
        };
    }
};
