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

            // Draw background
            this.canvas.drawFilledRect(consoleStart, consoleEnd, "rgba(0, 0, 0, 0.3)");
            // Draw border
            this.canvas.drawRect(consoleStart, consoleEnd, "white");

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
            // Allow letters, numbers and special characters to be entered as text.
            if (ev.key.length === 1) {
                // Input the character at the markers position.
                this.inputText = this.inputText.slice(0, this.inputTextMarkerIndex) + ev.key +
                    this.inputText.slice(this.inputTextMarkerIndex);
                this.inputTextMarkerIndex++;
            }

            if (this.inputText.length > 0) {
                switch (ev.key) {
                    case "Backspace":
                        if (this.inputTextMarkerIndex > 0) {
                            this.inputText = this.inputText.slice(0, this.inputTextMarkerIndex - 1) +
                                this.inputText.slice(this.inputTextMarkerIndex);
                            this.inputTextMarkerIndex--;
                        }
                        break;
                    case "Enter": // Post the command e.g. [Action Argument1 Argument2 Argument3]
                        const inputCommand: string[] = this.inputText.split(" ");
                        this.postInput(new ConsoleInput(inputCommand[0], inputCommand.slice(1)));
                        this.inputTextMarkerIndex = 0;
                        break;
                }
            }

            // Move the input marker.
            if (ev.key === "ArrowLeft" && this.inputTextMarkerIndex > 0) {
                this.inputTextMarkerIndex--;
            } else if (ev.key === "ArrowRight" && this.inputTextMarkerIndex < this.inputText.length) {
                this.inputTextMarkerIndex++;
            }

            // Step through the input history.
            if (ev.key === "ArrowUp") {
                this.inputHistoryIndex++;
                this.setInputTextFromHistory();
            } else if (ev.key === "ArrowDown") {
                this.inputHistoryIndex--;
                this.setInputTextFromHistory();
            } else {
                this.inputHistoryIndex = -1;
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
        this.registerCommand("console", (args: string[]): string => {
            switch(args[0]) {
                case "size":
                    this.largeMode = !this.largeMode;
                    return "Console: Size changed.";
                case "clear":
                    this.responses = [];
                    return "Console: Cleared.";
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

        this.inputTextMarkerIndex = this.inputText.length;
    }

    private drawResponses(consoleStart: [number, number], consoleEnd: [number, number], textInputHeight: number) {
        const lineHeight: number = 20;

        for (let i = 0; i < this.responses.length; i++) {
            const position: [number, number] =
                [this.margin + 10, consoleEnd[1] - textInputHeight - 10 + -lineHeight * (i * 2)];
            const res: ConsoleResponse = this.responses[this.responses.length - 1 - i];

            // Draw the command.
            if (position[1] - lineHeight > consoleStart[1] + lineHeight) {
                this.canvas.drawText("< " + res.input.toString(),
                    [position[0], position[1] - lineHeight], "grey", "16px Times New Roman");
            }
            // Draw the response.
            if (position[1] > consoleStart[1] + lineHeight) {
                this.canvas.drawText(res.text, [position[0], position[1]],
                    "white", "16px Times New Roman");
            }
        }
    }

    private drawTextInputBox(consoleStart: [number, number], consoleEnd: [number, number], height: number): void {
        const textInputBoxStart: [number, number] = [consoleStart[0], consoleEnd[1] - height];

        // Draw border
        this.canvas.drawRect(textInputBoxStart, consoleEnd, "white");

        const inputTextWithMarker: string = this.inputText.slice(0, this.inputTextMarkerIndex) + "|" +
            this.inputText.slice(this.inputTextMarkerIndex);

        // Draw text with small inset.
        const textInputStart: [number, number] = [consoleStart[0] + 10, consoleEnd[1] - 10];
        this.canvas.drawText(inputTextWithMarker, textInputStart, "white", "18px Times New Roman");
    }
}
