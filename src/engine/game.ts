import { Canvas } from "./Canvas";

export class Game {
    public isRunning: boolean;
    public canvas: Canvas;

    private timeAtLastFrame: number = new Date().getTime();
    private idealTimePerFrame: number = 1000 / 60;
    private leftover: number = 0;
    private frames: number = 0;
    private fpsReset: number = 0;
    private fps: number = 0;

    constructor(width: number, height: number) {
        this.canvas = new Canvas(width, height);
    }

    public start(): void {
        this.isRunning = true;
        this.tick();
    }

    public stop(): void {
        this.isRunning = false;
    }

    private tick(): void {
        if (this.isRunning) {
            const timeAtThisFrame: number = new Date().getTime();
            const deltaTime: number = timeAtThisFrame - this.timeAtLastFrame;
            const timeSinceLastTick: number = deltaTime + this.leftover;
            const catchUpFrameCount: number = Math.floor(timeSinceLastTick / this.idealTimePerFrame);

            this.fpsReset += deltaTime;
            if (this.fpsReset > 1000) {
                this.fps = this.frames - 1;
                this.fpsReset = 0;
                this.frames = 0;
            }

            for (let i: number = 0; i < catchUpFrameCount; i++) {
                this.update();
                this.frames++;
            }

            this.draw();

            this.leftover = timeSinceLastTick - (catchUpFrameCount * this.idealTimePerFrame);
            this.timeAtLastFrame = timeAtThisFrame;

            // Request a new frame from the browser and recursively call this method again.
            requestAnimationFrame(this.tick.bind(this));
        }
    }

    private update(): void {
        return;
    }

    private draw(): void {
        this.canvas.clear();

        this.canvas.hud.fillStyle = "white";
        this.canvas.hud.fillText("" + this.fps, 5, 15);
    }
}
