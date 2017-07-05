/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
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
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Game_1 = __webpack_require__(1);
var game;
window.onload = function () {
    game = new Game_1.Game(1024, 800);
    game.start();
};


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Canvas_1 = __webpack_require__(2);
var Game = (function () {
    function Game(width, height) {
        this.timeAtLastFrame = new Date().getTime();
        this.idealTimePerFrame = 1000 / 60;
        this.leftover = 0;
        this.frames = 0;
        this.fpsReset = 0;
        this.fps = 0;
        this.canvas = new Canvas_1.Canvas(width, height);
    }
    Game.prototype.start = function () {
        this.isRunning = true;
        this.tick();
    };
    Game.prototype.stop = function () {
        this.isRunning = false;
    };
    Game.prototype.tick = function () {
        if (this.isRunning) {
            var timeAtThisFrame = new Date().getTime();
            var deltaTime = timeAtThisFrame - this.timeAtLastFrame;
            var timeSinceLastTick = deltaTime + this.leftover;
            var catchUpFrameCount = Math.floor(timeSinceLastTick / this.idealTimePerFrame);
            this.fpsReset += deltaTime;
            if (this.fpsReset > 1000) {
                this.fps = this.frames - 1;
                this.fpsReset = 0;
                this.frames = 0;
            }
            for (var i = 0; i < catchUpFrameCount; i++) {
                this.update();
                this.frames++;
            }
            this.draw();
            this.leftover = timeSinceLastTick - (catchUpFrameCount * this.idealTimePerFrame);
            this.timeAtLastFrame = timeAtThisFrame;
            // Request a new frame from the browser and recursively call this method again.
            requestAnimationFrame(this.tick.bind(this));
        }
    };
    Game.prototype.update = function () {
        return;
    };
    Game.prototype.draw = function () {
        this.canvas.clear();
        this.canvas.hud.fillStyle = "white";
        this.canvas.hud.fillText("" + this.fps, 5, 15);
    };
    return Game;
}());
exports.Game = Game;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Canvas = (function () {
    function Canvas(width, height) {
        this.glCanvas = document.getElementById("glCanvas");
        this.hudCanvas = document.getElementById("hudCanvas");
        this.hudCanvas.width = this.glCanvas.width = width;
        this.hudCanvas.height = this.glCanvas.height = height;
        this.initWebGL();
        this.initHUD();
    }
    Canvas.prototype.clear = function () {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.hud.clearRect(0, 0, this.hudCanvas.width, this.hudCanvas.height);
    };
    Canvas.prototype.initWebGL = function () {
        this.gl = this.glCanvas.getContext("webgl", { preserveDrawingBuffer: true });
        if (!this.gl) {
            alert("Error getting the WebGL context. Please check if your browser supports it.");
            return;
        }
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.clearDepth(1.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.depthFunc(this.gl.LEQUAL);
    };
    Canvas.prototype.initHUD = function () {
        this.hud = this.hudCanvas.getContext("2d");
        if (!this.hud) {
            alert("Error getting the Canvas2D context. Please check if your browser supports it.");
        }
    };
    return Canvas;
}());
exports.Canvas = Canvas;


/***/ })
/******/ ]);