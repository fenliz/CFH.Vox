import { Canvas } from "./Canvas";

export class Game {
    public isRunning: boolean;
    public canvas: Canvas;

    constructor(width: number, height: number) {
        this.canvas = new Canvas(width, height);
    }

    public start(): void {
        this.isRunning = true;
        this.processFrame();
    }

    public stop(): void {
        this.isRunning = false;
    }

    private processFrame(): void {
        if (this.isRunning) {
            this.draw();

            // Request a new frame from the browser and recursively call this method again.
            requestAnimationFrame(this.processFrame.bind(this));
        }
    }

    private draw(): void {
        this.canvas.clear();
    }
}
