var game;
function start() {
    game = new Game(1024, 800);
    game.start();
}
var Game = (function () {
    function Game(width, height) {
        this.canvas = new Canvas(width, height);
    }
    Game.prototype.start = function () {
        this.isRunning = true;
        this.doFrame();
    };
    Game.prototype.stop = function () {
        this.isRunning = false;
    };
    Game.prototype.doFrame = function () {
        if (this.isRunning) {
            this.update();
            this.draw();
            // Request a new frame from the browser and recursively call this method again.
            requestAnimationFrame(this.doFrame.bind(this));
        }
    };
    Game.prototype.update = function () {
    };
    Game.prototype.draw = function () {
        this.canvas.clear();
    };
    return Game;
}());
var Canvas = (function () {
    function Canvas(width, height) {
        this.canvas = document.getElementById("glCanvas");
        this.canvas.width = width;
        this.canvas.height = height;
        this.gl = this.canvas.getContext("webgl", { preserveDrawingBuffer: true });
        if (!this.gl) {
            alert("Error getting the WebGL context. Please check if your browser supports it.");
            return;
        }
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.clearDepth(1.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.depthFunc(this.gl.LEQUAL);
    }
    Canvas.prototype.clear = function () {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    };
    return Canvas;
}());
