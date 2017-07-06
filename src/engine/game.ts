import { Canvas } from "./canvas";
import { Console } from "./console/console";
import { ISystem } from "./system";

export class Game implements ISystem {
    public isRunning: boolean;
    public canvas: Canvas;
    public framesPerSecond: number = 0;

    private systems: ISystem[] = [];

    private readonly maxUpdatesPerSecond: number = 30;
    private readonly msPerUpdate: number = 1000 / this.maxUpdatesPerSecond;
    private readonly secondsPerUpdate: number = 1 / this.maxUpdatesPerSecond;
    private readonly maxDrawFramesToSkip: number = this.maxUpdatesPerSecond * this.secondsPerUpdate;

    private nextTimeToUpdate: number = 0;
    private lastDrawTime: number = new Date().getTime();
    private fpsTimer: number = 0;
    private fpsCounter: number = 0;
    private showFps: boolean = true;

    constructor(width: number, height: number) {
        this.canvas = new Canvas(width, height);

        const console: Console = new Console(this.canvas);
        this.systems.push(console);

        for (const system of this.systems) {
            system.registerConsoleCommands(console);
        }
        this.registerConsoleCommands(console);

        document.onkeydown = this.onKeyDown.bind(this);
        document.onkeyup = this.onKeyUp.bind(this);
    }

    public start(): void {
        this.isRunning = true;
        this.tick();
    }

    public stop(): void {
        this.isRunning = false;
        this.canvas.clear();
    }

    // The game will update at a constant pace of maxUpdatesPerSecond
    // and draw as much as possible.
    public tick(): void {
        if (this.isRunning) {
            let loops: number = 0;

            while (new Date().getTime() > this.nextTimeToUpdate && loops < this.maxDrawFramesToSkip) {
                this.update(this.secondsPerUpdate);

                this.nextTimeToUpdate += this.msPerUpdate;
                loops++;
            }

            const timeNow: number = new Date().getTime();

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
    }

    public update(deltaTime: number): void {
        for (const system of this.systems) {
            system.update(deltaTime);
        }
    }

    public draw(): void {
        this.canvas.clear();

        for (const system of this.systems) {
            system.draw();
        }

        if (this.showFps) {
            // Draw the FPS counter in the top-left corner.
            this.canvas.hud.fillStyle = "white";
            this.canvas.hud.font = "16px Times New Roman";
            this.canvas.hud.fillText("" + this.framesPerSecond, 10, 25);
        }
    }

    public onKeyDown(ev: KeyboardEvent) {
        for (const system of this.systems) {
            system.onKeyDown(ev);
        }
    }
    
    public onKeyUp(ev: KeyboardEvent) {
        for (const system of this.systems) {
            system.onKeyUp(ev);
        }
    }

    public registerConsoleCommands(console: Console) {
        console.registerCommand("game", (args: string[]): string => {
            switch(args[0]) {
                case "fps":
                    this.showFps = !this.showFps;
                    return "Game: FPS counter toggled.";
                case "exit":
                    this.stop();
                    return "Game: Aborted.";
            }
            return "Game: Invalid Command!";
        });
    }
}
