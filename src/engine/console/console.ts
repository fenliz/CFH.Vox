import { Canvas } from "../canvas";
import { ISystem } from "../system";
import { ConsoleInput } from "./console.input";
import { ConsoleResponse } from "./console.response";

export class Console implements ISystem {
    public isVisible: boolean = true;
    public largeMode: boolean = false;

    // Styling
    private margin: number = 10;
    private readonly heightFactor: number = 0.3;
    private readonly heightFactorLargeMode: number = 0.90;
    private readonly textInputHeight: number = 30;
    private inputText: string = "";

    private supportedCommands: Array<[string, (args: string[]) => string]> = [];
    private responses: ConsoleResponse[] = [];
    private inputHistoryIterator = -1;

    constructor(private canvas: Canvas) {
        // Register the available commands specific to the console.
        this.registerCommand("console", (args: string[]): string => {
            switch(args[0]) {
                case "toggle":
                    this.largeMode = !this.largeMode;
                    return "Console: Large mode toggled.";
                case "close":
                    this.isVisible = false;
                    return "Console: Closed.";

            }
            return "Console: Invalid Command!";
        });
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
    }

    public onKeyDown(ev: KeyboardEvent): void {
        if (this.isVisible) {
            // Allow letters, numbers and special characters.
            if (/[a-zA-Z0-9-_ ]/.test(String.fromCharCode(ev.keyCode))) {
                this.inputText += ev.key;
            }

            switch (ev.key) {
                case "Backspace":
                    this.inputText = this.inputText.substr(0, this.inputText.length - 1);
                    break;
                case "Enter": // Post the command e.g. [Action Argument1 Argument2 Argument3]
                    if (this.inputText !== "") {
                        const inputCommand: string[] = this.inputText.split(" ");
                        this.postInput(new ConsoleInput(inputCommand[0], inputCommand.slice(1)));
                        this.inputText = "";
                    }
            }

            if (ev.key === "ArrowUp") {
                this.inputHistoryIterator++;
                this.setInputTextFromHistory();
            } else if (ev.key === "ArrowDown") {
                this.inputHistoryIterator--;
                this.setInputTextFromHistory();
            } else {
                this.inputHistoryIterator = -1;
            }
        }

        // Toggle console
        if (ev.key === "§") {
            this.isVisible = !this.isVisible;
        }
    }

    public onKeyUp(ev: KeyboardEvent): void {
        return;
    }

    public update(deltaTime: number): void {
        return;
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

    private setInputTextFromHistory() {
        // Clamp the iterator between -1 and the index of the last response.
        this.inputHistoryIterator = Math.max(-1, Math.min(this.responses.length - 1, this.inputHistoryIterator));
        if (this.inputHistoryIterator === -1) {
            this.inputText = "";
        } else {
            this.inputText =
                this.responses[this.responses.length - 1 - this.inputHistoryIterator].input.toString();
        }
    }

    private drawConsoleBackground(consoleStart: [number, number], consoleEnd: [number, number]): void {
        // Background
        this.canvas.hud.fillStyle = "rgba(0, 0, 0, 0.3)";
        this.canvas.hud.fillRect(consoleStart[0], consoleStart[1],
            consoleEnd[0] - consoleStart[0], consoleEnd[1] - consoleStart[1]);
        // Border
        this.canvas.hud.strokeStyle = "white";
        this.canvas.hud.strokeRect(consoleStart[0], consoleStart[1],
            consoleEnd[0] - consoleStart[0], consoleEnd[1] - consoleStart[1]);
    }

    private drawResponses(consoleStart: [number, number], consoleEnd: [number, number], textInputHeight: number) {
        const lineHeight: number = 20;
        let writeAtY: number = 0;
        let rowCount: number = 0;

        for (let i = this.responses.length - 1; i >= 0; i--) {
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
    }

    private drawTextInputBox(consoleStart: [number, number], consoleEnd: [number, number], height: number): void {
        // Border
        this.canvas.hud.strokeStyle = "white";
        this.canvas.hud.strokeRect(consoleStart[0] + 2, consoleEnd[1] - height,
            consoleEnd[0] - consoleStart[0] - 2, height);
        // Text
        this.canvas.hud.fillStyle = "white";
        this.canvas.hud.font = "18px Times New Roman";
        this.canvas.hud.fillText(this.inputText + "|", consoleStart[0] + 10, consoleEnd[1] - 10);
    }
}
