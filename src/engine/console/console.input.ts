

export class ConsoleInput {
    constructor(public action: string, public args: string[]) {
    }

    public toString(): string {
        let result: string = this.action;
        for (const arg of this.args) {
            result += " " + arg;
        }
        return result;
    }
}
