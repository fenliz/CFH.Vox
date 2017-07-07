
export class Canvas {
    public glCanvas: HTMLCanvasElement;
    public hudCanvas: HTMLCanvasElement;

    public debugCanvas: HTMLCanvasElement;
    public gl: WebGLRenderingContext;
    public hud: CanvasRenderingContext2D;

    constructor(public width: number, public height: number) {
        this.glCanvas = document.getElementById("glCanvas") as HTMLCanvasElement;
        this.hudCanvas = document.getElementById("hudCanvas") as HTMLCanvasElement;

        // Match the canvases for WebGL and Canvas2D in size to perfectly overlap eachother.
        this.hudCanvas.width = this.glCanvas.width = width;
        this.hudCanvas.height = this.glCanvas.height = height;

        this.initWebGL();
        this.initHUD();
    }

    public clear(): void {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.hud.clearRect(0, 0, this.hudCanvas.width, this.hudCanvas.height);
    }

    public drawText(text: string, point: [number, number], style: string, font: string): void {
        this.hud.fillStyle = style;
        this.hud.font = font;
        this.hud.fillText(text, point[0], point[1]);
    }

    public drawRect(start: [number, number], end: [number, number], style: string) {
        this.hud.strokeStyle = style;
        this.hud.strokeRect(start[0], start[1], end[0] - start[0], end[1] - start[1]);
    }

    public drawFilledRect(start: [number, number], end: [number, number], style: string) {
        this.hud.fillStyle = style;
        this.hud.fillRect(start[0], start[1], end[0] - start[0], end[1] - start[1]);
    }

    private initWebGL(): void {
        this.gl = this.glCanvas.getContext("webgl", { preserveDrawingBuffer: true }) as WebGLRenderingContext;
        if (!this.gl) {
            alert("Error getting the WebGL context. Please check if your browser supports it.");
            return;
        }

        this.gl.clearColor(0.4, 0.4, 0.4, 1.0);
        this.gl.clearDepth(1.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.depthFunc(this.gl.LEQUAL);
    }

    private initHUD(): void {
        this.hud = this.hudCanvas.getContext("2d") as CanvasRenderingContext2D;
        if (!this.hud) {
            alert("Error getting the Canvas2D context. Please check if your browser supports it.");
        }
    }
}
