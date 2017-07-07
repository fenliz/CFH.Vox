import { Canvas } from "../canvas";
import { ISystem } from "../system";
import { ConsoleInput } from "./console.input";
import { ConsoleResponse } from "./console.response";

export class Console implements ISystem {
    public isVisible: boolean = true;

    // Styling
    private margin: number = 3;
    private readonly heightFactor: number = 0.3;
    private readonly heightFactorLargeMode: number = 0.90;
    private readonly textInputHeight: number = 30;
    private inputText: string = "";

    private largeMode: boolean = false;
    private supportedCommands: Array<[string, (args: string[]) => string]> = [];
    private responses: ConsoleResponse[] = [];
    private inputHistoryIndex = -1;
    private inputTextMarkerIndex = 0;

    constructor(private canvas: Canvas) {
    }

    public registerCommand(action: string, callback: (args: string[]) => string): void {
        this.supportedCommands.push([action, callback]);
    }

    public postInput(input: ConsoleInput): void {
        let response: string = "Unsupported Command!";

        for (const supportedCommand of this.supportedCommands) {
            if (supportedCommand[0] === input.action) {
                response = supportedCommand[1](input.args);
            }
        }

        this.responses.push(new ConsoleResponse(input, response));
        this.inputText = "";
        this.inputTextMarkerIndex = 0;
    }

    public draw(): void {
        if (this.isVisible) {
            const consoleHeight: number = this.canvas.height *
                (this.largeMode ? this.heightFactorLargeMode : this.heightFactor);

            // The [X, Y] of where the console starts.
            const consoleStart: [number, number] =
                [this.margin, this.canvas.height - (consoleHeight)];

            // The [X, Y] of where the console ends.
            const consoleEnd: [number, number] = [this.canvas.width - this.margin, this.canvas.height - this.margin];

            this.drawConsoleBackground(consoleStart, consoleEnd);

            this.drawResponses(consoleStart, consoleEnd, this.textInputHeight);
            this.drawTextInputBox(consoleStart, consoleEnd, this.textInputHeight);
        }
    }

    public onKeyDown(ev: KeyboardEvent): void {
        // Toggle console
        if (ev.key === "§") {
            this.isVisible = !this.isVisible;
            return;
        }

        if (this.isVisible) {
            // Allow letters, numbers and special characters.
            if (ev.key.length === 1) {
                // Input text at the marker
                this.inputText = this.inputText.slice(0, this.inputTextMarkerIndex) + ev.key +
                    this.inputText.slice(this.inputTextMarkerIndex);
                this.inputTextMarkerIndex++;
            }

            if (this.inputText.length > 0) {
                switch (ev.key) {
                    case "Backspace":
                        this.inputText = this.inputText.slice(0, this.inputTextMarkerIndex - 1) +
                            this.inputText.slice(this.inputTextMarkerIndex);
                        this.inputTextMarkerIndex--;
                        break;
                    case "Enter": // Post the command e.g. [Action Argument1 Argument2 Argument3]
                        const inputCommand: string[] = this.inputText.split(" ");
                        this.postInput(new ConsoleInput(inputCommand[0], inputCommand.slice(1)));
                        break;
                }
            }
            

            // Stepping through the input history
            if (ev.key === "ArrowUp") {
                this.inputHistoryIndex++;
                this.setInputTextFromHistory();
            } else if (ev.key === "ArrowDown") {
                this.inputHistoryIndex--;
                this.setInputTextFromHistory();
            } else {
                this.inputHistoryIndex = -1;
            }

            // Moving the input marker
            if (ev.key === "ArrowLeft" && this.inputTextMarkerIndex > 0) {
                this.inputTextMarkerIndex--;
            } else if (ev.key === "ArrowRight" && this.inputTextMarkerIndex < this.inputText.length) {
                this.inputTextMarkerIndex++;
            }
        }
    }

    public onKeyUp(ev: KeyboardEvent): void {
        return;
    }

    public update(deltaTime: number): void {
        return;
    }

    public registerConsoleCommands(console: Console): void {
        // Register the available commands specific to the console.
        this.registerCommand("console", (args: string[]): string => {
            switch(args[0]) {
                case "size":
                    this.largeMode = !this.largeMode;
                    return "Console: Size changed.";
                case "close":
                    this.isVisible = false;
                    return "Console: Closed.";

            }
            return "Console: Invalid Command!";
        });
    }

    private setInputTextFromHistory(): void {
        // Clamp the iterator between -1 and the index of the last response.
        this.inputHistoryIndex = Math.max(-1, Math.min(this.responses.length - 1, this.inputHistoryIndex));
        if (this.inputHistoryIndex === -1) {
            this.inputText = "";
        } else {
            this.inputText =
                this.responses[this.responses.length - 1 - this.inputHistoryIndex].input.toString();
        }
    }

    private drawConsoleBackground(consoleStart: [number, number], consoleEnd: [number, number]): void {
        // Draw background
        this.canvas.hud.fillStyle = "rgba(0, 0, 0, 0.3)";
        this.canvas.hud.fillRect(consoleStart[0], consoleStart[1],
            consoleEnd[0] - consoleStart[0], consoleEnd[1] - consoleStart[1]);
        // Draw border
        this.canvas.hud.strokeStyle = "white";
        this.canvas.hud.strokeRect(consoleStart[0], consoleStart[1],
            consoleEnd[0] - consoleStart[0], consoleEnd[1] - consoleStart[1]);
    }

    private drawResponses(consoleStart: [number, number], consoleEnd: [number, number], textInputHeight: number) {
        const lineHeight: number = 20;
        let writeAtY: number = 0;
        let rowCount: number = 0;

        for (let i = this.responses.length - 1; i >= 0; i--) {
            // Draw response text
            this.canvas.hud.fillStyle = "white";
            this.canvas.hud.font = "16px Times New Roman";
            writeAtY = consoleEnd[1] - textInputHeight - 10 + -lineHeight * rowCount;
            if (writeAtY < consoleStart[1] + lineHeight) {
                return;
            }
            rowCount++;
            this.canvas.hud.fillText(this.responses[i].text, this.margin + 10, writeAtY);

            // Draw command
            this.canvas.hud.fillStyle = "grey";
            this.canvas.hud.font = "16px Times New Roman";
            writeAtY = consoleEnd[1] - textInputHeight - 10 + -lineHeight * rowCount;
            if (writeAtY < consoleStart[1] + lineHeight) {
                return;
            }
            rowCount++;
            this.canvas.hud.fillText("< " + this.responses[i].input.toString(), this.margin + 10, writeAtY);
        }
    }

    private drawTextInputBox(consoleStart: [number, number], consoleEnd: [number, number], height: number): void {
        // Draw border
        this.canvas.hud.strokeStyle = "white";
        this.canvas.hud.strokeRect(consoleStart[0] + 2, consoleEnd[1] - height,
            consoleEnd[0] - consoleStart[0] - 2, height);

        const inputTextWithMarker: string = this.inputText.slice(0, this.inputTextMarkerIndex) + "|" + 
            this.inputText.slice(this.inputTextMarkerIndex);
        // Draw text
        this.canvas.hud.fillStyle = "white";
        this.canvas.hud.font = "18px Times New Roman";
        this.canvas.hud.fillText(inputTextWithMarker, consoleStart[0] + 10, consoleEnd[1] - 10);
    }
}
