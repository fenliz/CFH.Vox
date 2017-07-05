
export class Canvas {
    public canvas: HTMLCanvasElement;
    public gl: WebGLRenderingContext;

    constructor(width: number, height: number) {
        this.canvas = document.getElementById("glCanvas") as HTMLCanvasElement;
        this.canvas.width = width;
        this.canvas.height = height;

        this.gl = this.canvas.getContext("webgl", { preserveDrawingBuffer: true }) as WebGLRenderingContext;
        if (!this.gl) {
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
