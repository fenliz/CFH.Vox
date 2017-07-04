var game: Game;
function start() {
    game = new Game(1024, 800);
    game.start();
}

class Game {
    public isRunning: boolean;
    public canvas: Canvas;

    constructor(width: number, height: number) {
        this.canvas = new Canvas(width, height);
    }

    public start(): void {
        this.isRunning = true;
        this.doFrame();
    }

    public stop(): void {
        this.isRunning = false;
    }

    private doFrame(): void {
        if (this.isRunning) {
            this.update();
            this.draw();

            // Request a new frame from the browser and recursively call this method again.
            requestAnimationFrame(this.doFrame.bind(this));
        }
    }

    private update(): void {

    }

    private draw(): void {
        this.canvas.clear();
    }
}

class Canvas {
    public canvas: HTMLCanvasElement;
    public gl: WebGLRenderingContext;

    constructor(width: number, height: number) {
        this.canvas = <HTMLCanvasElement>document.getElementById("glCanvas");
        this.canvas.width = width;
        this.canvas.height = height;

        this.gl = this.canvas.getContext("webgl", { preserveDrawingBuffer: true });
        if(!this.gl) {
            alert("Error getting the WebGL context. Please check if your browser supports it.");
            return;
        }

        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.clearDepth(1.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.depthFunc(this.gl.LEQUAL);
    }

    public clear(): void {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }
}