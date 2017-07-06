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
    game = new Game_1.Game(1300, 766);
    game.start();
};


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var canvas_1 = __webpack_require__(2);
var console_1 = __webpack_require__(3);
var Game = (function () {
    function Game(width, height) {
        this.framesPerSecond = 0;
        this.systems = [];
        this.maxUpdatesPerSecond = 30;
        this.msPerUpdate = 1000 / this.maxUpdatesPerSecond;
        this.secondsPerUpdate = 1 / this.maxUpdatesPerSecond;
        this.maxDrawFramesToSkip = this.maxUpdatesPerSecond * this.secondsPerUpdate;
        this.nextTimeToUpdate = 0;
        this.lastDrawTime = new Date().getTime();
        this.fpsTimer = 0;
        this.fpsCounter = 0;
        this.canvas = new canvas_1.Canvas(width, height);
        this.systems.push(new console_1.Console(this.canvas));
        document.onkeydown = this.handleKeyDown.bind(this);
        document.onkeyup = this.handleKeyUp.bind(this);
    }
    Game.prototype.start = function () {
        this.isRunning = true;
        this.tick();
    };
    Game.prototype.stop = function () {
        this.isRunning = false;
    };
    // The game will update at a constant pace of maxUpdatesPerSecond
    // and draw as much as possible.
    Game.prototype.tick = function () {
        if (this.isRunning) {
            var loops = 0;
            while (new Date().getTime() > this.nextTimeToUpdate && loops < this.maxDrawFramesToSkip) {
                this.update();
                this.nextTimeToUpdate += this.msPerUpdate;
                loops++;
            }
            var timeNow = new Date().getTime();
            this.fpsCounter++;
            this.fpsTimer += timeNow - this.lastDrawTime;
            if (this.fpsTimer > 1000) {
                this.fpsTimer -= 1000;
                this.framesPerSecond = this.fpsCounter;
                this.fpsCounter = 0;
            }
            this.draw();
            this.lastDrawTime = timeNow;
            // Request a new frame from the browser and recursively call this method again.
            // Browser caps this at 60 FPS.
            requestAnimationFrame(this.tick.bind(this));
        }
    };
    Game.prototype.update = function () {
        for (var _i = 0, _a = this.systems; _i < _a.length; _i++) {
            var system = _a[_i];
            system.update(this.secondsPerUpdate);
        }
    };
    Game.prototype.draw = function () {
        this.canvas.clear();
        for (var _i = 0, _a = this.systems; _i < _a.length; _i++) {
            var system = _a[_i];
            system.draw();
        }
        // Draw the FPS counter in the top-left corner.
        this.canvas.hud.fillStyle = "white";
        this.canvas.hud.font = "16px Times New Roman";
        this.canvas.hud.fillText("" + this.framesPerSecond, 10, 25);
    };
    Game.prototype.handleKeyDown = function (ev) {
        for (var _i = 0, _a = this.systems; _i < _a.length; _i++) {
            var system = _a[_i];
            system.onKeyDown(ev);
        }
    };
    Game.prototype.handleKeyUp = function (ev) {
        for (var _i = 0, _a = this.systems; _i < _a.length; _i++) {
            var system = _a[_i];
            system.onKeyUp(ev);
        }
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
        this.width = width;
        this.height = height;
        this.glCanvas = document.getElementById("glCanvas");
        this.hudCanvas = document.getElementById("hudCanvas");
        // Match the canvases for WebGL and Canvas2D in size to perfectly overlap eachother.
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
        this.gl.clearColor(0.4, 0.4, 0.4, 1.0);
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


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var console_input_1 = __webpack_require__(4);
var console_response_1 = __webpack_require__(5);
var Console = (function () {
    function Console(canvas) {
        var _this = this;
        this.canvas = canvas;
        this.isVisible = true;
        this.largeMode = false;
        // Styling
        this.margin = 10;
        this.heightFactor = 0.3;
        this.heightFactorLargeMode = 0.90;
        this.textInputHeight = 30;
        this.inputText = "";
        this.supportedCommands = [];
        this.responses = [];
        this.inputHistoryIterator = -1;
        // Register the available commands specific to the console.
        this.registerCommand("console", function (args) {
            switch (args[0]) {
                case "toggle":
                    _this.largeMode = !_this.largeMode;
                    return "Console: Large mode toggled.";
                case "close":
                    _this.isVisible = false;
                    return "Console: Closed.";
            }
            return "Console: Invalid Command!";
        });
    }
    Console.prototype.registerCommand = function (action, callback) {
        this.supportedCommands.push([action, callback]);
    };
    Console.prototype.postInput = function (input) {
        var response = "Unsupported Command!";
        for (var _i = 0, _a = this.supportedCommands; _i < _a.length; _i++) {
            var supportedCommand = _a[_i];
            if (supportedCommand[0] === input.action) {
                response = supportedCommand[1](input.args);
            }
        }
        this.responses.push(new console_response_1.ConsoleResponse(input, response));
    };
    Console.prototype.onKeyDown = function (ev) {
        // Toggle console
        if (ev.key === "§") {
            this.isVisible = !this.isVisible;
            return;
        }
        if (this.isVisible) {
            // Allow letters, numbers and special characters.
            if (ev.key.length === 1) {
                this.inputText += ev.key;
            }
            switch (ev.key) {
                case "Backspace":
                    this.inputText = this.inputText.substr(0, this.inputText.length - 1);
                    break;
                case "Enter":// Post the command e.g. [Action Argument1 Argument2 Argument3]
                    if (this.inputText !== "") {
                        var inputCommand = this.inputText.split(" ");
                        this.postInput(new console_input_1.ConsoleInput(inputCommand[0], inputCommand.slice(1)));
                        this.inputText = "";
                    }
            }
            if (ev.key === "ArrowUp") {
                this.inputHistoryIterator++;
                this.setInputTextFromHistory();
            }
            else if (ev.key === "ArrowDown") {
                this.inputHistoryIterator--;
                this.setInputTextFromHistory();
            }
            else {
                this.inputHistoryIterator = -1;
            }
        }
    };
    Console.prototype.onKeyUp = function (ev) {
        return;
    };
    Console.prototype.update = function (deltaTime) {
        return;
    };
    Console.prototype.draw = function () {
        if (this.isVisible) {
            var consoleHeight = this.canvas.height *
                (this.largeMode ? this.heightFactorLargeMode : this.heightFactor);
            // The [X, Y] of where the console starts.
            var consoleStart = [this.margin, this.canvas.height - (consoleHeight)];
            // The [X, Y] of where the console ends.
            var consoleEnd = [this.canvas.width - this.margin, this.canvas.height - this.margin];
            this.drawConsoleBackground(consoleStart, consoleEnd);
            this.drawResponses(consoleStart, consoleEnd, this.textInputHeight);
            this.drawTextInputBox(consoleStart, consoleEnd, this.textInputHeight);
        }
    };
    Console.prototype.setInputTextFromHistory = function () {
        // Clamp the iterator between -1 and the index of the last response.
        this.inputHistoryIterator = Math.max(-1, Math.min(this.responses.length - 1, this.inputHistoryIterator));
        if (this.inputHistoryIterator === -1) {
            this.inputText = "";
        }
        else {
            this.inputText =
                this.responses[this.responses.length - 1 - this.inputHistoryIterator].input.toString();
        }
    };
    Console.prototype.drawConsoleBackground = function (consoleStart, consoleEnd) {
        // Background
        this.canvas.hud.fillStyle = "rgba(0, 0, 0, 0.3)";
        this.canvas.hud.fillRect(consoleStart[0], consoleStart[1], consoleEnd[0] - consoleStart[0], consoleEnd[1] - consoleStart[1]);
        // Border
        this.canvas.hud.strokeStyle = "white";
        this.canvas.hud.strokeRect(consoleStart[0], consoleStart[1], consoleEnd[0] - consoleStart[0], consoleEnd[1] - consoleStart[1]);
    };
    Console.prototype.drawResponses = function (consoleStart, consoleEnd, textInputHeight) {
        var lineHeight = 20;
        var writeAtY = 0;
        var rowCount = 0;
        for (var i = this.responses.length - 1; i >= 0; i--) {
            this.canvas.hud.fillStyle = "white";
            this.canvas.hud.font = "16px Times New Roman";
            // Draw response text
            writeAtY = consoleEnd[1] - textInputHeight - 10 + -lineHeight * rowCount;
            if (writeAtY < consoleStart[1] + lineHeight) {
                return;
            }
            rowCount++;
            this.canvas.hud.fillText(this.responses[i].text, 20, writeAtY);
            this.canvas.hud.fillStyle = "grey";
            this.canvas.hud.font = "16px Times New Roman";
            // Draw command
            writeAtY = consoleEnd[1] - textInputHeight - 10 + -lineHeight * rowCount;
            if (writeAtY < consoleStart[1] + lineHeight) {
                return;
            }
            rowCount++;
            this.canvas.hud.fillText("< " + this.responses[i].input.toString(), 20, writeAtY);
        }
    };
    Console.prototype.drawTextInputBox = function (consoleStart, consoleEnd, height) {
        // Border
        this.canvas.hud.strokeStyle = "white";
        this.canvas.hud.strokeRect(consoleStart[0] + 2, consoleEnd[1] - height, consoleEnd[0] - consoleStart[0] - 2, height);
        // Text
        this.canvas.hud.fillStyle = "white";
        this.canvas.hud.font = "18px Times New Roman";
        this.canvas.hud.fillText(this.inputText + "|", consoleStart[0] + 10, consoleEnd[1] - 10);
    };
    return Console;
}());
exports.Console = Console;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ConsoleInput = (function () {
    function ConsoleInput(action, args) {
        this.action = action;
        this.args = args;
    }
    ConsoleInput.prototype.toString = function () {
        var result = this.action;
        for (var _i = 0, _a = this.args; _i < _a.length; _i++) {
            var arg = _a[_i];
            result += " " + arg;
        }
        return result;
    };
    return ConsoleInput;
}());
exports.ConsoleInput = ConsoleInput;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ConsoleResponse = (function () {
    function ConsoleResponse(input, text) {
        this.input = input;
        this.text = text;
    }
    return ConsoleResponse;
}());
exports.ConsoleResponse = ConsoleResponse;


/***/ })
/******/ ]);